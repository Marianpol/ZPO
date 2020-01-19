import * as mongoose from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';

export const UserWorkoutSchema = new mongoose.Schema({
    planId: {type: String, required: true },
    planName: {type: String, required: true },
    // username: {type: String, required: true },
    workoutDate: {type: Date, required: true },

}) 

export interface UserWorkout extends mongoose.Document {
    id: string;
    planId: string;
    planName: string;
    // username: string;
    workoutDate: Date;
}