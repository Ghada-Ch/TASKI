"use client";
import React from "react";
import LayoutWithSidebar from "@/components/LayoutWithSidebar";
import AuthGuard from "@/components/AuthGuard";
import { FaTasks, FaProjectDiagram, FaUsers, FaCheckCircle, FaClock, FaFire } from "react-icons/fa";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [projects, setProjects] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  
  useEffect(() => {
    async function fetchProjects() {
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL!, {
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
      const { data } = await res.json();
      setProjects(data.projects);
    }
    fetchProjects();

    async function fetchUsers() {
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL!, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            query {
              users {
                id
                name
                email
                job
              }
            }
          `,
        }),
      });
      const { data } = await res.json();
      setUsers(data.users);
    }
    fetchUsers();
  }, []);

  const completedProjects = projects.filter((p) => p.status === "Completed").length;
  const pendingTasks = projects.reduce(
    (acc, p) => acc + (p.status !== "Completed" ? (p.tasks?.length || 0) : 0),
    0
  );

  return (
    <AuthGuard>
      <LayoutWithSidebar>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
          <div className="max-w-7xl mx-auto">
            
            {/* Header Section */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-blue-300 to-indigo-400 bg-clip-text text-transparent">
                    Dashboard
                  </h1>
                  <p className="text-gray-400 mt-2 text-lg">Welcome back! 👋 Here's your project overview</p>
                </div>
                <div className="hidden lg:flex items-center gap-2 px-6 py-3 bg-gray-800 rounded-full shadow-lg border border-blue-900">
                  <FaFire className="text-orange-400 text-lg" />
                  <span className="text-sm font-semibold text-gray-200">On a roll!</span>
                </div>
              </div>
              <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {/* Total Projects Card */}
              <div className="group bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-700 hover:border-blue-600">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-4 bg-gray-900 rounded-xl group-hover:scale-110 transition-transform">
                    <FaProjectDiagram className="text-2xl text-blue-400" />
                  </div>
                  <span className="text-xs font-bold text-blue-400 bg-gray-900 px-3 py-1 rounded-full border border-blue-700">+12%</span>
                </div>
                <h3 className="text-gray-400 text-sm font-medium">Total Projects</h3>
                <p className="text-4xl font-bold text-white mt-2">{projects.length}</p>
                <p className="text-xs text-gray-500 mt-3">Active this month</p>
              </div>

              {/* Pending Tasks Card */}
              <div className="group bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-700 hover:border-orange-600">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-4 bg-gray-900 rounded-xl group-hover:scale-110 transition-transform">
                    <FaClock className="text-2xl text-orange-400" />
                  </div>
                  <span className="text-xs font-bold text-orange-400 bg-gray-900 px-3 py-1 rounded-full border border-orange-700">Urgent</span>
                </div>
                <h3 className="text-gray-400 text-sm font-medium">Pending Tasks</h3>
                <p className="text-4xl font-bold text-white mt-2">{pendingTasks}</p>
                <p className="text-xs text-gray-500 mt-3">Awaiting completion</p>
              </div>

              {/* Completed Projects Card */}
              <div className="group bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-700 hover:border-green-600">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-4 bg-gray-900 rounded-xl group-hover:scale-110 transition-transform">
                    <FaCheckCircle className="text-2xl text-green-400" />
                  </div>
                  <span className="text-xs font-bold text-green-400 bg-gray-900 px-3 py-1 rounded-full border border-green-700">Success</span>
                </div>
                <h3 className="text-gray-400 text-sm font-medium">Completed</h3>
                <p className="text-4xl font-bold text-white mt-2">{completedProjects}</p>
                <p className="text-xs text-gray-500 mt-3">Projects finished</p>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* My Tasks Section - Spans 2 columns */}
              <div className="lg:col-span-2 bg-gray-800 rounded-2xl shadow-lg border border-gray-700 overflow-hidden">
                <div className="p-8 border-b border-gray-700">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-gray-900 rounded-xl">
                      <FaTasks className="text-2xl text-blue-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">My Tasks</h3>
                  </div>

                  <div className="flex gap-2 border-b border-gray-700">
                    {["all", "in-progress", "completed"].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-3 text-sm font-medium transition-all duration-300 ${
                          activeTab === tab
                            ? "text-blue-400 border-b-2 border-blue-500 bg-gray-900"
                            : "text-gray-400 hover:text-gray-200 hover:bg-gray-900"
                        }`}
                      >
                        {tab === "all" && "📋 All Tasks"}
                        {tab === "in-progress" && "⚙️ In Progress"}
                        {tab === "completed" && "✅ Completed"}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-8">
                  <div className="space-y-3 text-center text-gray-400">
                    {activeTab === "all" && (
                      <div className="py-8">
                        <p className="text-lg">📌 View all tasks in the Tasks page for detailed management</p>
                        <p className="text-sm mt-2 text-gray-500">Navigate to Tasks tab to see your complete task list with drag-and-drop functionality</p>
                      </div>
                    )}
                    {activeTab === "in-progress" && (
                      <div className="py-8">
                        <p className="text-lg">⚙️ Tasks currently being worked on</p>
                        <p className="text-sm mt-2 text-gray-500">Keep pushing! You're making great progress.</p>
                      </div>
                    )}
                    {activeTab === "completed" && (
                      <div className="py-8">
                        <p className="text-lg">🎉 Great work on your completed tasks!</p>
                        <p className="text-sm mt-2 text-gray-500">You've completed {completedProjects} projects so far.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* My Team Section */}
              <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 overflow-hidden">
                <div className="p-8 border-b border-gray-700">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gray-900 rounded-xl">
                      <FaUsers className="text-2xl text-purple-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">My Team</h3>
                  </div>
                </div>

                <div className="p-8 space-y-2 max-h-96 overflow-y-auto">
                  {users.map((member, index) => {
                    const colors = [
                      { bg: "bg-gradient-to-br from-blue-500 to-blue-600", text: "bg-blue-900 text-blue-300" },
                      { bg: "bg-gradient-to-br from-purple-500 to-purple-600", text: "bg-purple-900 text-purple-300" },
                      { bg: "bg-gradient-to-br from-pink-500 to-pink-600", text: "bg-pink-900 text-pink-300" },
                      { bg: "bg-gradient-to-br from-yellow-500 to-yellow-600", text: "bg-yellow-900 text-yellow-300" },
                      { bg: "bg-gradient-to-br from-green-500 to-green-600", text: "bg-green-900 text-green-300" },
                      { bg: "bg-gradient-to-br from-indigo-500 to-indigo-600", text: "bg-indigo-900 text-indigo-300" },
                    ];
                    const color = colors[index % colors.length];

                    return (
                      <div key={member.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-700 transition-colors">
                        <div className="flex items-center gap-2">
                          <div className={`w-10 h-10 rounded-full ${color.bg} flex items-center justify-center text-white font-bold text-sm`}>
                            {member.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-white leading-tight">{member.name}</p>
                            {member.job && (
                              <span className={`text-xs font-medium px-2 py-0.5 rounded-full inline-block mt-0.5 ${color.text}`}>
                                {member.job}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Projects Section */}
            <div className="mt-8 bg-gray-800 rounded-2xl shadow-lg border border-gray-700 overflow-hidden">
              <div className="p-8 border-b border-gray-700">
                <div className="flex items-center gap-4 mb-2">
                  <div className="p-3 bg-gray-900 rounded-xl">
                    <FaProjectDiagram className="text-2xl text-green-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">My Projects</h3>
                </div>
                <p className="text-gray-500 text-sm mt-2 ml-16">Overview of all your active projects</p>
              </div>

              <div className="p-8 overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-300">Project Name</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-300">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-300">Progress</th>
                      <th className="text-center py-3 px-4 text-sm font-semibold text-gray-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((project) => (
                      <tr key={project.id} className="border-b border-gray-700 hover:bg-gray-700 transition-colors">
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-semibold text-white">{project.name}</p>
                            <p className="text-xs text-gray-500">{project.description}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                            project.status === "Completed" 
                              ? "bg-green-900 text-green-300"
                              : project.status === "In Progress"
                              ? "bg-blue-900 text-blue-300"
                              : "bg-gray-700 text-gray-300"
                          }`}>
                            {project.status}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-full bg-gray-700 rounded-full h-2 max-w-xs">
                              <div 
                                className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full"
                                style={{ width: `${project.progress || 0}%` }}
                              ></div>
                            </div>
                            <span className="text-xs font-semibold text-gray-300 min-w-fit">{project.progress || 0}%</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex justify-center gap-2">
                            <button className="px-3 py-2 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors">
                              View
                            </button>
                            <button className="px-3 py-2 bg-gray-700 text-gray-200 text-xs font-medium rounded-lg hover:bg-gray-600 transition-colors">
                              Edit
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      </LayoutWithSidebar>
    </AuthGuard>
  );
}

