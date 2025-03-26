import { WorkoutStore } from "@/utils/type";
import { create } from "zustand";

const useWorkoutState = create<WorkoutStore>()((set, get) => ({
  workouts: [],
  getWorkout(existingWorkouts) {
    set({ workouts: [...existingWorkouts] });
  },
  addWorkout(newWorkout) {
    const { workouts } = get();
    set({ workouts: [...workouts, newWorkout] });
  },
  deleteWorkout:(deletedWorkout)=>{
    const {workouts}=get()
    set({workouts:workouts.filter((workout)=>(workout._id!=deletedWorkout._id))})
},
  updateWorkout(updatedWorkout) {
    const { workouts } = get();
    set({
      workouts: workouts.map((workout) =>
        updatedWorkout._id == workout._id ? updatedWorkout : workout
      ),
    });
  },
}));

export default useWorkoutState;
