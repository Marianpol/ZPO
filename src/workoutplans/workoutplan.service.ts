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
        ){
        const newWorkoutPlan = new this.workoutPlanModel({
            name,
        });
        const result = await newWorkoutPlan.save();
        return result.id;
    }

    async getWorkoutPlans(){
        const workoutPlans = await this.workoutPlanModel.find().exec();
        return workoutPlans.map((wp) => ({id: wp.id, name: wp.name}));
    }

    async getWrokoutPlansNames(){
        const workoutPlans = await this.workoutPlanModel.find().exec();
        return Array.from(new Set(workoutPlans.map((item: any) => item.name)));
    }
    getWrokoutPlanExercisesNames(workoutPlans: any[]){
        return Array.from(new Set(workoutPlans.map((item: any) => item.exerciseName)));
    }
    getWrokoutPlanAllExercisesNames(workoutPlans: any[]){
        return workoutPlans.map((item: any) => item.exerciseName);   
    }
    getSeriesNumber(exercises: any[], exercisesNames: any[]){
        let namesNumber = []
        for(let elem of exercises){
            namesNumber.push(exercisesNames.filter(c => c === elem).length);
        }
        return namesNumber;
    }
    async getWorkoutPlansBack(workoutPlansExercises: any[]){
        let readyPlan = [];
        let workoutPlans = await this.workoutPlanModel.find().exec();
        for(let workoutPlan of workoutPlans){
            let workoutPlanExercises = workoutPlansExercises.filter(item => item["planId"] == workoutPlan._id);
            let exercises = this.getWrokoutPlanExercisesNames(workoutPlanExercises);
            let exercisesAllNames = this.getWrokoutPlanAllExercisesNames(workoutPlanExercises);
            let exercisesSieriesNumbers = this.getSeriesNumber(exercises,exercisesAllNames);
            let restoredPlan = {};
            let restoredExercise = {};
            let restoredSeries = {};
            let series = [];
            let training = [];
            let counter = 0;

            restoredPlan['id'] = workoutPlan["_id"];
            restoredPlan['name'] = workoutPlan["name"];
            for(let i = 0; i < exercisesSieriesNumbers.length; i++){
                restoredExercise['id'] = i;
                restoredExercise['name'] = exercises[i];
                for(let j = counter; j < counter + exercisesSieriesNumbers[i] ; j++){
                    restoredSeries['id'] = workoutPlanExercises[j].series;
                    restoredSeries['repeat'] = workoutPlanExercises[j].repetitions;
                    restoredSeries['kg'] = workoutPlanExercises[j].weight;
                    restoredSeries['time'] = workoutPlanExercises[j].time;
                    series.push(restoredSeries);
                    restoredSeries = {};
                }
                counter += exercisesSieriesNumbers[i];
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
    async deleteAll(){
        await this.workoutPlanModel.collection.drop();
    }
    
}