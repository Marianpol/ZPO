import { Controller, Post, Body, Get} from "@nestjs/common";
import { WorkoutPlanExampleService } from "./workoutplanexample.service";

@Controller('workoutplanexample')
export class WorkoutPlanExampleController {
    constructor(private readonly workoutPlanService: WorkoutPlanExampleService) { }
    
    @Post()
    async addWorkoutPlan(
        @Body('name') name: string,
        @Body('group') planType: string,
        @Body('description') description: string,
        @Body('img') img: string,
        @Body('training') training: any[],
    ) { 
        if(name === "delete"){
            await this.workoutPlanService.deleteAll();
            return {message: "Deleted"};
        }
        if(name){
            for(let i = 0; i < training.length; i++){
                for (let j = 0; j < training.map(({ series }: any) => series.length)[0]; j++) {
                    let tr = training[i]['series'][j];
                    this.workoutPlanService.insertWorkoutPlan(
                        name,
                        planType,
                        description,
                        img,
                        training[i]['name'],
                        tr['id'],
                        tr['repeat'],
                        tr['kg'],
                        tr['time'],);
                }
            }
        }
        else{
            let result = await this.workoutPlanService.getPlansByTypes(await this.workoutPlanService.getWorkoutPlansBack());
            return result;
        } 
    }

    @Get()
    async getWorkouts() {
        const workouts = await this.workoutPlanService.getWorkoutPlans();
        return workouts;
    }
}