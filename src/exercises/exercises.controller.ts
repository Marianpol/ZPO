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
    ) {
        if(exerciseName === "delete"){
            await this.exercisesService.deleteAll();
            return {message: "Deleted"};
        }
        const generatedId = await this.exercisesService.insertExercise(exerciseName);
        return { id: generatedId };
    }
    @UseGuards(AuthGuard('jwt'))
    @Get()
    async getAllExercises() {
        const exercises = await this.exercisesService.getExercises();
        return exercises;
    }

    @Get(':id')
    getExercise(@Param('id') exerciseId: string, ) {
        return this.exercisesService.getOneExercise(exerciseId);
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