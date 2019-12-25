import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ExercisesController } from "./exercises.controller";
import { ExerciseService } from "./exercises.service";
import { ExerciseSchema } from "./exercise.model";

@Module({
    imports: [MongooseModule.forFeature([{ name: 'Exercise', schema: ExerciseSchema }])],
    controllers: [ExercisesController],
    providers: [ExerciseService],
})

export class ExercisesModule {}