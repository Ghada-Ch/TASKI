"use client";

import { useEffect, useState } from "react";
import LayoutWithSidebar from "@/components/LayoutWithSidebar";
import AuthGuard from "@/components/AuthGuard";

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: string;
  isCompleted: boolean;
  Priority: string;
  project: {
    id: string;
    name: string;
  };
  assignedTo: {
    name: string;
  };
}

export default function DeadlinesPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<"all" | "overdue" | "upcoming" | "completed">("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTasks() {
      try {
        const res = await fetch("http://localhost:4000/graphql", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
              query {
                tasks {
                  id
                  title
                  description
                  dueDate
                  status
                  isCompleted
                  Priority
                  project {
                    id
                    name
                  }
                  assignedTo {
                    name
                  }
                }
              }
            `,
          }),
        });
        const { data } = await res.json();
        setTasks(data.tasks.sort((a: Task, b: Task) => 
          new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        ));
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchTasks();
  }, []);

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString();
  };

  const isToday = (dueDate: string) => {
    return new Date(dueDate).toDateString() === new Date().toDateString();
  };

  const getDaysUntil = (dueDate: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    const diff = due.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const getFilteredTasks = () => {
    return tasks.filter((task) => {
      switch (filter) {
        case "overdue":
          return isOverdue(task.dueDate) && !task.isCompleted;
        case "upcoming":
          return !isOverdue(task.dueDate) && !task.isCompleted;
        case "completed":
          return task.isCompleted;
        default:
          return true;
      }
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "text-red-400";
      case "medium":
        return "text-yellow-400";
      case "low":
        return "text-green-400";
      default:
        return "text-gray-400";
    }
  };

  const getStatusBadgeColor = (status: string, isCompleted: boolean) => {
    if (isCompleted) return "bg-green-500/20 text-green-400";
    if (isOverdue(tasks.find(t => t.status === status)?.dueDate || "")) 
      return "bg-red-500/20 text-red-400";
    return "bg-blue-500/20 text-blue-400";
  };

  const getUrgencyIndicator = (dueDate: string, isCompleted: boolean) => {
    if (isCompleted) return { color: "bg-green-500", text: "✓ Done" };
    if (isOverdue(dueDate)) return { color: "bg-red-500", text: "⚠ Overdue" };
    
    const days = getDaysUntil(dueDate);
    if (days === 0) return { color: "bg-orange-500", text: "🔥 Today" };
    if (days === 1) return { color: "bg-yellow-500", text: "⏰ Tomorrow" };
    if (days <= 3) return { color: "bg-yellow-400", text: `${days}d left` };
    
    return { color: "bg-blue-500", text: `${days}d left` };
  };

  const filteredTasks = getFilteredTasks();

  return (
    <AuthGuard>
      <LayoutWithSidebar>
        <div className="p-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-white">
              ⏰ Task Deadlines
            </h1>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-3 mb-8">
              {(["all", "overdue", "upcoming", "completed"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg font-semibold transition ${
                    filter === f
                      ? "bg-blue-500 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                  {f === "all" && ` (${tasks.length})`}
                  {f === "overdue" && ` (${tasks.filter(t => isOverdue(t.dueDate) && !t.isCompleted).length})`}
                  {f === "upcoming" && ` (${tasks.filter(t => !isOverdue(t.dueDate) && !t.isCompleted).length})`}
                  {f === "completed" && ` (${tasks.filter(t => t.isCompleted).length})`}
                </button>
              ))}
            </div>

            {/* Tasks List */}
            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">Loading deadlines...</p>
              </div>
            ) : filteredTasks.length === 0 ? (
              <div className="text-center py-12 bg-gray-800 rounded-lg">
                <p className="text-gray-400 text-lg">No tasks found in this category</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTasks.map((task) => {
                  const urgency = getUrgencyIndicator(task.dueDate, task.isCompleted);
                  const daysLeft = getDaysUntil(task.dueDate);

                  return (
                    <div
                      key={task.id}
                      className="bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl hover:bg-gray-750 transition border-l-4 border-blue-500"
                    >
                      <div className="flex items-start justify-between gap-4">
                        {/* Left: Task Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-bold text-white mb-2 truncate">
                            {task.title}
                          </h3>
                          <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                            {task.description}
                          </p>

                          <div className="flex flex-wrap gap-3 text-sm">
                            <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded">
                              📁 {task.project.name}
                            </span>
                            <span className="bg-gray-700 text-gray-300 px-3 py-1 rounded">
                              👤 {task.assignedTo.name}
                            </span>
                            <span className={`px-3 py-1 rounded font-semibold ${getPriorityColor(task.Priority)}`}>
                              {task.Priority ? `⭐ ${task.Priority}` : "Priority"}
                            </span>
                          </div>
                        </div>

                        {/* Right: Deadline & Status */}
                        <div className="flex flex-col items-end gap-3">
                          {/* Urgency Badge */}
                          <div className={`${urgency.color} text-white px-4 py-2 rounded-lg font-semibold text-center whitespace-nowrap`}>
                            {urgency.text}
                          </div>

                          {/* Due Date */}
                          <div className="text-right">
                            <p className="text-gray-400 text-xs">Due Date</p>
                            <p className="text-white font-semibold">
                              {new Date(task.dueDate).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </p>
                          </div>

                          {/* Status */}
                          <p className={`px-3 py-1 rounded text-sm font-semibold ${getStatusBadgeColor(task.status, task.isCompleted)}`}>
                            {task.isCompleted ? "✓ Completed" : task.status}
                          </p>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      {!task.isCompleted && daysLeft > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-700">
                          <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                            <span>Time Remaining</span>
                            <span>{Math.max(0, daysLeft)} days</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition ${
                                daysLeft <= 1
                                  ? "bg-red-500"
                                  : daysLeft <= 3
                                  ? "bg-yellow-500"
                                  : "bg-blue-500"
                              }`}
                              style={{ width: `${Math.min(100, (daysLeft / 30) * 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </LayoutWithSidebar>
    </AuthGuard>
  );
}
