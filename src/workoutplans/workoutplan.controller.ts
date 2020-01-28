import { Controller, Post, Body, Get, Param, Patch, Delete, UseGuards } from "@nestjs/common";
import { WorkoutPlanService } from "./workoutplan.service";
import { WorkoutService } from "../workout/workout.service";
import { UserWorkoutService } from "../userworkout/userworkout.service";
import { AuthGuard } from "@nestjs/passport";

@Controller('workoutplan')
export class WorkoutPlanController {
    constructor(private readonly workoutPlanService: WorkoutPlanService,
                private readonly workoutService: WorkoutService,
                private readonly userWorkoutService: UserWorkoutService) { }
    
    @UseGuards(AuthGuard('jwt'))
    @Post()
    async addWorkoutPlan(
        @Body('example') exampleWorkoutPlan: string,
        @Body('title') title: string,
        @Body('username') username: string,
        @Body('name') name: string,
        @Body('training') training: any[],
        @Body('trainingPlan') trainingPlan: any[],
        @Body('dates') dates : any[],
        @Body('date') date : Date,
    ) { 
        if(name === "delete"){
            await this.workoutPlanService.deleteAll();
            return {message: "Deleted"};
        }

        if(exampleWorkoutPlan){
            const generatedId = await this.workoutPlanService.insertWorkoutPlan("Gotowy plan",username);
            for(let i = 0; i < trainingPlan.length; i++){
                for (let j = 0; j < trainingPlan.map(({ series }: any) => series.length)[0]; j++) {
                    let tr = trainingPlan[i]['series'][j];
                    await this.workoutService.insertWorkout(
                        generatedId,
                        trainingPlan[i]['name'],
                        tr['id'],
                        tr['repeat'],
                        tr['kg'],
                        tr['time'],);
                }
            }
            dates.forEach(date => this.userWorkoutService.insertWorkout(generatedId, username, title, date));
        }
        else if(name){
            const generatedId = await this.workoutPlanService.insertWorkoutPlan(name, username);
            for(let i = 0; i < training.length; i++){
                for (let j = 0; j < training.map(({ series }: any) => series.length)[0]; j++) {
                    let tr = training[i]['series'][j];
                    await this.workoutService.insertWorkout(
                        generatedId,
                        training[i]['name'],
                        tr['id'],
                        tr['repeat'],
                        tr['kg'],
                        tr['time'],);
                }
            }
        }
        else if(title){
            dates.forEach(date => this.userWorkoutService.insertWorkout(trainingPlan[0]['id'], username, title, date));
        }
        else if(date){
            let result = [];
            const workoutsId = await this.userWorkoutService.getWorkoutsByDate(date,username);
            const duplicates = await this.workoutPlanService.searchForDupicates(workoutsId);
            const workoutsData = await this.workoutService.getWorkoutById(workoutsId);
            result = await this.workoutPlanService.getWorkoutPlansBack(workoutsData, username, 1, duplicates);
            for(let i = 0; i < workoutsId.length; i++){
                result[i]['id'] = workoutsId[i]._id;
                result[i]['title'] = workoutsId[i].planName;
                result[i]['dates'] = await this.userWorkoutService.getWorkoutAllDates(result[i].trainingPlan.id);
            }
            return result;
        }
        else{
            let result = [];
            let exercisesList = await this.workoutService.getWorkouts();
            result = await this.workoutPlanService.getWorkoutPlansBack(exercisesList, username);
            return result;
        }  
    }
    
    // @UseGuards(AuthGuard('jwt'))
    // @Get()
    // async getWorkoutPlans() {
    //     const workoutPlans = await this.workoutPlanService.getWorkoutPlans();
    //     return workoutPlans;
    // }
    @UseGuards(AuthGuard('jwt'))
    @Patch()
    async changeWorkoutPlan(
        @Body('id') id: string,
        @Body('username') username: string,
        @Body('name') name: string,
        @Body('training') training: any[],
        ){
        await this.workoutPlanService.deleteOne(id);
        await this.workoutService.deleteWorkout(id);
        await this.userWorkoutService.deleteExercises(id);
        const generatedId = await this.workoutPlanService.insertWorkoutPlan(name,username);
            for(let i = 0; i < training.length; i++){
                for (let j = 0; j < training.map(({ series }: any) => series.length)[0]; j++) {
                    let tr = training[i]['series'][j];
                    await this.workoutService.insertWorkout(
                        generatedId,
                        training[i]['name'],
                        tr['id'],
                        tr['repeat'],
                        tr['kg'],
                        tr['time'],);
                }
            }
    }
    @UseGuards(AuthGuard('jwt'))
    @Delete()
    async deletePlan(@Body('id') id: string,){
        await this.workoutPlanService.deleteOne(id);
        await this.workoutService.deleteWorkout(id);
        await this.userWorkoutService.deleteExercises(id);
    }
}