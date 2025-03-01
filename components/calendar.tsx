"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react"
import useWorkoutState from "@/app/(pages)/store/useworkoutState"

interface GymAttendance {
  date: string
  attended: boolean
}

export function GymCalendar() {
  const {workouts} = useWorkoutState()
  const [gymAttendance, setGymAttendance] = useState<GymAttendance[]>([])

  useEffect(() => {
    const attendance: GymAttendance[] = workouts.map((workout) => ({
      date: new Date(workout.createdAt).toISOString().split("T")[0],
      attended: true,
    }))
    setGymAttendance(attendance)
  }, [workouts])

  console.log(workouts)
  const [currentMonth, setCurrentMonth] = useState(0) // January
  const [currentYear, setCurrentYear] = useState(2025)
  const [startDate, setStartDate] = useState(1)

  const goToPreviousWeek = () => {
    if (startDate > 1) {
      setStartDate(Math.max(1, startDate - 7))
    } else if (currentMonth > 0) {
      setCurrentMonth(currentMonth - 1)
      setStartDate(new Date(currentYear, currentMonth, 0).getDate() - 6)
    } else {
      setCurrentYear(currentYear - 1)
      setCurrentMonth(11)
      setStartDate(25)
    }
  }

  const goToNextWeek = () => {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
    if (startDate + 7 <= daysInMonth) {
      setStartDate(startDate + 7)
    } else if (currentMonth < 11) {
      setCurrentMonth(currentMonth + 1)
      setStartDate(1)
    } else {
      setCurrentYear(currentYear + 1)
      setCurrentMonth(0)
      setStartDate(1)
    }
  }

  const getDayName = (date: Date) => {
    return date.toLocaleDateString("en-US", { weekday: "short" })
  }

  const daysToShow = 7
  const monthDates = Array.from({ length: daysToShow }, (_, i) => new Date(currentYear, currentMonth, startDate + i))

  // Calculate streak
  const streak = gymAttendance
    .filter((day) => day.attended)
    .reduce((acc, curr) => {
      const date = new Date(curr.date)
      const today = new Date()
      return date <= today ? acc + 1 : acc
    }, 0)

  // Calculate monthly statistics
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const totalVisits = gymAttendance.filter((day) => {
    const date = new Date(day.date)
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear && day.attended
  }).length

  const completion = (totalVisits / daysInMonth) * 100

  return (
   <div className="w-10/12 flex justify-center px-4 bg-[#020817] ">
    <Card className="w-full text-white bg-[#020817] border-slate-500">
      <CardContent className="p-4 ">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-500" />
            <h2 className="text-xl font-bold">
              {new Date(currentYear, currentMonth).toLocaleString("default", { month: "long", year: "numeric" })}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-[#08142E] text-blue-500 font-bold px-2 py-1 rounded-full text-xs">Streak: {streak} days</div>
            <Button size="sm" className="bg-[#020817] border-slate-600 border hover:bg-[#1E293B]">Today</Button>
          </div>
        </div>

        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10"
            onClick={goToPreviousWeek}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex  px-8 gap-1">
            {monthDates.map((date) => {
              const dateString = date.toISOString().split("T")[0]
              const attendance = gymAttendance.find((a) => a.date === dateString)
              const isToday = new Date().toISOString().split("T")[0] === dateString

              return (
                <div
                  key={dateString}
                  className={`w-1/12 p-2 rounded-md text-center transition-colors flex-1
                    ${isToday ? "bg-primary text-primary-foreground" : "hover:bg-[#1E293B]"}
                    ${attendance?.attended ? "ring-1 ring-blue-500" : ""}`}
                >
                  <div className="text-xs font-medium mb-1">{getDayName(date)}</div>
                  <div className="text-sm font-bold">{date.getDate()}</div>
                </div>
              )
            })}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10"
            onClick={goToNextWeek}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex justify-between items-center mt-4">
          <div>
            <div className="text-xs text-muted-foreground">Total Visits</div>
            <div className="text-lg font-bold">{totalVisits}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Completion</div>
            <div className="text-lg font-bold">{Math.round(completion)}%</div>
          </div>
        </div>
      </CardContent>
    </Card></div>
  )
}
