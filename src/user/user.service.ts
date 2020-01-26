import { Injectable, NotFoundException } from "@nestjs/common";
import { User } from "./user.model";
import { InjectModel  } from "@nestjs/mongoose";
import { Model } from 'mongoose';

@Injectable()
export class UserService {
    private exercises: User[] = [];

    constructor(@InjectModel('User') private readonly userModel: Model<User>){}

    async insertUser(username: string, pass: string, email: string){
        const newUser = new this.userModel({
            username, password : pass, email,
        });
        const result = await newUser.save();
        return result.id;
    }

    async findUser(username: string){
        const user = await this.userModel.find({username: username}).exec();
        return user;
    }

    // async getUsers(){
    //     const users = await this.userModel.find().exec();
    //     return users.map((us) => ({id: us.id, username: us.username, pass: us.password, email: us.email,}));
    // }

    
    // async getOneUser(email: string){
    //     const user = await this.findUser(userId);
    //     return {username: user.username, pass: user.password, email: user.email,};
    // }
    
    // async updateUser(userId: string, pass: string, email: string) {
    //     const updatedUser = await this.findUser(userId);
    //     if (pass) {
    //         updatedUser.password = pass;
    //     }
    //     if (email) {
    //         updatedUser.email = email;
    //     }
    //     updatedUser.save();
    // }

    // async deleteUser(userId: string) {
    //     const result = await this.userModel.deleteOne({_id: userId}).exec();
    //     if (result.n === 0){
    //         throw new NotFoundException('Could not find user');
    //     }
    // }
}