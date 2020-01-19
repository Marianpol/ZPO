import { Module } from "@nestjs/common";
import { MongooseModule } from '@nestjs/mongoose';
import { WorkoutPlanController } from "./workoutplan.controller";
import { WorkoutPlanService } from "./workoutplan.service";
import { WorkoutPlanSchema } from "./workoutplan.model";
import { WorkoutSchema } from "../workout/workout.model";
import { WorkoutService } from "../workout/workout.service";
import { UserWorkoutService } from "../userworkout/userworkout.service";
import { UserWorkoutSchema } from "../userworkout/userworkout.model";

@Module({
    imports: [MongooseModule.forFeature([{ name: 'WorkoutPlan', schema: WorkoutPlanSchema }]),
              MongooseModule.forFeature([{ name: 'Workout', schema: WorkoutSchema }]),
              MongooseModule.forFeature([{ name: 'UserWorkout', schema: UserWorkoutSchema }])],
    controllers: [WorkoutPlanController],
    providers: [WorkoutPlanService,WorkoutService,UserWorkoutService],
})


export class WorkoutPlanModule { }
