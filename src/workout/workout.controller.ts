import { Controller, Post, Body, Get, UseGuards} from "@nestjs/common";
import { WorkoutService } from "./workout.service";
import { AuthGuard } from "@nestjs/passport";

@Controller('workout')
export class WorkoutController {
    constructor(private readonly workoutService: WorkoutService) { }

    @Post()
    async addWorkout(
        @Body('name') exerciseName: string,
    ) {
        if(exerciseName === "delete"){
            await this.workoutService.deleteAll();
            return {message: "Deleted"};
        }
    }
    
    // @UseGuards(AuthGuard('jwt'))
    @Get()
    async getWorkouts() {
        const workouts = await this.workoutService.getWorkouts();
        return workouts;
    }
}