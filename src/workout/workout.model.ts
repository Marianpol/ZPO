import * as mongoose from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';

export const WorkoutSchema = new mongoose.Schema({
    planId: {type: String, required: true },
    exerciseName : { type: String, required: true },
    // username: {type: String, required: true },
    series: {type: Number, required: true },
    repetitions: {type: Number, required: true },
    weight: { type: Number, required: false },
    time: { type: Number, required: false },
}) 

export interface Workout extends mongoose.Document {
    id: string;
    planId: string;
    exerciseName: string;
    // username: string;
    series: number;
    repetitions: number;
    weight: number;
    time: number;
}