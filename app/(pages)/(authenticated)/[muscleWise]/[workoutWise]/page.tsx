'use client'
import Capitalize from "@/utils/capitalising";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Trophy, Dumbbell, BookCheck, CircleAlert } from "lucide-react";
import { WorkoutForm } from "@/components/workoutForm";

import Chart from "@/components/chart-entries";
import { useParams } from "next/navigation";
import useWorkoutState from "../../store/useworkoutState";
import { useEffect, useState } from "react";
export default function WorkoutList1() {  
  const params = useParams<{ muscleWise: string, workoutWise:string }>();
  const {workouts} =useWorkoutState()
  //var re1 = /%20/gi;
  let WorkoutName: string = params.workoutWise.replace(/%20/g, " ").replace(/%2C/g, ",");
  console.log(WorkoutName)
  WorkoutName = Capitalize(WorkoutName);
  console.log(WorkoutName)
  const MuscleName=Capitalize(params.muscleWise)
  const filteredWorkouts = workouts.filter(
    (workout) => workout.title === WorkoutName
  );
  const [pr,setPr]=useState<number>(0)
  useEffect(() => {
    const maxWeight = filteredWorkouts.reduce((max, workout) => {
      return workout.weight > max ? workout.weight : max;
    }, 0);
    setPr(maxWeight);
  }, [filteredWorkouts]);
  console.log(workouts)
  filteredWorkouts.sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB =  new Date(b.createdAt).getTime();
    return dateB - dateA;
  });
  console.log(filteredWorkouts);
  if (filteredWorkouts.length == 0) {
    return (
      <div className="flex h-screen w-full">
        <div className="bg-[#020817] w-full flex flex-col ">
          <div className="text-5xl font-bold text-white  py-5 flex justify-between items-center   w-10/12 mx-auto">
            {WorkoutName}
            <div className="text-black flex items-center">
              <WorkoutForm muscleExist={true} workoutName={WorkoutName} muscleName={MuscleName} />
            </div>
          </div>
          <div className="w-10/12 mx-auto m-3 text-white  ">
            <Alert>
              <div className="flex gap-2 items-center">
                <div className="text-white ">
                  <CircleAlert />
                </div>
                <div>
                  <AlertTitle>No entries yet</AlertTitle>
                  <AlertDescription>
                    You have not logged any {WorkoutName} workouts yet. Start
                    tracking to see your progress!
                  </AlertDescription>
                </div>
              </div>
            </Alert>
          </div>
          <div className="text-white   flex flex-col items-center gap-2 ">
            <div className="text-white flex gap-5 w-10/12 mb-5">
              <div className="flex flex-col border border-slate-600 p-5 rounded-lg   items-center flex-1 justify-center">
                <div className=" rounded-lg flex gap-3 text-lg items-center flex-1 justify-center ">
                  Personal Record
                  <div className="text-lg text-zinc-400">
                    <Trophy />
                  </div>
                </div>
                <div className="text-2xl font-bold">--</div>
              </div>
              <div className="flex flex-col border border-slate-600 p-5 rounded-lg   items-center flex-1 justify-center">
                <div className=" rounded-lg flex gap-3 text-lg items-center flex-1 justify-center ">
                  Last Weight
                  <div className="text-lg text-zinc-400">
                    <Dumbbell />
                  </div>
                </div>
                <div className="text-2xl font-bold">--</div>
              </div>
              <div className="flex flex-col border border-slate-600 p-5 rounded-lg   items-center flex-1 justify-center">
                <div className=" rounded-lg flex gap-3 text-lg items-center flex-1 justify-center ">
                  Total Entries
                  <div className="text-lg text-zinc-400">
                    <BookCheck />
                  </div>
                </div>
                <div className="text-2xl font-bold">0</div>
              </div>
            </div>
            <div className="w-full ">
              <Chart workout={WorkoutName} muscle={MuscleName}/>
            </div>
          </div>
        </div>
      </div>
    );
  } else
    return (
      <>
        <div className="flex h-screen w-full">
          <div className="bg-[#020817] w-full flex flex-col ">
            <div className="text-5xl font-bold text-white  py-5 flex justify-between items-center  w-10/12 mx-auto">
              {WorkoutName}
              <div className="text-black flex items-center mr-7">
                <WorkoutForm muscleExist={true} workoutName={WorkoutName} muscleName={MuscleName}/>
              </div>
            </div>
            <div className="text-white   flex flex-col items-center gap-2 ">
              <div className="text-white flex gap-5 w-10/12 mb-5 pr-7">
                <div className="flex flex-col border border-slate-600 p-5 rounded-lg   items-center flex-1 justify-center">
                  <div className=" rounded-lg flex gap-3 text-lg items-center flex-1 justify-center ">
                    Personal Record
                    <div className="text-lg text-zinc-400">
                      <Trophy />
                    </div>
                  </div>
                  <div className="text-2xl font-bold">{pr}Kg</div>  
                </div>
                <div className="flex flex-col border border-slate-600 p-5 rounded-lg   items-center flex-1 justify-center">
                  <div className=" rounded-lg flex gap-3 text-lg items-center flex-1 justify-center ">
                    Last Weight
                    <div className="text-lg text-zinc-400">
                      <Dumbbell />
                    </div>
                  </div>
                  <div className="text-2xl font-bold">{filteredWorkouts[0].weight}kg</div>
                </div>
                <div className="flex flex-col border border-slate-600 p-5 rounded-lg   items-center flex-1 justify-center">
                  <div className=" rounded-lg flex gap-3 text-lg items-center flex-1 justify-center ">
                    Total Entries
                    <div className="text-lg text-zinc-400">
                      <BookCheck />
                    </div>
                  </div>
                  <div className="text-2xl font-bold">{filteredWorkouts.length}</div>
                </div>
              </div>
              <div className="w-full ">
                <Chart workout={WorkoutName} muscle={MuscleName} />
              </div>
            </div>
          </div>
        </div>
      </>
    );
}
