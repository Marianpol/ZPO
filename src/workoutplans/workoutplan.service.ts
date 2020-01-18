import { Injectable, NotFoundException } from "@nestjs/common";
import { WorkoutPlan } from "./workoutplan.model";
import { InjectModel  } from "@nestjs/mongoose";
import { Model } from 'mongoose';
import { WorkoutModule } from "src/workout/workout.module";

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
    getWrokoutPlansExercisesNames(workoutPlans: any[]){
        return Array.from(new Set(workoutPlans.map((item: any) => item.exerciseName)));
    }
    getWrokoutPlanSeries(workoutPlans: any[]){
        return workoutPlans.map((item: any) => item.exerciseName);   
    }
    getSeriesNumber(exercises: any[], exercisesNames: any[]){
        let namesNumber = []
        for(let elem of exercises){
            namesNumber.push(exercisesNames.filter(c => c === elem).length);
        }
        return namesNumber;
    }

    async getWorkoutPlansBack(){
        let readyPlan = [];
        let workoutPlans = await this.workoutPlanModel.find().exec();
        let workoutPlanNames = Array.from(new Set(workoutPlans.map((item: any) => item.name)));
        workoutPlans = [];
        for (let workoutName of workoutPlanNames){
            let selectedWorkoutPlan = await this.workoutPlanModel.find({name: workoutName})
            let exercises = this.getWrokoutPlansExercisesNames(selectedWorkoutPlan);
            let exercisesAllNames = this.getWrokoutPlanSeries(selectedWorkoutPlan);
            let x = this.getSeriesNumber(exercises,exercisesAllNames);
            let restoredPlan = {};
            let restoredExercise = {};
            let restoredSeries = {};
            let series = [];
            let training = [];
            let counter = 0;
            
            restoredPlan['name'] = workoutName;
            for(let i = 0; i < x.length; i++){
                restoredExercise['id'] = i;
                restoredExercise['name'] = exercises[i];
                for(let j = counter; j < counter + x[i] ; j++){
                    restoredSeries['id'] = selectedWorkoutPlan[j].series;
                    restoredSeries['repeat'] = selectedWorkoutPlan[j].repetitions;
                    if(selectedWorkoutPlan[j].weight){
                        restoredSeries['kg'] = selectedWorkoutPlan[j].weight;
                    }
                    else{
                        restoredSeries['time'] = selectedWorkoutPlan[j].time;
                    }
                    series.push(restoredSeries);
                    restoredSeries = {};
                }
                counter += x[i];
                restoredExercise['series'] = series;
                series = [];
                training.push(restoredExercise);
                restoredExercise = {};
            }
            restoredPlan['training'] = training;
            readyPlan.push(restoredPlan);
            restoredPlan = {};
        }
        return readyPlan;
    }

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