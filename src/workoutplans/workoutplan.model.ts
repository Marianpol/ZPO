import * as mongoose from 'mongoose'
import { MongooseModule } from '@nestjs/mongoose'

export const WorkoutPlanSchema = new mongoose.Schema({
    name: { type: String, required: true },
    exerciseName: { type: String, required: true },
})
export interface WorkoutPlan extends mongoose.Document {
    id: string;
    name: string; 
    exerciseName: string;
}