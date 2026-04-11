"use client";
import React, { useState } from "react";
import { useSession, signOut } from "next-auth/react";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: session } = useSession();
  const userName = session?.user?.name ?? "User";
  const userInitial = userName[0].toUpperCase();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white px-6 py-3 flex justify-between items-center shadow-lg border-b border-gray-700">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-lg text-white shadow-lg">
          ✓
        </div>
        <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">TASKI</span>
      </div>

      <div className="relative">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex items-center gap-2 focus:outline-none"
        >
          <div className="w-9 h-9 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold">
            {userInitial}
          </div>
          <span className="font-medium">{userName}</span>
        </button>

        {menuOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
            <ul className="text-sm text-gray-200">
              <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer">
                Profile
              </li>
              <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer">
                Settings
              </li>
              <li
                className="px-4 py-2 hover:bg-gray-700 cursor-pointer text-red-400"
                onClick={() => signOut({ callbackUrl: "/login" })}
              >
                Logout
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}

function Sidebar() {
  return (
    <div className="fixed top-[72px] left-4 h-[calc(100vh-88px)] w-52 rounded-[26px] bg-gradient-to-r from-blue-500 to-purple-500 p-[2px] shadow-lg">
      <aside className="rounded-[22px] bg-gray-900 p-5 text-white h-full text-lg font-bold">
        <ul className="space-y-3">
          <li>
            <a href="/dashboard" className="block hover:text-blue-400">
              📊 Dashboard
            </a>
          </li>
          <li>
            <a href="/projects" className="block hover:text-blue-400">
              📂 Projects
            </a>
          </li>
          <li>
            <a href="/tasks" className="block hover:text-blue-400">
              📋 Tasks
            </a>
          </li>
          <li>
            <a href="/deadlines" className="block hover:text-blue-400">
              ⏰ Deadlines
            </a>
          </li>
          <li>
            <a href="/calendar" className="block hover:text-blue-400">
              📅 Calendar
            </a>
          </li>
          <li>
            <a href="/settings" className="block hover:text-blue-400">
              ⚙️ Settings
            </a>
          </li>
        </ul>
      </aside>
    </div>
  );
}


export default function LayoutWithSidebar({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gray-950 min-h-screen">
      <Navbar />
      <Sidebar />
      <main className="ml-56 mt-[56px] p-6 text-white min-h-[calc(100vh-56px)] overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
