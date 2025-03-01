"use client";
import { WorkoutForm } from "@/components/workoutForm";
import WorkoutDetails from "@/components/workoutDetails";
import useWorkoutState from "./store/useworkoutState";
import { GymCalendar } from "@/components/calendar";
export default function Home() {
  const { workouts } = useWorkoutState();

  return (
    <>
      <div className="flex h-screen w-full">
        <div className="bg-[#020817] w-full flex flex-col item">
          <div className="text-4xl font-bold text-white w-10/12 mx-auto py-8 flex-nowrap">
            Welcome to GymTrack PRO
          </div>
          <div className="w-full flex justify-center mx-auto overflow-x-auto">
            <div className="w-full flex justify-center pr-5">
              <GymCalendar />
            </div>
          </div>
          <div className="text-white  m-3 flex flex-col items-center">
            <div className="text-3xl font-semibold text-white py-3 w-10/12 flex justify-between">
              Recent Workouts
              <div className="text-black pr-7">
                <WorkoutForm muscleExist={false} muscleName="" workoutName="" />
              </div>
            </div>
            <div className="w-10/12">
              <WorkoutDetails data={workouts} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
