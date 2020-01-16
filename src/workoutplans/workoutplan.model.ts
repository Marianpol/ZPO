import * as mongoose from 'mongoose'
import { MongooseModule } from '@nestjs/mongoose'
import { WorkoutSchema } from '../workout/workout.model'

export const WorkoutPlanSchema = new mongoose.Schema({
    name: { type: String, required: true },
})
export interface WorkoutPlan extends mongoose.Document {
    id: string;
    name: string;
}