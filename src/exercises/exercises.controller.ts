import { Controller, Post, Body, Get, Param, Patch, Delete } from "@nestjs/common";
import { ExerciseService } from "./exercises.service";

@Controller('exercises')
export class ExercisesController {
    constructor(private readonly exercisesService: ExerciseService) { }

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
    @Delete(':id')
    async removeExercise(@Param('id') exerciseId: string,){
        await this.exercisesService.deleteExercise(exerciseId);
        return null;
    }
}