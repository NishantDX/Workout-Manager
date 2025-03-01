
import { Workout } from "@/utils/type";
import { ScrollArea } from "@/components/ui/scroll-area";
import WorkoutTile from "./wokroutTile";

export default function WorkoutDetails({ data }: { data: Workout[] }) {
  return (
    <>
      <ScrollArea className="h-[300px] w-full rounded-md flex flex-col   border-gray-700 items-center pr-2">
        <div className="flex flex-col gap-2 flex-1" key={1}>
          {data.map((workout: Workout) => (
            <div className="pr-5  "  key={workout._id}>
            <WorkoutTile workout={workout}  /></div>
          ))}
        </div>
      </ScrollArea>
    </>
  );
}
