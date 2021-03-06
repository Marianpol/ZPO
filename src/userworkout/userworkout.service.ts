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
        username: string,
        workoutDate: Date,
        ){
            const newWorkout = new this.userWorkoutModel({
                planId,
                planName,
                username,
                workoutDate,
            });
            console.log(planId,
                planName,
                username,
                workoutDate)
            const result = await newWorkout.save();
            return result.id;
    }

    async getWorkoutInfo(username: string){
        const workouts = await this.userWorkoutModel.find({username: username}).exec();
        let dateAndTitle = {};
        let dates = [];
        let mapInfo = {};
        workouts.forEach(function(elem) {
            if(elem.workoutDate.getDate() in dateAndTitle){
                dateAndTitle[elem.workoutDate.getDate()].push(elem.planName);
            }
            else{
                dateAndTitle[elem.workoutDate.getDate()] = [];
                dateAndTitle[elem.workoutDate.getDate()].push(elem.planName);
            }
        })
        workouts.forEach(item => dates.push(item.workoutDate));
        mapInfo['dates'] = dateAndTitle;
        mapInfo['calendarDates'] = dates;
        return mapInfo;
    }

    async getAllWorkouts(username: string){
        const workouts = await this.userWorkoutModel.find({username: username}).exec();
        return workouts;
    }

    async getWorkoutsByDate(date: Date, username: string){
        const result = this.userWorkoutModel.find({ workoutDate: new Date(date), username: username})
        return result;
    }
    async getWorkoutAllDates(id: string){
        const workouts = await this.userWorkoutModel.find({ planId: id})
        const dates = workouts.map((workout: any) => workout.workoutDate);
        return dates;
    }
    
    async deleteAll(){
        await this.userWorkoutModel.collection.drop();
    }

    async deleteExercises(id: string) {
        const result = await this.userWorkoutModel.deleteMany({planId: id}).exec();
        // if (result.n === 0){
        //     throw new NotFoundException('Could not find exercises in userworkout');
        // }
    }

    async deleteWorkoutFromCalendar(id: string){
        const result = await this.userWorkoutModel.deleteOne({_id: id}).exec();
        if (result.n === 0){
            throw new NotFoundException('Could not find workout on given date');
        }
    }
}