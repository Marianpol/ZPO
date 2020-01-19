import { Controller, Post, Body, Get, Param, Patch, Delete } from "@nestjs/common";
import { WorkoutPlanService } from "./workoutplan.service";
import { WorkoutService } from "../workout/workout.service";

@Controller('workoutplan')
export class WorkoutPlanController {
    constructor(private readonly workoutPlanService: WorkoutPlanService,
                private readonly workoutService : WorkoutService) { }
    
    @Post()
    async addWorkoutPlan(
        @Body('name') name: string,
        @Body('training') training: any[],
    ) {
        console.log(this);
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
                    tr['time']);
            }
        }
        return { id: generatedId };
    }
    @Get()
    async getWorkoutPlans() {
        const workoutPlans = await this.workoutPlanService.getWorkoutPlans();
        return workoutPlans;
    }

    // @Get(':id')
    // getUser(@Param('id') userId: string, ) {
    //     return this.userService.getOneUser(userId);
    // }

    @Patch(':id')
    async updateWorkoutPlanExercise(
        @Param('id') planId: string, 
        @Body('name') name: string,
        ) {
            await this.workoutPlanService.updateWorkoutPlanExercise(planId, name);
            return null;
        }
    @Delete(':id')
    async removeWorkoutPlanExercise(@Param('id') planId: string,){
        await this.workoutPlanService.deleteWorkoutPlanExercise(planId);
        return null;
    }
}