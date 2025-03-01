"use client";

import SideNav from "@/components/sidenav";
import axios from "axios";
import { useEffect } from "react";
import useWorkoutState from "./store/useworkoutState";
import useWorkoutForMuscleState from "./store/useMuscleWorkoutState";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { workouts, getWorkout, deleteWorkout, updateWorkout } =
    useWorkoutState();
  axios.defaults.baseURL = "http://localhost:5000";
  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const res = await axios.get("/");
        if (!res) {
          throw new Error(`HTTP error! status: ${res}`);
        }
        //console.log(res.data);
        getWorkout(res.data);
      } catch (error) {
        console.error("Error fetching workouts:", error);
      }
    };
    fetchWorkouts();
  }, []);
  const { muscleWorkouts, getMuscleWorkout } = useWorkoutForMuscleState();
  useEffect(() => {
    const fetchMuscleGroup = async () => {
      try {
        const res = await axios.get("/api/workouts");
        if (!res) {
          throw new Error(`HTTP error! status: ${res}`);
        }

        getMuscleWorkout(res.data.muscleWiseWorkouts);
        
      } catch (error) {
        console.error("Error fetching workouts:", error);
      }
    };
    fetchMuscleGroup();
  }, []);
  console.log(muscleWorkouts);
  return (
    <>
      <SideNav />
      {children}
    </>
  );
}
function getMuscleWorkout(muscleWiseWorkouts: any) {
  throw new Error("Function not implemented.");
}
