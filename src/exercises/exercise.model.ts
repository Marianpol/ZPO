import * as mongoose from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';

export const ExerciseSchema = new mongoose.Schema({
    name : { type: String, required: true },
    username: {type: String, required: true },
}) 

export interface Exercise extends mongoose.Document {
    id: string;
    name: string;
    username: string;
}