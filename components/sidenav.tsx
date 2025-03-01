"use client";
import Link from "next/link";
import { House, Dumbbell, Settings } from 'lucide-react';
import { muscleGroups } from "../data/musclegroups";
import { useState } from "react";
import useWorkoutForMuscleState from "@/app/(pages)/store/useMuscleWorkoutState";
export default function SideNav() {
  const [active, setActive] = useState<string | null>("dashboard");
 const {getMuscleWorkout}=useWorkoutForMuscleState()
  return (
    <>
      <div className="bg-[#18181B] text-white w-1/5 flex flex-col gap-6 p-2 h-full">
        <div className="text-3xl font-bold text-center">GymTrack PRO</div>
        <div className="flex flex-col justify-between gap-1 h-full">
          <div className="flex flex-col pl-2 font-semibold gap-2">
            <Link href={'/'} >
            <div
              className={`hover:bg-zinc-700 px-3 py-1 rounded-lg flex gap-2 items-center ${
                active === "dashboard" ? "bg-zinc-700" : ""
              }`}
              onClick={() => {setActive("dashboard")
              }
              }
            >
              <House className="h-5"/>Dashboard
            </div></Link>
            {muscleGroups.map((muscle) => (
              <Link href={`/${muscle.toLowerCase()}`} key={muscle}>
                <div
                  className={`hover:bg-zinc-700 pl-2 py-1 rounded-lg flex gap-2 items-center px-3 ${
                    active === muscle ? "bg-zinc-700" : ""
                  }`}
                  onClick={() => setActive(muscle)}
                ><Dumbbell className="h-5"/>
                  {muscle}
                </div>
              </Link>
            ))}
          </div>
          <div className="pl-4 font-semibold hover:bg-zinc-700 rounded-lg flex gap-2 items-center">
          <Settings /> Settings
          </div>
        </div>
      </div>
    </>
  );
}
