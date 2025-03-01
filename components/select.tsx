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
interface SelectDemoProps {
  muscle: string;
  setMuscle: React.Dispatch<React.SetStateAction<string>>;
}
export function SelectDemo({ muscle, setMuscle }: SelectDemoProps) {
  return (
    <Select onValueChange={setMuscle}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Muscle Group" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Muscle Groups</SelectLabel>
          {muscleGroups.map((muscle, i) => (
            <SelectItem className="text-black bg-white " key={i} value={muscle}>
              {muscle}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
