import { Controller, Post, Body, Get, Param, Patch, Delete } from "@nestjs/common";
import { WorkoutService } from "./workout.service";

@Controller('workout')
export class WorkoutController {
    constructor(private readonly workoutService: WorkoutService) { }

    @Post()
    async addWorkout(
        @Body('pid') planId : string,
        @Body('name') exerciseName: string,
        // @Body('username') username: string,
        @Body('series') series: number,
        @Body('repetitions') reps: number,
        @Body('weight') weight: number,
        // @Body('workoutDate') workoutDate: Date
    ) {
        const generatedId = await this.workoutService.insertWorkout(planId,exerciseName,series, reps, weight);
        return { id: generatedId };
    }
    @Get()
    async getWorkouts() {
        const users = await this.workoutService.getWorkouts();
        return users;
    }
    // }

    // @Get(':id')
    // getExercise(@Param('id') exerciseId: string, ) {
    //     return this.exercisesService.getOneExercise(exerciseId);
    // }

    // @Patch(':id')
    // async updateExercise(
    //     @Param('id') exerciseId: string, 
    //     @Body('name') exerciseName: string,
    //     ) {
    //         await this.exercisesService.updateExercise(exerciseId, exerciseName);
    //         return null;
    //     }
    // @Delete(':id')
    // async removeWorkout(@Param('id') workoutId: string,){
    //     await this.workoutService.deleteWorkoutSeries(workoutId);
    //     return null;
    // }
}