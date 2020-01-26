import * as mongoose from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';

export const UserSchema = new mongoose.Schema({
    username :  { type: String, required: true, unique: true, },
    password :  { type: String, required: true, unique: false, },
    email:      { type: String, required: true, unique: true, },
}) 

export interface User extends mongoose.Document {
    id: string;
    username: string;
    password: string;
    email: string;
}