import { Controller, Post, Body, Get, Param, Patch, Delete } from "@nestjs/common";
import { WorkoutPlanService } from "./workoutplan.service";

@Controller('workoutplan')
export class WorkoutPlanController {
    constructor(private readonly workoutPlanService: WorkoutPlanService) { }

    @Post()
    async addWorkoutPlan(
        @Body('name') name: string,
        @Body('exname') exname: string,
    ) {
        const generatedId = await this.workoutPlanService.insertWorkoutPlan(name, exname);
        return { id: generatedId };
    }
    @Get()
    async getWorkoutPlans() {
        const workoutPlans = await this.workoutPlanService.getWorkoutPlans();
        return workoutPlans;
    }

    // @Get(':id')
    // getUser(@Param('id') userId: string, ) {
    //     return this.userService.getOneUser(userId);
    // }

    @Patch(':id')
    async updateWorkoutPlanExercise(
        @Param('id') exId: string, 
        @Body('exname') exname: string,
        ) {
            await this.workoutPlanService.updateWorkoutPlanExercise(exId, exname);
            return null;
        }
    @Delete(':id')
    async removeWorkoutPlanExercise(@Param('id') exId: string,){
        await this.workoutPlanService.deleteWorkoutPlanExercise(exId);
        return null;
    }
}