import { Controller, Post, Body, Get, Param, Patch, Delete } from "@nestjs/common";
import { WorkoutPlanService } from "./workoutplan.service";
import { WorkoutService } from "../workout/workout.service";
import { UserWorkoutService } from "../userworkout/userworkout.service";

@Controller('workoutplan')
export class WorkoutPlanController {
    constructor(private readonly workoutPlanService: WorkoutPlanService,
                private readonly workoutService: WorkoutService,
                private readonly userWorkoutService: UserWorkoutService) { }
    
    @Post()
    async addWorkoutPlan(
        @Body('title') title: string,
        @Body('name') name:string,
        @Body('training') training: any[],
        @Body('trainingPlan') trainingPlan: any[],
        @Body('dates') dates : any[],
        @Body('date') date : Date,
    ) { 
        if(name === "delete"){
            await this.workoutPlanService.deleteAll();
            return {message: "Deleted"};
        }

        if(name){
            const generatedId = await this.workoutPlanService.insertWorkoutPlan(name);
            for(let i = 0; i < training.length; i++){
                for (let j = 0; j < training.map(({ series }: any) => series.length)[0]; j++) {
                    let tr = training[i]['series'][j];
                    this.workoutService.insertWorkout(
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
            dates.forEach(date => this.userWorkoutService.insertWorkout(trainingPlan[0]['id'], title, date));
        }
        else if(date){
            let result = [];
            const workoutsId = await this.userWorkoutService.getWorkoutsByDate(date);
            const duplicates = await this.workoutPlanService.searchForDupicates(workoutsId);
            const workoutsData = await this.workoutService.getWorkoutById(workoutsId);
            result = await this.workoutPlanService.getWorkoutPlansBack(workoutsData, 1, duplicates);
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
            result = await this.workoutPlanService.getWorkoutPlansBack(exercisesList);
            return result;
        }  
    }
    
    @Get()
    async getWorkoutPlans() {
        const workoutPlans = await this.workoutPlanService.getWorkoutPlans();
        return workoutPlans;
    }
}