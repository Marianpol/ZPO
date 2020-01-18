import { Injectable, NotFoundException } from "@nestjs/common";
import { WorkoutPlan } from "./workoutplan.model";
import { InjectModel  } from "@nestjs/mongoose";
import { Model } from 'mongoose';

@Injectable()
export class WorkoutPlanService {
    private workoutPlans: WorkoutPlan[] = [];

    constructor(@InjectModel('WorkoutPlan') private readonly workoutPlanModel: Model<WorkoutPlan>){}

    async insertWorkoutPlan(
        name: string,
        exerciseName: string,
        // username: string,
        series: number,
        reps: number,
        weight: number,
        time: number,
        ){
        const newWorkoutPlan = new this.workoutPlanModel({
            name,
            exerciseName,
            // username,
            series,
            repetitions: reps,
            weight,
            time,
            // workoutDate,
        });
        const result = await newWorkoutPlan.save();
        return result.id;
    }

    async getWorkoutPlans(){
        const workoutPlans = await this.workoutPlanModel.find().exec();
        return workoutPlans.map((wp) => ({id: wp.id, name: wp.name, exerciseName: wp.exerciseName, series: wp.series, reps: wp.repetitions, weight:wp.weight, time: wp.time, }));
    }
    async getWrokoutPlansNames(){
        const workoutPlans = await this.workoutPlanModel.find().exec();
        return Array.from(new Set(workoutPlans.map((item: any) => item.name)));
    }

    async getWorkoutPlansBack(name: string){
        const workoutPlans = await this.workoutPlanModel.find({name: name});
        return workoutPlans;
    }
    // async getWorkoutPlan(name: string){
    //     const workoutPlan = await this.findUser(userId);
    //     return {id: user.id, username: user.username, pass: user.password, email: user.email,};
    // }
    async findWorkoutPlanExercise(id: string): Promise <WorkoutPlan>{
        let workoutPlanExe;
        try{
            workoutPlanExe = await this.workoutPlanModel.findById(id);
        } catch (error){
            throw new NotFoundException("Could not find exercise in the plan");
        }
        return workoutPlanExe;
    }
    
    async updateWorkoutPlanExercise(exId: string, name: string) {
        const updatedWorkoutPlanExe = await this.findWorkoutPlanExercise(exId);
        if (name) {
            updatedWorkoutPlanExe.name = name;
        }
        updatedWorkoutPlanExe.save();
    }

    async deleteWorkoutPlanExercise(exId: string) {
        const result = await this.workoutPlanModel.deleteOne({_id: exId}).exec();
        if (result.n === 0){
            throw new NotFoundException('Could not find exercise in the plan');
        }
    }
    
}