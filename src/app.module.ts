import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ExercisesModule } from './exercises/exercises.module';
import { UserModule } from './user/user.module';
import { WorkoutModule } from './workout/workout.module';
import { WorkoutPlanModule} from './workoutplans/workoutplan.module';
import { WorkoutPlanExampleModule} from './workoutplanexample/workoutplanexample.module';
import { UserWorkoutModule } from './userworkout/userworkout.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [ExercisesModule, UserModule, AuthModule, WorkoutModule,WorkoutPlanModule,WorkoutPlanExampleModule, UserWorkoutModule, MongooseModule.forRoot('mongodb://localhost:27017/nest')],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
