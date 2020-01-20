import { Injectable, NotFoundException } from "@nestjs/common";
import { Exercise } from "./exercise.model";
import { InjectModel  } from "@nestjs/mongoose";
import { Model } from 'mongoose';

@Injectable()
export class ExerciseService {
    private exercises: Exercise[] = [];

    constructor(@InjectModel('Exercise') private readonly exerciseModel: Model<Exercise>){}

    async insertExercise(name: string){
        const newExercise = new this.exerciseModel({
            name,
        });
        const result = await newExercise.save();
        return result.id;
    }

    async getExercises(){
        const exercises = await this.exerciseModel.find().exec();
        let exArray = [];
        exercises.map((ex) => exArray.push(ex.name));
        return exArray;
    }

    async deleteAll(){
        await this.exerciseModel.collection.drop();
    }
    async getOneExercise(exerciseId: string){
        const exercise = await this.findExercise(exerciseId);
        return {id: exercise.id, name: exercise.name,};
    }
    async findExercise(id: string): Promise <Exercise>{
        let exercise;
        try{
            exercise = await this.exerciseModel.findById(id);
        } catch (error){
            throw new NotFoundException("Could not find exercise");
        }
        return exercise;
    }
    
    async updateExercise(exerciseId: string, exerciseName: string) {
        const updatedExercise = await this.findExercise(exerciseId);
        if (name) {
            updatedExercise.name = name;
        }
        updatedExercise.save();
    }

    async deleteExercise(exerciseId: string) {
        const result = await this.exerciseModel.deleteOne({_id: exerciseId}).exec();
        if (result.n === 0){
            throw new NotFoundException('Could not find');
        }
    }

}