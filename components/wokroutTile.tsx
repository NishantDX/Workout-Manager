"use client";
import { Workout } from "@/utils/type";
import { Dumbbell, Hash, Calendar, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UpdateForm } from "./updateForm";
import Capitalize from "@/utils/capitalising";
import { useState } from "react";
import axios from "axios";
import useWorkoutState from "@/app/(pages)/store/useworkoutState";
export default function WorkoutTile({ workout }: { workout: Workout }) {

  const { workouts, deleteWorkout } = useWorkoutState();
  //console.log(workout._id);

  async function HandleDelete() {
    try {
      const response = await axios.delete(`/${workout._id}`);
      console.log(response);
      deleteWorkout(response.data);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <>
      <div className="bg-[#020817] flex p-3 rounded-2xl group justify-between w-full  hover:bg-[#182334] cursor-pointer px-5 border border-slate-600"
      >
        <div className="flex flex-col justify-between">
          <div className="text-xl font-bold flex gap-2 items-center">
            <Dumbbell className="text-blue-500 h-5"/>
            {Capitalize(workout.title)}
          </div>
          <div className="text-slate-400">
            {Capitalize(workout.muscle_Group)}
          </div>

          <div className="flex items-center gap-1 text-slate-400 text-sm">
            <Calendar className=" size-4" />
            {new Date(workout.createdAt).toLocaleDateString()}
          </div>
        </div>
        <div className="flex  justify-between  items-center">
          <div className="flex flex-col gap-2 font-semibold text-xl">
            <div className="flex items-center gap-1">
              <Dumbbell className="text-slate-400 size-5 " />
              {workout.weight}
            </div>
            <div className="flex items-center gap-1">
              <Hash className="text-slate-400 size-5" />
              {workout.reps}
            </div>
          </div>

          <div
            className='flex flex-col text-black gap-2 justify-end relative group-hover:visible invisible' 
          >
            <Trash2
              className=" absolute  rounded-full bg-red-900 p-2 size-8 text-white left-1"
              onClick={HandleDelete}
            />
            <div className="absolute top-1 left-1 rounded-full">
              <UpdateForm workout={workout} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
