"use client";

import { useState } from "react";
import Calendar from "react-calendar";
import { format, isToday } from "date-fns";
import "react-calendar/dist/Calendar.css";

export default function CalendarComponent() {
  const [date, setDate] = useState(new Date());

  const onChange = (newDate) => {
    setDate(newDate);
  };

  const tileClassName = ({ date: tileDate }) => {
    return isToday(tileDate) ? "bg-blue-500 text-white rounded-full" : null;
  };

  const tileContent = ({ date: tileDate }) => {
    return isToday(tileDate) ? (
      <div className="flex items-center justify-center h-full">
        <span className="text-sm">Today</span>
      </div>
    ) : null;
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">
          {format(date, "MMMM yyyy")}
        </h2>
        <p className="text-sm text-gray-600">
          {format(date, "eeee, MMMM do, yyyy")}
        </p>
      </div>
      <Calendar
        onChange={onChange}
        value={date}
        tileClassName={tileClassName}
        tileContent={tileContent}
        className="border-none rounded-lg shadow-sm"
      />
      <div className="mt-4 text-center">
        <p className="text-lg font-medium text-gray-800">
          Selected Date: {format(date, "PPPP")}
        </p>
        <p className="text-sm text-gray-600">
          Current Time: {format(new Date(), "hh:mm:ss a")}
        </p>
      </div>
    </div>
  );
}