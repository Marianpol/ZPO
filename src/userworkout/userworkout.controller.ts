import { Controller, Post, Body, Get, Param, Patch, Delete } from "@nestjs/common";
import { UserWorkoutService } from "./userworkout.service";

@Controller('userworkout')
export class WorkoutController {
    constructor(private readonly workoutService: UserWorkoutService) { }
    
    @Post()
    async addUserWorkout(
        @Body('name') name: string,
    ) { 
        if(name === "delete"){
            await this.workoutService.deleteAll();
            return {message: "Deleted"};
        }
    }
    @Get()
    async getWorkouts() {
        const workouts = await this.workoutService.getWorkoutInfo();
        return workouts;
    }
}