import { Module } from "@nestjs/common";
import { MongooseModule } from '@nestjs/mongoose';
import { WorkoutPlanController } from "./workoutplan.controller";
import { WorkoutPlanService } from "./workoutplan.service";
import { WorkoutPlanSchema } from "./workoutplan.model";

@Module({
    imports: [MongooseModule.forFeature([{ name: 'WorkoutPlan', schema: WorkoutPlanSchema }])],
    controllers: [WorkoutPlanController],
    providers: [WorkoutPlanService],
})


export class WorkoutPlanModule { }
