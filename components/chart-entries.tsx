'use client'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProgressChart from "./progress-chat";
import WorkoutDetails from "./workoutDetails";
import useWorkoutState from "@/app/(pages)/store/useworkoutState";

interface ChartProps {
  muscle: string;
  workout:string;
}
export default function Chart({ workout }: ChartProps) {
  const {workouts} =useWorkoutState();
  const filteredWorkouts = workouts.filter(
    (workout1) => workout1.title === workout
  );
  //console.log(workout);
  console.log(filteredWorkouts);
  if (filteredWorkouts.length == 0) {
    return (
      <>
        <Tabs defaultValue="account" className="w-full flex flex-col">
          <TabsList className=" ml-32 bg-slate-700 text-white">
            <TabsTrigger value="account">Entries</TabsTrigger>
            <TabsTrigger value="password">Progress</TabsTrigger>
          </TabsList>
          <TabsContent value="account" className="flex justify-center">
            <div className="border border-slate-500 w-10/12 h-[400px] rounded-lg flex justify-center items-center text-4xl font-semibold">
              No entries yet
            </div>
          </TabsContent>
          <TabsContent value="password" className="flex justify-center">
            <div className="border border-slate-500 w-10/12 h-[400px] rounded-lg flex justify-center items-center text-4xl font-semibold">
              No entries yet
            </div>
          </TabsContent>
        </Tabs>
      </>
    );
  } else
    return (
      <>
        <Tabs defaultValue="account" className="w-full flex flex-col">
          <TabsList className="w-[155px] ml-32 bg-slate-700 text-white">
            <TabsTrigger value="account">Entries</TabsTrigger>
            <TabsTrigger value="password">Progress</TabsTrigger>
          </TabsList>
          <TabsContent value="account">
          <div className="w-10/12 m-auto"><WorkoutDetails data={filteredWorkouts}/></div>
          </TabsContent>
          <TabsContent value="password" className="flex justify-center">
            <ProgressChart workouts={filteredWorkouts} />
          </TabsContent>
        </Tabs>
      </>
    );
}
