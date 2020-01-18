import { Module } from "@nestjs/common";
import { MongooseModule } from '@nestjs/mongoose';
import { WorkoutPlanExampleController } from "./workoutplanexample.controller";
import { WorkoutPlanExampleService } from "./workoutplanexample.service";
import { WorkoutPlanExampleSchema } from "./workoutplanexample.model";

@Module({
    imports: [MongooseModule.forFeature([{ name: 'WorkoutPlanExample', schema: WorkoutPlanExampleSchema }])],
    controllers: [WorkoutPlanExampleController],
    providers: [WorkoutPlanExampleService],
})


export class WorkoutPlanExampleModule { }
