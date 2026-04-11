"use client";

import { useEffect, useState } from "react";
import LayoutWithSidebar from "@/components/LayoutWithSidebar";
import AuthGuard from "@/components/AuthGuard";

interface Project {
  id: string;
  name: string;
  end_date: string;
  status: string;
  progress: string;
}

export default function ProjectCalendar() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch("http://localhost:4000/graphql", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
              query {
                projects {
                  id
                  name
                  end_date
                  status
                  progress
                }
              }
            `,
          }),
        });
        const { data } = await res.json();
        setProjects(data.projects);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      }
    }

    fetchProjects();
  }, []);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getProjectsForDate = (day: number) => {
    return projects.filter((project) => {
      const endDate = new Date(project.end_date);
      return (
        endDate.getDate() === day &&
        endDate.getMonth() === currentDate.getMonth() &&
        endDate.getFullYear() === currentDate.getFullYear()
      );
    });
  };

  const getStatusStyles = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-900 text-green-200 border border-green-700";
      case "on track":
        return "bg-blue-900 text-blue-200 border border-blue-700";
      case "at risk":
        return "bg-amber-900 text-amber-200 border border-amber-700";
      case "off track":
        return "bg-red-900 text-red-200 border border-red-700";
      default:
        return "bg-gray-800 text-gray-200 border border-gray-600";
    }
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days = [];
  const today = new Date();

  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1),
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1),
    );
  };

  return (
    <AuthGuard>
      <LayoutWithSidebar>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2 text-white">
                Project Deadlines Calendar
              </h1>
              <p className="text-gray-400 text-sm">
                Track project deadlines by month with status-colored markers.
              </p>
            </div>

            <div className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 p-4 md:p-6">
              <div className="flex items-center justify-between mb-6 gap-3">
                <button
                  onClick={handlePrevMonth}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-6 py-2 rounded-lg font-semibold transition"
                >
                  Previous
                </button>

                <h2 className="text-lg md:text-2xl font-bold text-white text-center">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>

                <button
                  onClick={handleNextMonth}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-6 py-2 rounded-lg font-semibold transition"
                >
                  Next
                </button>
              </div>

              <div className="grid grid-cols-7 gap-2 mb-3">
                {dayNames.map((day) => (
                  <div
                    key={day}
                    className="text-center font-semibold text-blue-300 text-xs md:text-base py-2"
                  >
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-2">
                {days.map((day, index) => (
                  <div
                    key={index}
                    className={`min-h-[108px] md:min-h-[124px] p-2 md:p-3 rounded-xl border transition ${
                      day
                        ? "bg-gray-900/80 border-gray-700 hover:border-blue-500"
                        : "bg-gray-900/40 border-gray-800"
                    }`}
                  >
                    {day && (
                      <>
                        <div
                          className={`mb-2 inline-flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold ${
                            day === today.getDate() &&
                            currentDate.getMonth() === today.getMonth() &&
                            currentDate.getFullYear() === today.getFullYear()
                              ? "bg-blue-600 text-white"
                              : "text-white"
                          }`}
                        >
                          {day}
                        </div>

                        <div className="space-y-1.5">
                          {getProjectsForDate(day).map((project) => (
                            <div
                              key={project.id}
                              className={`${getStatusStyles(project.status)} rounded-md px-2 py-1 text-[10px] md:text-xs font-semibold leading-tight truncate shadow-sm transition hover:shadow-md`}
                              title={`${project.name} - ${project.status}`}
                            >
                              {project.name}
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-gray-600">
                <h3 className="text-lg font-bold text-white mb-4">Status Legend</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-green-900 border border-green-700 rounded"></div>
                    <span className="text-gray-300">Completed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-900 border border-blue-700 rounded"></div>
                    <span className="text-gray-300">On Track</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-amber-900 border border-amber-700 rounded"></div>
                    <span className="text-gray-300">At Risk</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-red-900 border border-red-700 rounded"></div>
                    <span className="text-gray-300">Off Track</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </LayoutWithSidebar>
    </AuthGuard>
  );
}
