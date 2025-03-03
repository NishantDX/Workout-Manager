"use client";

import SideNav from "@/components/sidenav";
import axios from "axios";
import { useEffect } from "react";
import useWorkoutState from "./store/useworkoutState";
import useWorkoutForMuscleState from "./store/useMuscleWorkoutState";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { getWorkout } = useWorkoutState();
  axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const res = await axios.get("/");
        if (!res) {
          throw new Error(`HTTP error! status: ${res}`);
        }
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

        // Check if res.data.muscleWiseWorkouts is iterable
        if (Array.isArray(res.data.muscleWiseWorkouts)) {
          getMuscleWorkout(res.data.muscleWiseWorkouts);
        } else {
          throw new Error("muscleWiseWorkouts is not an array");
        }
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
