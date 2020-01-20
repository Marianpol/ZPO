import { Injectable} from "@nestjs/common";
import { WorkoutPlanExample } from "./workoutplanexample.model";
import { InjectModel  } from "@nestjs/mongoose";
import { Model } from 'mongoose';

@Injectable()
export class WorkoutPlanExampleService {
    private workoutPlans: WorkoutPlanExample[] = [];

    constructor(@InjectModel('WorkoutPlanExample') private readonly workoutPlanExampleModel: Model<WorkoutPlanExample>){}

    async insertWorkoutPlan(
        name: string,
        planType: string,
        description: string,
        img: string,
        exerciseName: string,
        // username: string,
        series: number,
        reps: number,
        weight: number,
        time: number,
        ){
        const newWorkoutPlan = new this.workoutPlanExampleModel({
            name,
            planType,
            description,
            img,
            exerciseName,
            // username,
            series,
            repetitions: reps,
            weight,
            time,
        });
        const result = await newWorkoutPlan.save();
        return result.id;
    }

    async getWrokoutPlansNames(){
        const workoutPlans = await this.workoutPlanExampleModel.find().exec();
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
        let workoutPlans = await this.workoutPlanExampleModel.find().exec();
        let workoutPlanNames = Array.from(new Set(workoutPlans.map((item: any) => item.name)));
        let workoutPlanType = Array.from(new Set(workoutPlans.map((item: any) => item.planType)));
        let workoutPlanDesc = workoutPlans.map((item: any) => item.description);
        let workoutPlanimg = workoutPlans.map((item: any) => item.img);
        workoutPlans = [];
        for (let wp = 0; wp < workoutPlanNames.length; wp++){
            let selectedWorkoutPlan = await this.workoutPlanExampleModel.find({name: workoutPlanNames[wp]})
            let exercises = this.getWrokoutPlansExercisesNames(selectedWorkoutPlan);
            let exercisesAllNames = this.getWrokoutPlanSeries(selectedWorkoutPlan);
            let x = this.getSeriesNumber(exercises,exercisesAllNames);
            let restoredPlan = {};
            let restoredExercise = {};
            let restoredSeries = {};
            let series = [];
            let training = [];
            let counter = 0;
            
            restoredPlan['id'] = counter;
            restoredPlan['name'] = workoutPlanNames[wp];
            for(let i = 0; i < x.length; i++){
                restoredExercise['id'] = i;
                restoredExercise['name'] = exercises[i];
                for(let j = counter; j < counter + x[i] ; j++){
                    // console.log(selectedWorkoutPlan[j].series);
                    restoredSeries['id'] = selectedWorkoutPlan[j].series;
                    restoredSeries['repeat'] = selectedWorkoutPlan[j].repetitions;
                    restoredSeries['kg'] = selectedWorkoutPlan[j].weight;
                    restoredSeries['time'] = selectedWorkoutPlan[j].time;
                    restoredPlan['planType'] = selectedWorkoutPlan[j].planType;
                    restoredPlan['description'] = selectedWorkoutPlan[j].description;
                    restoredPlan['img'] = selectedWorkoutPlan[j].img;
                    series.push(restoredSeries);
                    console.log(restoredSeries);
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

    async getPlansByTypes(plansList: any[]){
        let mapInfo = {};
        plansList.forEach(function(elem) {
            console.log(elem['training']);
            if(elem['planType'] in mapInfo){
                mapInfo[elem['planType']].push(elem);
            }
            else{
                mapInfo[elem['planType']] = [];
                mapInfo[elem['planType']].push(elem);
            }
        })
        // console.log(mapInfo);
        return mapInfo;
    }
    async getWorkoutPlans(){
        const workoutPlans = await this.workoutPlanExampleModel.find().exec();
        return workoutPlans;
    }

    async deleteAll(){
        await this.workoutPlanExampleModel.collection.drop();
    }    
}