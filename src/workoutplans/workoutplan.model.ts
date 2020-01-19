import * as mongoose from 'mongoose'
import { MongooseModule } from '@nestjs/mongoose'

export const WorkoutPlanSchema = new mongoose.Schema({
    name: { type: String, required: true },
    // username: {type: String, required: true },
    // workoutDate: {type: Date, required: true },
})
export interface WorkoutPlan extends mongoose.Document {
    id: string;
    name: string;
    // username: string;
    // workoutDate: Date;
}

