"use client";

export const dynamic = "force-dynamic";

import SideNav from "@/components/sidenav";
import axios from "axios";
import { useEffect, useState } from "react";
import useWorkoutState from "./store/useworkoutState";
import useWorkoutForMuscleState from "./store/useMuscleWorkoutState";
//import useUserState from "./store/userUpdateStore";
import { useRouter, usePathname } from "next/navigation";
import useUserState from "./store/userUpdateStore";

export default function Layout({ children }: { children: React.ReactNode }) {
  //const params = useParams<{ pathname:string }>();
  const { getWorkout } = useWorkoutState();
  const router = useRouter();
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;
  const { user, login } = useUserState();

  // Set isClient to true on component mount
  useEffect(() => {
    setIsClient(true);
  }, []);

  function initializeUser() {
    if (typeof window !== "undefined") {
      const localUser = localStorage.getItem("user");

      if (!localUser) {
        console.log("No user found, redirecting to /login");
        router.push("/login"); // Redirect to login if user is not authenticated
      } else {
        const processedUser = JSON.parse(localUser);
        login(processedUser);
        axios.defaults.headers[
          "Authorization"
        ] = `Bearer ${processedUser.token}`;

        //console.log(user)
        console.log("Authenticated user:", JSON.parse(localUser));

        if (pathname === "/login") {
          router.push("/"); // Redirect to the authenticated route if already logged in
        }
      }
    }
  }

  useEffect(() => {
    if (isClient) {
      initializeUser();
    }
  }, [isClient, localStorage.getItem("user")]);

  const fetchWorkouts = async () => {
    console.log(user.token);

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
  useEffect(() => {
    if (user.token) {
      fetchWorkouts();
    }
  }, [user]);

  const { getMuscleWorkout } = useWorkoutForMuscleState();

  const fetchMuscleGroup = async () => {
    try {
      const res = await axios.get("/api/workouts");
      if (!res) {
        throw new Error(`HTTP error! status: ${res}`);
      }
      console.log(res.data.muscleWiseWorkouts);
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

  useEffect(() => {
    if (user.token) fetchMuscleGroup();
  }, [user]);

  //console.log(muscleWorkouts);

  return (
    <>
      <SideNav />
      {children}
    </>
  );
}
