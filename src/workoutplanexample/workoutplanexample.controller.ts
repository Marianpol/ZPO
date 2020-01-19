import { Controller, Post, Body, Get, Param, Patch, Delete } from "@nestjs/common";
import { WorkoutPlanExampleService } from "./workoutplanexample.service";

@Controller('workoutplanexample')
export class WorkoutPlanExampleController {
    constructor(private readonly workoutPlanService: WorkoutPlanExampleService) { }
    
    @Post()
    async addWorkoutPlan(
        @Body('name') name: string,
        @Body('description') description: string,
        @Body('img') img: string,
        @Body('training') training: any[],
    ) { 
        if(name){
            for(let i = 0; i < training.length; i++){
                for (let j = 0; j < training.map(({ series }: any) => series.length)[0]; j++) {
                    let tr = training[i]['series'][j];
                    this.workoutPlanService.insertWorkoutPlan(
                        name,
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
            let result = [];
            result = await this.workoutPlanService.getWorkoutPlansBack();
            return result;
        } 
    }

    @Get(':pm')
    async getUser(@Param('pm') param: string,) {
        let result = [];
        if(param === "names"){
            result = await this.workoutPlanService.getWrokoutPlansNames();
        }
        return result;
    }

    // @Patch(':id')
    // async updateWorkoutPlanExercise(
    //     @Param('id') planId: string, 
    //     @Body('name') name: string,
    //     ) {
    //         await this.workoutPlanService.updateWorkoutPlanExercise(planId, name);
    //         return null;
    //     }
    // @Delete(':id')
    // async removeWorkoutPlanExercise(@Param('id') planId: string,){
    //     await this.workoutPlanService.deleteWorkoutPlanExercise(planId);
    //     return null;
    // }
}