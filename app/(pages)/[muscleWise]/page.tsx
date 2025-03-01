"use client";
import WorkoutTile from "@/components/wokroutTile";
import { testData } from "@/utils/testData";
import { muscleGroups } from "@/data/musclegroups";
import { Workout } from "@/utils/type";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { Workouts } from "@/data/workouts";
import { Dumbbell, Hash, Calendar } from "lucide-react";
import useWorkoutState from "../store/useworkoutState";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import useWorkoutForMuscleState from "../store/useMuscleWorkoutState";
export default function WorkoutList() {
  const params = useParams<{ muscleWise: string }>();
  const { muscleWorkouts, getMuscleWorkout } = useWorkoutForMuscleState();

  // useEffect(() => {
  //   console.log("Updated Response:", response);
  // }, [response]);
  const { workouts, getWorkout, deleteWorkout, updateWorkout } =
    useWorkoutState();

  const filteredWorkouts = muscleWorkouts.filter(
    (workout) => workout.name === params.muscleWise
  );
  console.log(muscleWorkouts)
  console.log(params.muscleWise);
  console.log(filteredWorkouts);
  return (
    <>
      <div className="flex h-screen w-full">
        <div className="bg-[#020817] w-full flex flex-col items-center">
          <div className="text-5xl font-bold text-white w-10/12 p-5">
            {params.muscleWise.charAt(0).toUpperCase() +
              params.muscleWise.slice(1)}{" "}
            Workouts
          </div>

          <div className="text-white  m-3 flex flex-col items-center">
            <div className="flex flex-wrap  gap-x-10 gap-5 mx-auto justify-center">
              {filteredWorkouts.length > 0
                ? filteredWorkouts[0].exercises.map(
                    (workout: string, i: number) => (
                      <Link
                        href={`/${params.muscleWise}/${workout.toLowerCase()}`}
                        key={i}
                        className="w-2/5 h-16 border-slate-500 border rounded-lg transition hover:bg-slate-800 duration-300 p-5"
                      >
                        <div className="flex text-xl items-center  p-2 w-full h-full gap-2">
                          <Dumbbell className="text-blue-500 text-base" />
                          {workout}
                        </div>
                      </Link>
                    )
                  )
                : null}
              {/* {muscleGroups.map((muscle, i) => (
                <Link href={`/`} key={i}>
                  <div>{muscle}</div>
                </Link>
              ))} */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
