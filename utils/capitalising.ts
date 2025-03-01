export default function Capitalize(WorkoutName: String) {
  let Workout: string[] = WorkoutName.split(" ");
  for (let i = 0; i < Workout.length; i++) {
    Workout[i] = Workout[i][0].toUpperCase() + Workout[i].substr(1);
  }
return WorkoutName = Workout.join(" ");
}
