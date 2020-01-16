import { Injectable, NotFoundException } from "@nestjs/common";
import { Workout } from "./workout.model";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from 'mongoose';

@Injectable()
export class WorkoutService {
    private workouts: Workout[] = [];

    constructor(@InjectModel('Workout') private readonly workoutModel: Model<Workout>){}

    async insertWorkout(
        planId: string,
        exerciseName: string,
        // username: string,
        series: number,
        reps: number,
        weight: number,
        // workoutDate: Date
        ){
            const newWorkout = new this.workoutModel({
                planId,
                exerciseName,
                // username,
                series,
                repetitions: reps,
                weight,
                // workoutDate,
            });
            const result = await newWorkout.save();
            return result.id;
    }

    async getWorkouts(){
        const workouts = await this.workoutModel.find().exec();
        // let finedWorkout = [];
        // for (let x of workouts){
        //     if(x.username === uname && x.workoutDate.getTime() === new Date(wdate).getTime()){
        //         finedWorkout.push(x);
        //     }
        // }
        return workouts.map((item) => ({
            id: item.planId,
            name: item.exerciseName,
            // username: item.username,
            series: item.series,
            reps: item.repetitions,
            weight: item.weight,
            // workoutDate: item.workoutDate,
        }))
        // return finedWorkout.map((wo) => ({
        //     id: wo.id,
        //     name: wo.exerciseName,
        //     username: wo.username,
        //     series: wo.series,
        //     reps: wo.repetitions,
        //     weight: wo.weight,
        //     workoutDate: wo.workoutDate,
        // }));
        
    }////
    // async getOneE(exerciseId: string){
    //     const exercise = await this.findWorkout();
    //     return {id: exercise.id, name: exercise.name,};
    // }
    // async findWorkout(){
    //     const workouts = await this.workoutModel.find().exec();
    //     for (let x of workouts){
    //         console.log(x);
    //     }


    //     return workouts;
    // }
    
    // async updateExercise(exerciseId: string, exerciseName: string) {
    //     const updatedExercise = await this.findExercise(exerciseId);
    //     if (name) {
    //         updatedExercise.name = name;
    //     }
    //     updatedExercise.save();
    // }

    async deleteWorkoutSeries(workoutId: string) {
        const result = await this.workoutModel.deleteOne({_id: workoutId}).exec();
        if (result.n === 0){
            throw new NotFoundException('Could not find');
        }
    }
}