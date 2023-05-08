"use client"

import React, { useEffect, useState } from "react"
import {
  addMonths,
  format,
  getDay,
  getDaysInMonth,
  isEqual,
  subMonths,
} from "date-fns"

import { cn } from "@/lib/utils"

import { Icons } from "./icons"
import { Button } from "./ui/button"

interface CalendarProps {
  dates?: Date[]
}

const Calendar: React.FC<CalendarProps> = (props) => {
  const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  const [dayCount, setDayCount] = useState<Array<number>>([])
  const [blankDays, setBlankDays] = useState<Array<number>>([])
  const [datepickerHeaderDate, setDatepickerHeaderDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())

  const colors = [
    "bg-red-500",
    "bg-yellow-500",
    "bg-green-500",
    "bg-blue-500",
    "bg-indigo-500",
    "bg-purple-500",
    "bg-pink-500",
  ]

  const decrement = () => {
    setDatepickerHeaderDate((prev) => subMonths(prev, 1))
  }

  const increment = () => {
    setDatepickerHeaderDate((prev) => addMonths(prev, 1))
  }

  const isToday = (date: number) =>
    isEqual(
      new Date(selectedDate.getFullYear(), selectedDate.getMonth(), date),
      selectedDate
    )

  const getDayCount = (date: Date) => {
    let daysInMonth = getDaysInMonth(date)

    let dayOfWeek = getDay(new Date(date.getFullYear(), date.getMonth(), 1))
    let blankdaysArray = []
    for (let i = 1; i <= dayOfWeek; i++) {
      blankdaysArray.push(i)
    }

    let daysArray = []
    for (let i = 1; i <= daysInMonth; i++) {
      daysArray.push(i)
    }

    setBlankDays(blankdaysArray)
    setDayCount(daysArray)
  }

  const getEventsForDay = (day: number) => {
    if (!props.dates) return []
    const events = props.dates.filter((date) => {
      return (
        date.getDate() === day &&
        date.getMonth() === datepickerHeaderDate.getMonth() &&
        date.getFullYear() === datepickerHeaderDate.getFullYear()
      )
    })
    return events
  }

  const Day = ({ day, events }: { day: number; events: Date[] }) => (
    <div className="group relative flex flex-col border-none bg-white dark:bg-slate-900">
      <span
        className={cn("mx-2 my-1 text-xs font-bold", {
          "text-gray-400": !isToday(day),
        })}
      >
        {day}
      </span>
      <div className="flex flex-col overflow-auto p-1">
        {events.map((event) => (
          <button className="flex h-5 shrink-0 items-center px-1 text-xs hover:bg-gray-200">
            <span
              className={cn("h-2 w-2 shrink-0 rounded-full", {
                [colors[events.indexOf(event)]]: events.indexOf(event) < 7,
              })}
            ></span>
            <span className="ml-2 truncate font-medium leading-none dark:text-white">
              {format(event, "HH:mm")}
            </span>
          </button>
        ))}
      </div>
    </div>
  )

  useEffect(() => {
    getDayCount(datepickerHeaderDate)
  }, [datepickerHeaderDate])

  return (
    <div className="text-gray-700">
      <div className="flex h-screen w-screen grow overflow-auto">
        <div className="flex grow flex-col">
          <div className="mt-4 flex items-center">
            <div className="ml-6 flex">
              <Button variant="ghost" onClick={decrement}>
                <Icons.arrowLeft className="dark:text-white" />
              </Button>
              <Button variant="ghost" onClick={increment}>
                <Icons.arrowRight className="dark:text-white" />
              </Button>
            </div>
            <h2 className="ml-2 text-xl font-bold leading-none">
              {format(datepickerHeaderDate, "MMMM yyyy")}
            </h2>
          </div>
          <div className="mt-4 grid grid-cols-7">
            {DAYS.map((day) => (
              <div className="text-center text-xs font-bold">{day}</div>
            ))}
          </div>
          <div className="mt-1 grid h-auto w-full grow grid-cols-7 grid-rows-5 gap-px bg-gray-200 pt-px dark:bg-gray-700">
            {blankDays.map((_, i) => (
              <div></div>
            ))}
            {dayCount.map((d, i) => (
              <Day day={d} events={getEventsForDay(d)} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Calendar
