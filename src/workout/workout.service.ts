import { Injectable, NotFoundException } from "@nestjs/common";
import { Workout } from "./workout.model";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from 'mongoose';

@Injectable()
export class WorkoutService {
    private workouts: Workout[] = [];

    constructor(@InjectModel('Workout') private readonly workoutModel: Model<Workout>){}

    async insertWorkout(
        exerciseName: string,
        username: string,
        series: number,
        reps: number,
        weight: number,
        workoutDate: Date
        ){
            const newWorkout = new this.workoutModel({
                exerciseName,
                username,
                series,
                repetitions: reps,
                weight,
                workoutDate,
            });
            const result = await newWorkout.save();
            return result.id;
    }

    async getWorkouts(){
        const exercises = await this.workoutModel.find().exec();
        return exercises.map((ex) => ({id: ex.id, name: ex.name,}));
    }
    async getOneExercise(exerciseId: string){
        const exercise = await this.findExercise(exerciseId);
        return {id: exercise.id, name: exercise.name,};
    }
    async findExercise(id: string): Promise <Exercise>{
        let exercise;
        try{
            exercise = await this.workoutModel.findById(id);
        } catch (error){
            throw new NotFoundException("Could not find exercise");
        }
        return exercise;
    }
    
    // async updateExercise(exerciseId: string, exerciseName: string) {
    //     const updatedExercise = await this.findExercise(exerciseId);
    //     if (name) {
    //         updatedExercise.name = name;
    //     }
    //     updatedExercise.save();
    // }

    async deleteExercise(exerciseId: string) {
        const result = await this.workoutModel.deleteOne({_id: exerciseId}).exec();
        if (result.n === 0){
            throw new NotFoundException('Could not find');
        }
    }
}