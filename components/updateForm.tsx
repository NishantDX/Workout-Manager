"use client";
import * as React from "react";
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
import { Workout } from "@/utils/type";
import { Pencil } from "lucide-react";
import Capitalize from "@/utils/capitalising";
import { useEffect, useState } from "react";
import axios from "axios";
import useWorkoutState from "@/app/(pages)/store/useworkoutState";

export function UpdateForm({ workout }: { workout: Workout }) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Pencil className="bg-white p-2 size-8 rounded-full " />
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update Workout</DialogTitle>
            <DialogDescription>
              Provide the information regarding the new updated workout. Click
              save when you are done.
            </DialogDescription>
          </DialogHeader>
          <ProfileForm workout={workout} setIsOpen={setOpen} />
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
            you are done.
          </DrawerDescription>
        </DrawerHeader>
        <ProfileForm className="px-4" workout={workout} setIsOpen={setOpen} />
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
  workout: Workout;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProfileForm: React.FC<ProfileFormProps> = ({
  className,
  workout,
  setIsOpen,
}) => {
  const { updateWorkout } = useWorkoutState();
  const muscleName = Capitalize(workout.muscle_Group);

  const workoutName = Capitalize(workout.title);
  const [title, setTitle] = useState<string>("");
  const [reps, setReps] = useState<string>();
  const [weight, setWeight] = useState<string>();
  const [muscle, setMuscle] = useState<string>("");
  console.log(muscle);
  async function HandleClick(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const response = await axios.patch(`/${workout._id}`, {
        title: title,
        muscle_Group: muscle,
        reps: reps,
        weight: weight,
      });
      updateWorkout(response.data);
      setIsOpen(false);
    } catch (error) {
      console.log({ err: error });
    }
  }
  useEffect(() => {
    setMuscle(muscleName.toLowerCase());
    setTitle(workoutName);
  }, [muscleName, workoutName]);
  return (
    <form
      className={cn("grid items-start gap-4", className)}
      onSubmit={HandleClick}
    >
      <div className="grid gap-2 ">
        <Label>Mucle Group</Label>
        <div className="border border-slate-300 h-9 px-3 py-1 rounded-md">
          {muscleName}
        </div>
        {/* <Input type="text" placeholder={muscleName} /> */}
      </div>
      <div className="grid gap-2">
        <Label>Name</Label>
        <div className="border border-slate-300 h-9 px-3 py-1 rounded-md">
          {workoutName}
        </div>
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
};
// function updateWorkout(data: any) {
//   throw new Error("Function not implemented.");
// }
