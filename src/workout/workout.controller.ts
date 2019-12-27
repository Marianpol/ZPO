import { Controller, Post, Body, Get, Param, Patch, Delete } from "@nestjs/common";
import { WorkoutService } from "./workout.service";

@Controller('workout')
export class WorkoutController {
    constructor(private readonly workoutService: WorkoutService) { }

    @Post()
    async addWorkout(
        @Body('name') exerciseName: string,
        @Body('username') username: string,
        @Body('series') series: number,
        @Body('repetitions') reps: number,
        @Body('weight') weight: number,
        @Body('workoutDate') workoutDate: Date
    ) {
        const generatedId = await this.workoutService.insertWorkout(exerciseName,username, series, reps, weight, workoutDate);
        return { id: generatedId };
    }
    @Get()
    async getWorkouts(@Body('username') username: string,
                      @Body('workoutDate') workoutDate: Date) {
        const workouts = await this.workoutService.getWorkouts(username, workoutDate);
        return workouts;
    }

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
    @Delete(':id')
    async removeWorkout(@Param('id') workoutId: string,){
        await this.workoutService.deleteWorkoutSeries(workoutId);
        return null;
    }
}