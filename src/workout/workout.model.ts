import * as mongoose from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';

export const WorkoutSchema = new mongoose.Schema({
    exerciseName : { type: String, required: true },
    username: {type: String, required: true },
    series: {type: Number, required: true },
    repetitions: {type: Number, required: true },
    weight: { type: Number, required: true },
    workoutDate: {type: Date, required: true },

}) 

export interface Workout extends mongoose.Document {
    id: string;
    exerciseName: string;
    username: string;
    series: number;
    repetitions: number;
    weight: number;
    workoutDate: Date;
}