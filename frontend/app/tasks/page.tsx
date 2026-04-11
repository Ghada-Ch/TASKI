"use client";

import LayoutWithSidebar from "@/components/LayoutWithSidebar";
import AuthGuard from "@/components/AuthGuard";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { FaPlus } from "react-icons/fa";
import {
  DndContext,
  closestCorners,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type TaskStatus = "Not Started" | "In Progress" | "Completed";
type ColumnId = "todo" | "inprogress" | "done";

interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  dueDate: string;
  Priority: string;
  assignedTo?: { id?: string; name: string };
  project?: { id?: string; name: string };
}

interface ColumnData {
  todo: Task[];
  inprogress: Task[];
  done: Task[];
}

interface ProjectOption {
  id: string;
  name: string;
}

interface UserOption {
  id: string;
  name: string;
}

interface CreateTaskForm {
  title: string;
  description: string;
  dueDate: string;
  Priority: string;
  projectId: string;
  assignedToId: string;
}

const statusToColumn = (status: TaskStatus): ColumnId => {
  if (status === "Not Started") return "todo";
  if (status === "In Progress") return "inprogress";
  return "done";
};

const columnToStatus = (column: ColumnId): TaskStatus => {
  if (column === "todo") return "Not Started";
  if (column === "inprogress") return "In Progress";
  return "Completed";
};

function TaskCard({ id, title, description, Priority, dueDate, assignedTo }: Task) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getPriorityBadge = (priority: string) => {
    if (priority?.toLowerCase() === "high") 
      return { bg: "bg-red-950/70", text: "text-red-300", dot: "bg-red-500" };
    if (priority?.toLowerCase() === "medium") 
      return { bg: "bg-amber-950/70", text: "text-amber-300", dot: "bg-amber-500" };
    return { bg: "bg-green-950/70", text: "text-green-300", dot: "bg-green-500" };
  };

  const priorityStyle = getPriorityBadge(Priority);
  const dueDateTime = new Date(dueDate).getTime();
  const now = new Date().getTime();
  const isOverdue = dueDateTime < now;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl border border-gray-700 hover:border-blue-600 transition-all duration-200 cursor-grab active:cursor-grabbing p-4 mb-3 group"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-medium text-white text-sm flex-1 group-hover:text-blue-400 transition">{title}</h3>
        <span className={`${priorityStyle.dot} w-2 h-2 rounded-full flex-shrink-0 mt-1`}></span>
      </div>
      
      {description && <p className="text-xs text-gray-400 mb-3 line-clamp-2">{description}</p>}
      
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className={`${priorityStyle.bg} ${priorityStyle.text} text-xs font-medium px-2 py-1 rounded`}>
            {Priority}
          </span>
        </div>
        
        <div className="flex items-center justify-between text-xs">
          <span className={`${isOverdue ? "text-red-400 font-medium" : "text-gray-400"}`}>
            {new Date(dueDate).toLocaleDateString()}
          </span>
          {assignedTo && (
            <div className="group/tooltip relative">
              <span className="inline-flex items-center px-2 py-1 bg-blue-950/70 text-blue-300 font-medium rounded text-xs border border-blue-800">
                {(() => {
                  const nameParts = assignedTo.name.trim().split(' ');
                  if (nameParts.length > 1) {
                    // Last initial . First name
                    const lastInitial = nameParts[nameParts.length - 1].charAt(0).toUpperCase();
                    const firstName = nameParts[0];
                    return `${lastInitial}.${firstName}`;
                  }
                  return assignedTo.name;
                })()}
              </span>
              <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover/tooltip:block bg-gray-800 text-white text-xs py-1 px-2 rounded whitespace-nowrap z-10">
                {assignedTo.name}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ColumnSection({ id, title, tasks }: { id: ColumnId; title: string; tasks: Task[] }) {
  const { setNodeRef } = useDroppable({ id });

  const getColumnColor = (columnId: ColumnId) => {
    if (columnId === "todo") return { bg: "bg-gray-800/90", accent: "bg-gray-700", icon: "📋", line: "from-gray-500" };
    if (columnId === "inprogress") return { bg: "bg-slate-800/90", accent: "bg-blue-950/70", icon: "⚙️", line: "from-blue-500" };
    return { bg: "bg-emerald-950/40", accent: "bg-emerald-950/70", icon: "✓", line: "from-emerald-500" };
  };

  const colors = getColumnColor(id);

  return (
    <div
      ref={setNodeRef}
      className={`${colors.bg} rounded-2xl transition-colors flex flex-col min-h-[600px] border border-gray-700 shadow-lg`}
    >
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            <span className="text-lg">{colors.icon}</span>
            {title}
          </h2>
          <span className={`${colors.accent} text-gray-200 text-xs font-bold px-2.5 py-1 rounded-full border border-gray-700`}>
            {tasks.length}
          </span>
        </div>
        <div className={`h-1 bg-gradient-to-r ${colors.line} to-transparent rounded`}></div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {tasks.length > 0 ? (
          <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
            {tasks.map((task) => (
              <TaskCard key={task.id} {...task} />
            ))}
          </SortableContext>
        ) : (
          <div className="flex items-center justify-center h-32 text-gray-500">
            <div className="text-center">
              <p className="text-sm">No tasks yet</p>
              <p className="text-xs mt-1">Drag tasks here</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function KanbanBoard() {
  const { data: session } = useSession();
  const [columns, setColumns] = useState<ColumnData>({ todo: [], inprogress: [], done: [] });
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [users, setUsers] = useState<UserOption[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [form, setForm] = useState<CreateTaskForm>({
    title: "",
    description: "",
    dueDate: "",
    Priority: "Medium",
    projectId: "",
    assignedToId: "",
  });

  useEffect(() => {
    fetchTasks();
    fetchFormOptions();
  }, []);

  const fetchTasks = async () => {
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
                status
                dueDate
                Priority
                assignedTo { id name }
                project { id name }
              }
            }
          `,
        }),
      });
      const { data } = await res.json();

      const grouped: ColumnData = { todo: [], inprogress: [], done: [] };
      data.tasks.forEach((task: Task) => {
        const column = statusToColumn(task.status as TaskStatus);
        grouped[column].push(task);
      });

      setColumns(grouped);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFormOptions = async () => {
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
              }
              users {
                id
                name
              }
            }
          `,
        }),
      });

      const { data, errors } = await res.json();
      if (errors?.length) {
        throw new Error(errors[0].message || "Failed to load task form options");
      }

      const projectOptions = data.projects || [];
      const userOptions = data.users || [];

      setProjects(projectOptions);
      setUsers(userOptions);
      setForm((prev) => ({
        ...prev,
        projectId: prev.projectId || projectOptions[0]?.id || "",
        assignedToId: prev.assignedToId || userOptions[0]?.id || "",
      }));
    } catch (error) {
      console.error("Failed to load task form options:", error);
    }
  };

  const updateTaskStatus = async (taskId: string, newStatus: TaskStatus) => {
    try {
      await fetch("http://localhost:4000/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            mutation UpdateTask($id: String!, $data: UpdateTaskInput!) {
              updateTask(id: $id, data: $data) { id status }
            }
          `,
          variables: {
            id: taskId,
            data: { status: newStatus },
          },
        }),
      });
    } catch (error) {
      console.error("Failed to update task status:", error);
    }
  };

  const resetCreateForm = () => {
    setForm({
      title: "",
      description: "",
      dueDate: "",
      Priority: "Medium",
      projectId: projects[0]?.id || "",
      assignedToId: users[0]?.id || "",
    });
    setCreateError("");
  };

  const handleCreateTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCreateError("");

    if (!session?.accessToken) {
      setCreateError("You must be logged in to create a task.");
      return;
    }

    if (!form.projectId || !form.assignedToId) {
      setCreateError("Please choose both a project and an assignee.");
      return;
    }

    setIsCreating(true);

    try {
      const res = await fetch("http://localhost:4000/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify({
          query: `
            mutation CreateTask(
              $title: String!
              $description: String!
              $projectId: String!
              $assignedToId: String!
              $dueDate: String!
              $Priority: String!
            ) {
              createTask(
                title: $title
                description: $description
                projectId: $projectId
                assignedToId: $assignedToId
                dueDate: $dueDate
                Priority: $Priority
              ) {
                id
                title
                description
                status
                dueDate
                Priority
                assignedTo { id name }
                project { id name }
              }
            }
          `,
          variables: form,
        }),
      });

      const { data, errors } = await res.json();
      if (errors?.length) {
        throw new Error(errors[0].message || "Failed to create task");
      }

      const newTask: Task = data.createTask;
      const targetColumn = statusToColumn(newTask.status as TaskStatus);

      setColumns((prev) => ({
        ...prev,
        [targetColumn]: [newTask, ...prev[targetColumn]],
      }));
      setIsCreateModalOpen(false);
      resetCreateForm();
    } catch (error) {
      console.error("Failed to create task:", error);
      setCreateError(error instanceof Error ? error.message : "Failed to create task.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = Object.values(columns)
      .flat()
      .find((t) => t.id === active.id);
    if (task) setActiveTask(task);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);
    if (!over) return;

    const fromColumn = Object.keys(columns).find((col) =>
      columns[col as ColumnId].some((t) => t.id === active.id)
    ) as ColumnId | undefined;

    let toColumn: ColumnId | undefined = Object.keys(columns).find((col) =>
      columns[col as ColumnId].some((t) => t.id === over.id)
    ) as ColumnId | undefined;

    if (!toColumn && Object.keys(columns).includes(over.id as string)) {
      toColumn = over.id as ColumnId;
    }

    if (!fromColumn || !toColumn) return;

    if (fromColumn === toColumn) {
      const oldIndex = columns[fromColumn].findIndex((t) => t.id === active.id);
      const newIndex = columns[toColumn].findIndex((t) => t.id === over.id);
      if (newIndex === -1) return;
      setColumns((prev) => ({
        ...prev,
        [fromColumn]: arrayMove(prev[fromColumn], oldIndex, newIndex),
      }));
    } else {
      const fromTasks = [...columns[fromColumn]];
      const toTasks = [...columns[toColumn]];
      const movingTask = fromTasks.find((t) => t.id === active.id);
      if (!movingTask) return;

      const newStatus = columnToStatus(toColumn);
      updateTaskStatus(movingTask.id, newStatus);

      setColumns((prev) => ({
        ...prev,
        [fromColumn]: fromTasks.filter((t) => t.id !== active.id),
        [toColumn]: [...toTasks, { ...movingTask, status: newStatus }],
      }));
    }
  };

  if (isLoading) {
    return (
      <AuthGuard>
        <LayoutWithSidebar>
          <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8 flex flex-col items-center justify-center">
            <div className="animate-pulse">
              <div className="h-8 w-48 bg-gray-700 rounded mb-4"></div>
              <div className="h-4 w-32 bg-gray-600 rounded"></div>
            </div>
          </div>
        </LayoutWithSidebar>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <LayoutWithSidebar>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-white">Task Board</h1>
                  <p className="text-gray-400 text-sm mt-1">Manage your tasks across different stages</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg">
                    <span className="text-sm text-gray-400">Total Tasks:</span>
                    <span className="font-bold text-white">{Object.values(columns).flat().length}</span>
                  </div>
                  <button
                    onClick={() => {
                      resetCreateForm();
                      setIsCreateModalOpen(true);
                    }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg transition-all shadow-lg"
                  >
                    <FaPlus className="text-sm" />
                    Create Task
                  </button>
                </div>
              </div>
              <div className="h-1 bg-gradient-to-r from-blue-500 via-blue-400 to-transparent rounded-full"></div>
            </div>

            {/* Kanban Board */}
            <DndContext collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <ColumnSection id="todo" title="To Do" tasks={columns.todo} />
                <ColumnSection id="inprogress" title="In Progress" tasks={columns.inprogress} />
                <ColumnSection id="done" title="Completed" tasks={columns.done} />
              </div>

              <DragOverlay>
                {activeTask ? (
                  <div className="bg-gray-800 rounded-xl shadow-2xl border-2 border-blue-500 p-4 max-w-sm">
                    <p className="font-semibold text-white">{activeTask.title}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {activeTask.Priority} priority • {new Date(activeTask.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>

            {/* Footer Info */}
            <div className="mt-8 pt-6 border-t border-gray-700">
              <p className="text-xs text-gray-400 text-center">
                💡 Drag tasks between columns to change their status. Changes are saved automatically.
              </p>
            </div>

            {isCreateModalOpen && (
              <div className="fixed inset-0 z-[70] overflow-y-auto bg-black/70 px-4 py-24">
                <div className="flex min-h-full items-start justify-center">
                  <div className="w-full max-w-2xl rounded-2xl border border-gray-700 bg-gray-900 shadow-2xl">
                  <div className="flex items-center justify-between border-b border-gray-800 px-6 py-5">
                    <div>
                      <h2 className="text-2xl font-bold text-white">Create Task</h2>
                      <p className="mt-1 text-sm text-gray-400">Add a task and save it directly to the database.</p>
                    </div>
                    <button
                      onClick={() => {
                        setIsCreateModalOpen(false);
                        resetCreateForm();
                      }}
                      className="rounded-lg px-3 py-2 text-sm text-gray-400 transition hover:bg-gray-800 hover:text-white"
                    >
                      Close
                    </button>
                  </div>

                  <form onSubmit={handleCreateTask} className="max-h-[calc(100vh-12rem)] space-y-5 overflow-y-auto px-6 py-6">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-300">Task Title</label>
                      <input
                        value={form.title}
                        onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                        required
                        className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white outline-none transition focus:border-blue-500"
                        placeholder="Design landing page hero"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-300">Description</label>
                      <textarea
                        value={form.description}
                        onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                        required
                        rows={4}
                        className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white outline-none transition focus:border-blue-500"
                        placeholder="Add the task details and acceptance criteria"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-300">Due Date</label>
                        <input
                          type="date"
                          value={form.dueDate}
                          onChange={(e) => setForm((prev) => ({ ...prev, dueDate: e.target.value }))}
                          required
                          className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white outline-none transition focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-300">Priority</label>
                        <select
                          value={form.Priority}
                          onChange={(e) => setForm((prev) => ({ ...prev, Priority: e.target.value }))}
                          className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white outline-none transition focus:border-blue-500"
                        >
                          <option value="High">High</option>
                          <option value="Medium">Medium</option>
                          <option value="Low">Low</option>
                        </select>
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-300">Assignee</label>
                        <select
                          value={form.assignedToId}
                          onChange={(e) => setForm((prev) => ({ ...prev, assignedToId: e.target.value }))}
                          required
                          className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white outline-none transition focus:border-blue-500"
                        >
                          <option value="" disabled>Select user</option>
                          {users.map((user) => (
                            <option key={user.id} value={user.id}>
                              {user.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-300">Project</label>
                      <select
                        value={form.projectId}
                        onChange={(e) => setForm((prev) => ({ ...prev, projectId: e.target.value }))}
                        required
                        className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white outline-none transition focus:border-blue-500"
                      >
                        <option value="" disabled>Select project</option>
                        {projects.map((project) => (
                          <option key={project.id} value={project.id}>
                            {project.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {createError && (
                      <div className="rounded-lg border border-red-800 bg-red-950/50 px-4 py-3 text-sm text-red-300">
                        {createError}
                      </div>
                    )}

                    <div className="flex justify-end gap-3 border-t border-gray-800 pt-4">
                      <button
                        type="button"
                        onClick={() => {
                          setIsCreateModalOpen(false);
                          resetCreateForm();
                        }}
                        className="rounded-lg border border-gray-700 px-4 py-2 text-sm font-medium text-gray-300 transition hover:bg-gray-800"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isCreating}
                        className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2 text-sm font-semibold text-white transition hover:from-blue-700 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        {isCreating ? "Creating..." : "Create Task"}
                      </button>
                    </div>
                  </form>
                </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </LayoutWithSidebar>
    </AuthGuard>
  );
}
