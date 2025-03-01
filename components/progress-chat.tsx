'use client'

import { Workout } from "@/utils/type";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Legend, Tooltip, ResponsiveContainer } from "recharts";
export default function ProgressChart({workouts}:{workouts:Workout[]}) {
    

    const renderLineChart = (
        <ResponsiveContainer width="100%" height={400}>
        <LineChart width={600} height={300} data={workouts} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
        <Line type="monotone" dataKey="reps" stroke="#2EB88A" />
        <Line type="monotone" dataKey="weight" stroke="#1E4BA9" />
        <CartesianGrid stroke="#1E293B" strokeDasharray="3 3" />
        <XAxis dataKey="date" stroke="#4F5155"/>
        <YAxis stroke="#4F5155"/>
        <Tooltip />
        <Legend />
      </LineChart></ResponsiveContainer>
      );
  return <>
  <div className="border p-10 w-10/12 rounded-lg border-slate-500">{renderLineChart}</div>
  </>;
}
