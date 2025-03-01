"use client";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { testData } from "@/utils/testData";
import { Dumbbell, Hash } from "lucide-react";
import SideNav from "@/components/sidenav";
import WorkoutTile from "@/components/wokroutTile";
import { Workout } from "@/utils/type";
import { WorkoutForm } from "@/components/workoutForm";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import WorkoutDetails from "@/components/workoutDetails";
import axios from "axios";
import useWorkoutState from "./store/useworkoutState";
import useWorkoutForMuscleState from "./store/useMuscleWorkoutState";
import { GymCalendar } from "@/components/calendar";

export default function Home() {
  const [toggleForm, setToggleForm] = useState(false);
  const {workouts, getWorkout, deleteWorkout,updateWorkout} =useWorkoutState()

  
  // useEffect(()=>{
  //   const fetchWorkouts = async () => {
  //   try {
  //     const res = await axios.get("/");
  //     if (!res) {
  //       throw new Error(`HTTP error! status: ${res}`);
  //     }
  //     //console.log(res.data);
  //     getWorkout(res.data);
  //   } catch (error) {
  //     console.error("Error fetching workouts:", error);
  //   }
  // };
  //   fetchWorkouts();
  // },[])
  const {muscleWorkouts,getMuscleWorkout}=useWorkoutForMuscleState();
  // useEffect(()=>{
  //   const fetchMuscleGroup = async () => {
  //   try {
  //     const res = await axios.get("/api/workouts");
  //     if (!res) {
  //       throw new Error(`HTTP error! status: ${res}`);
  //     }
      
  //     getMuscleWorkout(res.data.muscleWiseWorkouts);
  //     //console.log(muscleWorkouts);
      
  //   } catch (error) {
  //     console.error("Error fetching workouts:", error);
  //   }
  // };
  //   fetchMuscleGroup();
  // },[])
  //console.log(workouts)
  return (
    <>
      <div className="flex h-screen w-full">
        <div className="bg-[#020817] w-full flex flex-col item">
          <div className="text-4xl font-bold text-white w-10/12 mx-auto py-8 flex-nowrap">
            Welcome to GymTrack PRO
          </div>
          <div className="w-full flex justify-center mx-auto overflow-x-auto"><div className="w-full flex justify-center pr-5"><GymCalendar/></div></div>
          <div className="text-white  m-3 flex flex-col items-center">
            <div className="text-3xl font-semibold text-white py-3 w-10/12 flex justify-between">
              Recent Workouts
              <div className="text-black pr-7">
                <WorkoutForm muscleExist={false} muscleName="" workoutName="" />
              </div>
            </div>
            <div className="w-10/12"><WorkoutDetails data={workouts}/></div> 
          </div>
        </div>
      </div>
    </>
  );
}