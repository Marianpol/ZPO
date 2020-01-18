import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { ExercisesModule } from './exercises/exercises.module';
import { UserModule } from './users/user.module';
import { WorkoutModule } from './workout/workout.module';
import { WorkoutPlanModule} from './workoutplans/workoutplan.module';
import { WorkoutPlanExampleModule} from './workoutplanexample/workoutplanexample.module';

@Module({
  imports: [ProductsModule, ExercisesModule, UserModule, WorkoutModule,WorkoutPlanModule,WorkoutPlanExampleModule, MongooseModule.forRoot('mongodb://localhost:27017/nest')],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
