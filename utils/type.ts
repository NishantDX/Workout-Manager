import { ReactNode } from "react";

export type Workout={
    createdAt: string | number | Date;
    _id:string;
    title: string,
    muscle_Group: string,
    weight:number,
    reps:number,
    date:string
}
export type WorkoutStore = {
    workouts: Workout[];
    getWorkout: (existingWorkouts:Workout[])=>void; 
    addWorkout: (newWorkout: Workout) => void;
    deleteWorkout:(deletedWorkout:Workout)=>void;
    updateWorkout:(updateWorkout:Workout)=>void;
}
export type MuscleWorkoutStore={
    muscleWorkouts:any[];
    getMuscleWorkout: (existingWorkouts:any[])=>void; 
}