import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { WorkoutController } from "./userworkout.controller";
import { UserWorkoutService } from "./userworkout.service";
import { UserWorkoutSchema } from "./userworkout.model";

@Module({
    imports: [MongooseModule.forFeature([{ name: 'UserWorkout', schema: UserWorkoutSchema }])],
    controllers: [WorkoutController],
    providers: [UserWorkoutService],
})

export class UserWorkoutModule {}