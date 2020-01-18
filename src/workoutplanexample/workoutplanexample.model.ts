import * as mongoose from 'mongoose'
import { MongooseModule } from '@nestjs/mongoose'


export const WorkoutPlanExampleSchema = new mongoose.Schema({
    name: { type: String, required: true },
    exerciseName : { type: String, required: true },
    // username: {type: String, required: true },
    series: {type: Number, required: true },
    repetitions: {type: Number, required: true },
    weight: { type: Number, required: false },
    time: {type: Number, required: false },
    // workoutDate: {type: Date, required: true },
})
export interface WorkoutPlanExample extends mongoose.Document {
    id: string;
    name: string;
    exerciseName: string;
    // username: string;
    series: number;
    repetitions: number;
    weight: number;
    time: number,
    // workoutDate: Date;
}

