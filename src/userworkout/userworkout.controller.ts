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
        if(name === ""){
            const workouts = await this.workoutService.getAllWorkouts();
            return workouts;
        }
    }
    @UseGuards(AuthGuard('jwt'))
    @Get()
    async getWorkouts() {
        const workouts = await this.workoutService.getWorkoutInfo();
        return workouts;
    }
    @UseGuards(AuthGuard('jwt'))
    @Delete()
    async deleteFromCalendar(@Body('id') id: string,){
        await this.workoutService.deleteWorkoutFromCalendar(id);
    }
}