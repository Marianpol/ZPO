import { Controller, Post, Body, Get, Param, Patch, Delete, UseGuards } from "@nestjs/common";
import { ExerciseService } from "./exercises.service";
import { AuthGuard } from "@nestjs/passport";

@Controller('exercises')
export class ExercisesController {
    constructor(private readonly exercisesService: ExerciseService) { }

    @UseGuards(AuthGuard('jwt'))
    @Post()
    async addExercise(
        @Body('name') exerciseName: string,
        @Body('username') username: string,
    ) { 
        if(exerciseName === "delete"){
            await this.exercisesService.deleteAll();
            return {message: "Deleted"};
        }
        // if(username && exerciseName == ""){
        //     console.log(exerciseName, username, "zobacz");
        //     const exercises = await this.exercisesService.getExercises(username);
        //     return exercises;
        // }
        const generatedId = await this.exercisesService.insertExercise(exerciseName,username);
        return { id: generatedId };
    }

    @Get(':username')
    async getExercise(@Param('username') username: string, ) {
        const exercises = await this.exercisesService.getExercises(username);
        return exercises;
    }

    @Patch(':id')
    async updateExercise(
        @Param('id') exerciseId: string, 
        @Body('name') exerciseName: string,
        ) {
            await this.exercisesService.updateExercise(exerciseId, exerciseName);
            return null;
        }
    @UseGuards(AuthGuard('jwt'))
    @Delete()
    async removeExercise(@Body('exercises') exercises: any[],){
        await this.exercisesService.deleteExercise(exercises);
        return null;
    }
}