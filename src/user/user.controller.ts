import { Controller, Post, Body, Get, Param, Patch, Delete } from "@nestjs/common";
import { UserService } from "./user.service";

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post()
    async addUser(
        @Body('username') username: string,
        @Body('password') pass: string,
        @Body('email') email: string,
    ) {
        const generatedId = await this.userService.insertUser(username, pass, email);
        return { id: generatedId };
    }
    // @Get()
    // async getUsers() {
    //     const users = await this.userService.getUsers();
    //     return users;
    // }

    // @Get(':id')
    // getUser(@Param('id') userId: string, ) {
    //     return this.userService.getOneUser(userId);
    // }

    // @Patch(':id')
    // async updateUser(
    //     @Param('id') userId: string, 
    //     @Body('password') password: string,
    //     @Body('email') email: string,
    //     ) {
    //         await this.userService.updateUser(userId, password, email);
    //         return null;
    //     }
    // @Delete(':id')
    // async removeUser(@Param('id') userId: string,){
    //     await this.userService.deleteUser(userId);
    //     return null;
    // }
}