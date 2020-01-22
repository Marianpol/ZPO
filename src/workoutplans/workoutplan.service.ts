import { Injectable, NotFoundException } from "@nestjs/common";
import { WorkoutPlan } from "./workoutplan.model";
import { InjectModel  } from "@nestjs/mongoose";
import { Model } from 'mongoose';
import { EOVERFLOW } from "constants";

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

    async searchForDupicates(workouts: any[]){
        const ids = [];
        let theSamePlanCounter = {};
        workouts.forEach(elem => ids.push(elem.planId));
        ids.forEach(function(i) { theSamePlanCounter[i] = (theSamePlanCounter[i]||0) + 1;});
        return theSamePlanCounter;
    }

    async getWorkoutPlansBack(workoutPlansExercises: any[], param = 0, duplicates: {[key: string]: number;} =  {}){
        let readyPlan = [];
        let workoutPlans = [];
        if(param){
            let setOfPlanNames = Array.from(new Set(workoutPlansExercises.map((item: any) => item.planId)));
            workoutPlans = await this.workoutPlanModel.find().where('_id').in(setOfPlanNames).exec();
            for (const [key, value] of Object.entries(duplicates)) {
                if(value > 1){
                    let toCopy = workoutPlans.filter(item => item._id == key);
                    for(let i = 0; i < value - 1; i++){
                        workoutPlans.push(toCopy[0]);
                    }
                }
            }
            console.log(workoutPlans);
        }
        else{
            workoutPlans = await this.workoutPlanModel.find().exec();
        }
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
            if(param){
                let temp = {trainingPlan:restoredPlan};
                readyPlan.push(temp);
            }
            else{
                readyPlan.push(restoredPlan);
            }
            restoredPlan = {};
        }
        return readyPlan;
    }

    async deleteAll(){
        await this.workoutPlanModel.collection.drop();
    }

    async deleteOne(id: string) {
        const result = await this.workoutPlanModel.deleteOne({_id: id}).exec();
        if (result.n === 0){
            throw new NotFoundException('Could not find in workoutplan');
        }
    }
    
}