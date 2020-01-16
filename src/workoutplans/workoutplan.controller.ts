import { Controller, Post, Body, Get, Param, Patch, Delete } from "@nestjs/common";
import { WorkoutPlanService } from "./workoutplan.service";
import { WorkoutService} from "../workout/workout.service";

@Controller('workoutplan')
export class WorkoutPlanController {
    constructor(private readonly workoutPlanService: WorkoutPlanService) { }
    private workoutService : WorkoutService;
    
    @Post()
    async addWorkoutPlan(
        @Body('name') name: string,
        @Body('training') training: any[],
    ) {
        const generatedId = await this.workoutPlanService.insertWorkoutPlan(name);
        for (let i = 0; i < training.map(({ series }: any) => series.length)[0]; i++) {
            const trainingArray: any = training.map(({ id, name, series }: any, index: any) => ({
              id,
              name,
              idSeries: series.map(({ id }: any) => id)[i],
              kg: series.map(({ kg }: any) => kg)[i],
              time: series.map(({ time }: any) => time)[i],
              repeat: series.map(({ repeat }: any) => repeat)[i],
            }));
            this.workoutService.insertWorkout.call(this.workoutService,
                generatedId,
                trainingArray.name,
                trainingArray.idSeries,
                trainingArray.repeat,
                trainingArray.kg,);
          }
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
        @Param('id') planId: string, 
        @Body('name') name: string,
        ) {
            await this.workoutPlanService.updateWorkoutPlanExercise(planId, name);
            return null;
        }
    @Delete(':id')
    async removeWorkoutPlanExercise(@Param('id') planId: string,){
        await this.workoutPlanService.deleteWorkoutPlanExercise(planId);
        return null;
    }
}