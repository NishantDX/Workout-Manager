import * as React from "react";
import { muscleGroups } from "../data/musclegroups";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import useWorkoutForMuscleState from "@/app/(pages)/store/useMuscleWorkoutState";
import useWorkoutState from "@/app/(pages)/store/useworkoutState";
interface SelectDemoProps {
  muscle: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
}
export function SelectName({ muscle, setTitle }: SelectDemoProps) {
  const { muscleWorkouts } = useWorkoutForMuscleState();

  //console.log(muscle);
  const filteredWorkouts = muscleWorkouts.filter(
    (workout) => workout.name === muscle.toLowerCase()
  );
  //console.log(filteredWorkouts);
  return (
    <Select onValueChange={setTitle}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Name" className="text-white"/>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel className="">Name</SelectLabel>
          {filteredWorkouts.map((obj) =>
            obj.exercises.map((workout: string) => (
              <SelectItem
                className="text-black bg-white "
                key={`${obj.name}-${workout}`}
                value={workout}
              >
                {workout}
              </SelectItem>
            ))
          )}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
