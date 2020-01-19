import { Injectable, NotFoundException } from "@nestjs/common";
import { UserWorkout } from "./userworkout.model";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from 'mongoose';

@Injectable()
export class UserWorkoutService {
    private workouts: UserWorkout[] = [];

    constructor(@InjectModel('UserWorkout') private readonly userWorkoutModel: Model<UserWorkout>){}

    async insertWorkout(
        planId: string,
        planName: string,
        // username: string,
        workoutDate: Date,
        ){
            const newWorkout = new this.userWorkoutModel({
                planId,
                planName,
                // username,
                workoutDate,
            });
            const result = await newWorkout.save();
            return result.id;
    }

    async getWorkoutInfo(){
        const workouts = await this.userWorkoutModel.find().exec();
        let mapInfo = {};
        workouts.forEach(function(elem) {
            if(elem.workoutDate.getDate() in mapInfo){
                mapInfo[elem.workoutDate.getDate()].push(elem.planName);
            }
            else{
                mapInfo[elem.workoutDate.getDate()] = [];
                mapInfo[elem.workoutDate.getDate()].push(elem.planName);
            }
        })
        return mapInfo;
    }

    async getWorkouts(){
        const workouts = await this.userWorkoutModel.find().exec();
        return workouts;
        // return workouts.map((item) => ({
        //     idDB: item._id,
        //     id: item.planId,
        //     name: item.exerciseName,
        //     // username: item.username,
        //     series: item.series,
        //     reps: item.repetitions,
        //     weight: item.weight,
        //     time: item.time,
        //     // workoutDate: item.workoutDate,
        // }))
        
    }
    async deleteAll(){
        await this.userWorkoutModel.collection.drop();
    }

    // async getOneE(exerciseId: string){
    //     const exercise = await this.findWorkout();
    //     return {id: exercise.id, name: exercise.name,};
    // }
    // async findWorkout(){
    //     const workouts = await this.userWorkoutModel.find().exec();
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

    // async deleteWorkoutSeries(workoutId: string) {
    //     const result = await this.userWorkoutModel.deleteOne({_id: workoutId}).exec();
    //     if (result.n === 0){
    //         throw new NotFoundException('Could not find');
    //     }
    // }
}