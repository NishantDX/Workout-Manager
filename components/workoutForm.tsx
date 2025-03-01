"use client";
import * as React from "react";

import { SelectDemo } from "./select";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@radix-ui/react-select";
import { useEffect, useState } from "react";
import useWorkoutState from "@/app/(pages)/store/useworkoutState";
import axios from "axios";
import { muscleGroups } from "@/data/musclegroups";
import { SelectName } from "./selectName";
import useWorkoutForMuscleState from "@/app/(pages)/store/useMuscleWorkoutState";
interface WorkoutFormProps {
  muscleExist: boolean;
  muscleName: string;
  workoutName: string;
}
export function WorkoutForm({
  muscleExist,
  muscleName,
  workoutName,
}: WorkoutFormProps) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Create New Workout</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>New Workout</DialogTitle>
            <DialogDescription>
              Provide the information regarding the new workout. Click save when
              you're done.
            </DialogDescription>
          </DialogHeader>
          <ProfileForm
            setIsOpen={setOpen}
            muscleExist={muscleExist}
            muscleName={muscleName}
            workoutName={workoutName}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline">Create Workout</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left text-white">
          <DrawerTitle>New Workout</DrawerTitle>
          <DrawerDescription>
            Provide the information regarding the new workout. Click save when
            you're done.
          </DrawerDescription>
        </DrawerHeader>
        <ProfileForm
          className="px-4"
          setIsOpen={setOpen}
          muscleExist={false}
          muscleName={""}
          workoutName={""}
        />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
interface ProfileFormProps {
  className?: string;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  muscleExist: boolean;
  muscleName: string;
  workoutName: string;
}

function ProfileForm({
  className,
  setIsOpen,
  muscleExist,
  muscleName,
  workoutName,
}: ProfileFormProps) {
  const [title, setTitle] = useState<string>("");
  const [reps, setReps] = useState<any>();
  const [weight, setWeight] = useState<any>();
  const [muscle, setMuscle] = useState<string>("");

  const { muscleWorkouts } = useWorkoutForMuscleState();

  //const [name,setName]=useState("");
  const { workouts, getWorkout, deleteWorkout, addWorkout, updateWorkout } =
    useWorkoutState();
  async function HandleClick(e: any) {
    console.log("hi");
    e.preventDefault();
    try {
      const response = await axios.post("/", {
        title,
        muscle_Group: muscle.toLowerCase(),
        reps,
        weight,
      });
      addWorkout(response.data);
      setTitle("");
      setReps("");
      setWeight("");
      setMuscle("");
      setIsOpen(false);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 400) {
          console.log(error.response.data);
          setErrors(error.response.data.err); // Update the error state with the error message
          setemptyFields(error.response.data.emptyFields);
          //console.log(emptyFields)
        } else {
          //console.error("Error creating workout:", error);
          setErrors("An unexpected error occurred."); // Set a generic error message
        }
      } else {
        //console.error("Error creating workout:", error);
        setErrors("An unexpected error occurred."); // Set a generic error message
      }
    }
  }
  useEffect(() => {
    if (muscleExist) {
      setMuscle(muscleName);
      setTitle(workoutName);
    }
  }, [muscleExist, muscleName, workoutName]);
  if (muscleExist) {
    
    //console.log(workoutName);
    return (
      <form
        className={cn("grid items-start gap-4", className)}
        onSubmit={
          HandleClick
        }
      >
        <div className="grid gap-2 ">
          <Label>Mucle Group</Label>
          <div className="border border-slate-300 h-9 px-3 py-1 rounded-md">{muscleName}</div>
          {/* <Input type="text" placeholder={muscleName} /> */}
        </div>
        <div className="grid gap-2">
          <Label>Name</Label>
          <div className="border border-slate-300 h-9 px-3 py-1 rounded-md">{workoutName}</div>
          {/* <Input type="text" placeholder={workoutName} /> */}
        </div>
        <div className="grid gap-2">
          <Label>Reps</Label>
          <Input type="number" onChange={(e) => setReps(e.target.value)} />
        </div>
        <div className="grid gap-2">
          <Label>Weight</Label>
          <Input type="number" onChange={(e) => setWeight(e.target.value)} />
        </div>
        <Button type="submit" className="bg-white text-black">
          Save changes
        </Button>
      </form>
    );
  } else
    return (
      <form
        className={cn("grid items-start gap-4", className)}
        onSubmit={HandleClick}
      >
        <div className="grid gap-2 ">
          <Label>Mucle Group</Label>
          <SelectDemo muscle={muscle} setMuscle={setMuscle} />
        </div>
        <div className="grid gap-2">
          <Label>Name</Label>
          <SelectName muscle={muscle} setTitle={setTitle} />
        </div>

        <div className="grid gap-2">
          <Label>Reps</Label>
          <Input type="number" onChange={(e) => setReps(e.target.value)} />
        </div>
        <div className="grid gap-2">
          <Label>Weight</Label>
          <Input type="number" onChange={(e) => setWeight(e.target.value)} />
        </div>
        <Button type="submit" className="bg-white text-black">
          Save changes
        </Button>
      </form>
    );
}
function setErrors(err: any) {
  throw new Error("Function not implemented.");
}

function setemptyFields(emptyFields: any) {
  throw new Error("Function not implemented.");
}
