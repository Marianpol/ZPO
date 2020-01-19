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
    }
    
    async deleteAll(){
        await this.userWorkoutModel.collection.drop();
    }
}