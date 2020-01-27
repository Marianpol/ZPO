import { Injectable, NotFoundException} from "@nestjs/common";
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
        time: number,

        ){
            const newWorkout = new this.workoutModel({
                planId,
                exerciseName,
                // username,
                series,
                repetitions: reps,
                weight,
                time,
            });
            const result = await newWorkout.save();
            return result.id;
    }

    async getWorkouts(){
        const workouts = await this.workoutModel.find().exec();
        return workouts;   
    }
    async getWorkoutById(workoutsBaseInfo : any[]){
        let workouts = [];
        for(let workout of workoutsBaseInfo){
            let temp = await this.workoutModel.find({planId: workout.planId}).exec();
            temp.forEach(serie => workouts.push(serie));
        }
        return workouts;   
    }

    async deleteAll(){
        await this.workoutModel.collection.drop();
    }

    async deleteWorkout(id: string) {
        const result = await this.workoutModel.deleteMany({planId: id}).exec();
        if (result.n === 0){
            throw new NotFoundException('Could not find in workout');
        }
    }
}