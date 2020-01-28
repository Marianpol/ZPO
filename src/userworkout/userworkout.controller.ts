import { Controller, Post, Body, Get, Param, Patch, Delete, UseGuards } from "@nestjs/common";
import { UserWorkoutService } from "./userworkout.service";
import { AuthGuard } from "@nestjs/passport";

@Controller('userworkout')
export class WorkoutController {
    constructor(private readonly workoutService: UserWorkoutService) { }
    
    @UseGuards(AuthGuard('jwt'))
    @Post()
    async addUserWorkout(
        @Body('name') name: string,
    ) { 
        if(name === "delete"){
            await this.workoutService.deleteAll();
            return {message: "Deleted"};
        }
    }
    @Get('/dates/:id')
    async getDates(@Param('id') username: string, ){
        const workouts = await this.workoutService.getAllWorkouts(username);
        return workouts;
    }
    @Get('/info/:id')
    async getInfo(@Param('id') username: string, ){
        const workouts = await this.workoutService.getWorkoutInfo(username);
        return workouts;
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete()
    async deleteFromCalendar(@Body('id') id: string,){
        await this.workoutService.deleteWorkoutFromCalendar(id);
    }
}