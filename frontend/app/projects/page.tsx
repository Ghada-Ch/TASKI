"use client";

import LayoutWithSidebar from "@/components/LayoutWithSidebar";
import AuthGuard from "@/components/AuthGuard";
import { FaProjectDiagram, FaPlus, FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface Project {
  id: string;
  name: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  progress?: string;
  status: string;
}

interface CreateProjectForm {
  name: string;
  description: string;
  start_date: string;
  end_date: string;
}

export default function ProjectsPage() {
  const { data: session } = useSession();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [form, setForm] = useState<CreateProjectForm>({
    name: "",
    description: "",
    start_date: "",
    end_date: "",
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
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
                description
                start_date
                end_date
                progress
                status
              }
            }
          `,
        }),
      });
      const { data, errors } = await res.json();
      if (errors?.length) {
        throw new Error(errors[0].message || "Failed to fetch projects");
      }
      setProjects(data.projects || []);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getProgressValue = (progress?: string) => {
    if (!progress) return 0;
    const match = progress.match(/\d+/);
    return match ? Number(match[0]) : 0;
  };

  const getProgressLabel = (progress?: string) => {
    if (!progress) return "In Progress";
    const parts = progress.split(" - ");
    return parts[1] || progress;
  };

  const filteredProjects = projects.filter((p) => {
    if (filterStatus === "all") return true;
    return getProgressLabel(p.progress).toLowerCase() === filterStatus.toLowerCase();
  });

  const getStatusColor = (status: string) => {
    if (status === "Completed") return { bg: "bg-green-900", text: "text-green-300", badge: "bg-green-500" };
    if (status === "In Progress") return { bg: "bg-blue-900", text: "text-blue-300", badge: "bg-blue-500" };
    return { bg: "bg-gray-700", text: "text-gray-300", badge: "bg-gray-500" };
  };

  const resetCreateForm = () => {
    setForm({
      name: "",
      description: "",
      start_date: "",
      end_date: "",
    });
    setCreateError("");
  };

  const handleCreateProject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCreateError("");

    if (!session?.accessToken) {
      setCreateError("You must be logged in to create a project.");
      return;
    }

    if (new Date(form.end_date) < new Date(form.start_date)) {
      setCreateError("End date must be after the start date.");
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
            mutation CreateProject($name: String!, $description: String!, $start_date: String!, $end_date: String!) {
              createProject(
                name: $name
                description: $description
                start_date: $start_date
                end_date: $end_date
              ) {
                id
                name
                description
                start_date
                end_date
                progress
                status
              }
            }
          `,
          variables: form,
        }),
      });

      const { data, errors } = await res.json();
      if (errors?.length) {
        throw new Error(errors[0].message || "Failed to create project");
      }

      setProjects((prev) => [data.createProject, ...prev]);
      setIsCreateModalOpen(false);
      resetCreateForm();
    } catch (error) {
      console.error("Failed to create project:", error);
      setCreateError(error instanceof Error ? error.message : "Failed to create project.");
    } finally {
      setIsCreating(false);
    }
  };

  if (isLoading) {
    return (
      <AuthGuard>
        <LayoutWithSidebar>
          <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8 flex items-center justify-center">
            <div className="animate-pulse text-center">
              <div className="h-8 w-48 bg-gray-700 rounded mb-4 mx-auto"></div>
              <div className="h-4 w-32 bg-gray-600 rounded mx-auto"></div>
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
            
            {/* Header Section */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                      <FaProjectDiagram className="text-2xl text-white" />
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-blue-300 to-indigo-400 bg-clip-text text-transparent">
                      Projects
                    </h1>
                  </div>
                  <p className="text-gray-400 text-lg">Manage and track all your projects</p>
                </div>
                <button
                  onClick={() => {
                    resetCreateForm();
                    setIsCreateModalOpen(true);
                  }}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg transition-all shadow-lg"
                >
                  <FaPlus className="text-lg" />
                  New Project
                </button>
              </div>
              <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
            </div>

            {/* Filter & Stats */}
            <div className="mb-8 flex items-center justify-between">
              <div className="flex gap-3">
                {["all", "Completed", "In Progress"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      filterStatus === status
                        ? "bg-blue-600 text-white shadow-lg"
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700"
                    }`}
                  >
                    {status === "all" ? "All Projects" : status}
                    {status === "all" && (
                      <span className="ml-2 text-sm bg-blue-500 px-2 py-0.5 rounded-full">
                        {projects.length}
                      </span>
                    )}
                    {status !== "all" && (
                      <span className="ml-2 text-sm bg-gray-700 px-2 py-0.5 rounded-full">
                        {projects.filter((p) => p.status === status).length}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Projects Grid */}
            {filteredProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {filteredProjects.map((project) => {
                  const progressValue = getProgressValue(project.progress);
                  const progressLabel = getProgressLabel(project.progress);
                  const statusColor = getStatusColor(progressLabel);
                  return (
                    <div
                      key={project.id}
                      className="bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl border border-gray-700 hover:border-blue-600 transition-all duration-300 group"
                    >
                      {/* Header with Status */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition">
                            {project.name}
                          </h3>
                          <p className="text-sm text-gray-400 mt-1">{project.description}</p>
                          <p className="text-xs text-gray-500 mt-2">Health: {project.status}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ml-2 ${statusColor.bg} ${statusColor.text}`}>
                          {progressLabel}
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-gray-400 font-medium">Progress</span>
                          <span className="text-sm font-bold text-blue-400">{progressValue}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all`}
                            style={{ width: `${progressValue}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Dates */}
                      {(project.start_date || project.end_date) && (
                        <div className="mb-6 p-4 bg-gray-900 rounded-lg">
                          <div className="grid grid-cols-2 gap-4 text-xs">
                            {project.start_date && (
                              <div>
                                <span className="text-gray-500">Start Date</span>
                                <p className="text-white font-medium mt-1">
                                  {new Date(project.start_date).toLocaleDateString()}
                                </p>
                              </div>
                            )}
                            {project.end_date && (
                              <div>
                                <span className="text-gray-500">End Date</span>
                                <p className="text-white font-medium mt-1">
                                  {new Date(project.end_date).toLocaleDateString()}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
                          <FaEye className="text-sm" />
                          View
                        </button>
                        <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 font-medium rounded-lg transition-colors">
                          <FaEdit className="text-sm" />
                          Edit
                        </button>
                        <button className="px-4 py-2 bg-red-900 hover:bg-red-800 text-red-300 font-medium rounded-lg transition-colors">
                          <FaTrash className="text-sm" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16">
                <FaProjectDiagram className="text-6xl text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">No projects found</p>
                <p className="text-gray-500 text-sm mt-2">Create a new project to get started</p>
              </div>
            )}

            {/* Table View for All Projects */}
            {filteredProjects.length > 0 && (
              <div className="mt-12 bg-gray-800 rounded-2xl shadow-lg border border-gray-700 overflow-hidden">
                <div className="p-8 border-b border-gray-700">
                  <h2 className="text-2xl font-bold text-white">All Projects</h2>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-700 bg-gray-900">
                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-300">Project Name</th>
                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-300">Status</th>
                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-300">Progress</th>
                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-300">End Date</th>
                        <th className="text-center py-4 px-6 text-sm font-semibold text-gray-300">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProjects.map((project) => {
                        const progressValue = getProgressValue(project.progress);
                        const progressLabel = getProgressLabel(project.progress);
                        const statusColor = getStatusColor(progressLabel);
                        return (
                          <tr
                            key={project.id}
                            className="border-b border-gray-700 hover:bg-gray-700 transition-colors"
                          >
                            <td className="py-4 px-6">
                              <div>
                                <p className="font-semibold text-white">{project.name}</p>
                                <p className="text-xs text-gray-500 mt-1">{project.description}</p>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColor.bg} ${statusColor.text}`}>
                                {progressLabel}
                              </span>
                              <p className="text-xs text-gray-500 mt-1">{project.status}</p>
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-2">
                                <div className="w-24 bg-gray-700 rounded-full h-2">
                                  <div
                                    className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
                                    style={{ width: `${progressValue}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm font-semibold text-gray-300 min-w-fit">{progressValue}%</span>
                              </div>
                            </td>
                            <td className="py-4 px-6 text-gray-300">
                              {project.end_date
                                ? new Date(project.end_date).toLocaleDateString()
                                : "N/A"}
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex justify-center gap-2">
                                <button className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded transition-colors">
                                  View
                                </button>
                                <button className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 text-xs font-medium rounded transition-colors">
                                  Edit
                                </button>
                                <button className="px-3 py-2 bg-red-900 hover:bg-red-800 text-red-300 text-xs font-medium rounded transition-colors">
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {isCreateModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
                <div className="w-full max-w-xl rounded-2xl border border-gray-700 bg-gray-900 shadow-2xl">
                  <div className="flex items-center justify-between border-b border-gray-800 px-6 py-5">
                    <div>
                      <h2 className="text-2xl font-bold text-white">Create Project</h2>
                      <p className="mt-1 text-sm text-gray-400">Add a project and save it directly to the database.</p>
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

                  <form onSubmit={handleCreateProject} className="space-y-5 px-6 py-6">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-300">Project Name</label>
                      <input
                        value={form.name}
                        onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                        required
                        className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white outline-none transition focus:border-blue-500"
                        placeholder="Launch marketing site"
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
                        placeholder="Short summary of the project goals"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-300">Start Date</label>
                        <input
                          type="date"
                          value={form.start_date}
                          onChange={(e) => setForm((prev) => ({ ...prev, start_date: e.target.value }))}
                          required
                          className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white outline-none transition focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-300">End Date</label>
                        <input
                          type="date"
                          value={form.end_date}
                          onChange={(e) => setForm((prev) => ({ ...prev, end_date: e.target.value }))}
                          required
                          className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white outline-none transition focus:border-blue-500"
                        />
                      </div>
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
                        {isCreating ? "Creating..." : "Create Project"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </LayoutWithSidebar>
    </AuthGuard>
  );
}
