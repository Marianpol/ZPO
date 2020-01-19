import { Controller, Post, Body, Get} from "@nestjs/common";
import { WorkoutService } from "./workout.service";

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

    @Get()
    async getWorkouts() {
        const workouts = await this.workoutService.getWorkouts();
        return workouts;
    }
}