import { MuscleWorkoutStore } from "@/utils/type";
import { create } from "zustand";
const useWorkoutForMuscleState = create<MuscleWorkoutStore>((set, get) => ({
    muscleWorkouts: [],
    getMuscleWorkout(existingWorkouts) {
      set({ muscleWorkouts: [...existingWorkouts] });
    },
  }));
  export default useWorkoutForMuscleState;