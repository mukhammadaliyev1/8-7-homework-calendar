import React, { useState } from "react";

interface Event {
  id: string;
  title: string;
  date: Date;
}

interface EventsByDate {
  [key: string]: Event[];
}

const formatDateToKey = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

const isWithinRange = (date: Date): boolean => {
  const minDate = new Date("1970-01-01");
  const maxDate = new Date("2200-01-01");
  return date >= minDate && date <= maxDate;
};

const CalendarApp: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [eventsList, setEventsList] = useState<EventsByDate>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [selectedDay, setSelectedDay] = useState(formatDateToKey(new Date()));
  const todayFormatted = formatDateToKey(new Date());

  const totalDaysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();

  const currentMonthYear = currentMonth.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const goToPreviousMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() - 1);
    if (isWithinRange(newDate)) {
      setCurrentMonth(newDate);
    } else {
      alert("The calendar supports dates from 1970 to 2200");
    }
  };

  const goToNextMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() + 1);
    if (isWithinRange(newDate)) {
      setCurrentMonth(newDate);
    } else {
      alert("The calendar supports dates from 1970 to 2200");
    }
  };

  const addNewEvent = () => {
    if (eventTitle.trim()) {
      const dateKey = selectedDay;
      const currentDayEvents = eventsList[dateKey] || [];

      if (currentDayEvents.length >= 3) {
        alert("Only 3 events are allowed per day.");
        return;
      }

      const newEvent: Event = {
        id: Math.random().toString(36).substr(2, 9),
        title: eventTitle,
        date: new Date(selectedDay),
      };

      setEventsList((prev) => ({
        ...prev,
        [dateKey]: [...currentDayEvents, newEvent],
      }));
      setEventTitle("");
      setIsModalOpen(false);
    }
  };

  const selectDay = (day: number) => {
    const selectedKey = formatDateToKey(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    );
    setSelectedDay(selectedKey);
  };

  const getEventsForSelectedDay = (day: number): Event[] => {
    const dateKey = formatDateToKey(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    );
    return eventsList[dateKey] || [];
  };

  const isCurrentDay = (day: number): boolean => {
    return formatDateToKey(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    ) === todayFormatted;
  };

  const isDaySelected = (day: number): boolean => {
    return formatDateToKey(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    ) === selectedDay;
  };

  return (
    <div className="max-w-5xl mt-[120px] mx-auto p-6 rounded-xl shadow-2xl font-sans bg-white">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">{currentMonthYear}</h2>
        <div className="space-x-4">
          <button
            onClick={goToPreviousMonth}
            className="px-6 py-2 bg-blue-500 text-white rounded-md shadow-lg hover:bg-blue-400"
          >
            &lt;
          </button>
          <button
            onClick={goToNextMonth}
            className="px-6 py-2 bg-blue-500 text-white rounded-md shadow-lg hover:bg-blue-400"
          >
            &gt;
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-4 text-center text-gray-800 font-medium">
        {weekDays.map((day) => (
          <div key={day} className="text-lg">{day}</div>
        ))}

        {Array.from({ length: firstDayOfMonth }).map((_, index) => (
          <div key={`empty-${index}`} />
        ))}

        {Array.from({ length: totalDaysInMonth }).map((_, index) => {
          const day = index + 1;
          const dayEvents = getEventsForSelectedDay(day);

          return (
            <div
              key={day}
              onClick={() => selectDay(day)}
              className={`flex flex-col items-center justify-center cursor-pointer bg-gray-100 text-gray-800 p-4 rounded-xl shadow-md transition-all duration-300 hover:bg-gray-200 ${
                isDaySelected(day)
                  ? "bg-blue-500 text-white shadow-lg"
                  : isCurrentDay(day)
                  ? "bg-blue-400 text-black shadow-lg"
                  : ""
              }`}
            >
              <div className="font-semibold text-lg">{day}</div>
              <div className="mt-2 space-y-1">
                {dayEvents.map((event) => (
                  <div
                    key={event.id}
                    className="text-sm text-gray-700 border-b px-2 py-1"
                  >
                    {event.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={() => setIsModalOpen(true)}
        className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-md shadow-lg hover:bg-blue-500"
      >
        Add Event
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white shadow-2xl rounded-lg p-8 w-[400px]">
            <h3 className="text-xl text-gray-800 font-semibold mb-6 text-center">
              Add New Event
            </h3>
            <div className="mb-4">
              <label
                htmlFor="title"
                className="block text-sm text-gray-800 font-medium"
              >
                Event Title
              </label>
              <input
                id="title"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                placeholder="New event"
                className="text-black w-full p-3 mt-2 rounded-md border border-gray-300"
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="date"
                className="block text-sm text-gray-800 font-medium"
              >
                Select Date
              </label>
              <input
                id="date"
                type="date"
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
                min="1970-01-01"
                max="2200-01-01"
                className="text-black w-full p-3 mt-2 rounded-md border border-gray-300"
              />
            </div>
            <div className="flex justify-between">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={addNewEvent}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500"
              >
                Add Event
              </button>
            </div>
          </div>
        </div>
      )}
      <p className="text-center mt-4 text-gray-800">Created by islamjnvc</p>
    </div>
  );
};

export default CalendarApp;
