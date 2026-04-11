"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

function WorkerScene() {
  return (
    <div className="hidden 2xl:flex h-[520px] w-72 overflow-hidden rounded-[30px] border border-blue-900/60 bg-gradient-to-b from-slate-900 via-gray-900 to-slate-950 p-6 shadow-2xl relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_transparent_45%)]" />
      <div className="signal-dot-a absolute left-10 top-28 h-3 w-3 rounded-full bg-blue-400/80" />
      <div className="signal-dot-b absolute right-10 top-48 h-3 w-3 rounded-full bg-indigo-400/80" />
      <div className="signal-dot-c absolute left-24 bottom-20 h-3 w-3 rounded-full bg-emerald-400/80" />
      <div className="relative z-10 flex w-full flex-col">
        <div className="mb-6">
          <p className="text-xs uppercase tracking-[0.28em] text-blue-300/80">Execution Flow</p>
          <h2 className="mt-2 text-2xl font-bold text-white">Workers moving tasks</h2>
          <p className="mt-2 text-sm leading-6 text-gray-400">
            Small actions, steady handoffs, visible progress.
          </p>
        </div>

        <div className="relative mt-4 flex-1 rounded-[24px] border border-gray-800 bg-gray-950/70 p-4">
          <div className="flow-line absolute bottom-6 left-1/2 top-6 w-px -translate-x-1/2 bg-gradient-to-b from-blue-500/20 via-blue-400/70 to-indigo-500/20" />

          <div className="worker-float-a absolute left-6 top-10">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-800 bg-blue-950 text-lg text-blue-300 shadow-lg">
              W
            </div>
          </div>

          <div className="worker-float-b absolute right-7 top-36">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-indigo-800 bg-indigo-950 text-lg text-indigo-300 shadow-lg">
              W
            </div>
          </div>

          <div className="task-card-slide-a absolute left-16 top-20 rounded-xl border border-blue-700/70 bg-blue-900/70 px-3 py-2 text-xs font-semibold text-blue-100 shadow-lg">
            Draft landing copy
          </div>

          <div className="task-card-slide-b absolute right-16 top-56 rounded-xl border border-amber-700/70 bg-amber-900/70 px-3 py-2 text-xs font-semibold text-amber-100 shadow-lg">
            Review client notes
          </div>

          <div className="task-card-slide-c absolute bottom-24 left-14 rounded-xl border border-emerald-700/70 bg-emerald-900/70 px-3 py-2 text-xs font-semibold text-emerald-100 shadow-lg">
            Ship task update
          </div>
        </div>
      </div>
    </div>
  );
}

function ManagerScene() {
  return (
    <div className="hidden 2xl:flex h-[520px] w-72 overflow-hidden rounded-[30px] border border-indigo-900/60 bg-gradient-to-b from-slate-950 via-gray-900 to-slate-950 p-6 shadow-2xl relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(99,102,241,0.18),_transparent_45%)]" />
      <div className="signal-dot-a absolute right-12 top-24 h-3 w-3 rounded-full bg-indigo-400/80" />
      <div className="signal-dot-b absolute left-12 top-56 h-3 w-3 rounded-full bg-blue-400/80" />
      <div className="signal-dot-c absolute right-24 bottom-28 h-3 w-3 rounded-full bg-amber-400/80" />
      <div className="relative z-10 flex w-full flex-col">
        <div className="mb-6">
          <p className="text-xs uppercase tracking-[0.28em] text-indigo-300/80">Coordination</p>
          <h2 className="mt-2 text-2xl font-bold text-white">Managers guiding delivery</h2>
          <p className="mt-2 text-sm leading-6 text-gray-400">
            Priorities align, blockers drop, deadlines stay visible.
          </p>
        </div>

        <div className="relative mt-4 flex-1 rounded-[24px] border border-gray-800 bg-gray-950/70 p-5">
          <div className="manager-board-pulse absolute left-6 right-6 top-8 rounded-2xl border border-gray-800 bg-gray-900/90 p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-semibold text-white">Weekly Board</span>
              <span className="rounded-full bg-blue-950 px-2 py-1 text-[10px] font-bold text-blue-300">Live</span>
            </div>
            <div className="space-y-2">
              <div className="h-2 w-[78%] rounded-full bg-gradient-to-r from-blue-500 to-blue-300" />
              <div className="h-2 w-[58%] rounded-full bg-gradient-to-r from-amber-500 to-amber-300" />
              <div className="h-2 w-[84%] rounded-full bg-gradient-to-r from-emerald-500 to-emerald-300" />
            </div>
          </div>

          <div className="manager-note-float absolute bottom-24 left-8 rounded-2xl border border-indigo-800 bg-indigo-950/80 px-4 py-3 shadow-lg">
            <p className="text-[10px] uppercase tracking-[0.2em] text-indigo-300">Manager</p>
            <p className="mt-1 text-sm font-semibold text-white">Shift design task to today</p>
          </div>

          <div className="absolute bottom-12 right-10 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-indigo-800 bg-indigo-900/90 font-bold text-indigo-200">
              M
            </div>
            <div className="h-px w-16 bg-gradient-to-r from-indigo-400 to-transparent" />
            <div className="worker-reply-pop flex h-10 w-10 items-center justify-center rounded-2xl border border-emerald-800 bg-emerald-900/90 font-bold text-emerald-200">
              OK
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid email or password");
    } else {
      router.push("/dashboard");
    }
  }

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="animate-pulse text-center">
          <div className="mx-auto mb-4 h-8 w-40 rounded bg-gray-700"></div>
          <div className="mx-auto h-4 w-28 rounded bg-gray-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4 py-10">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-16 top-20 h-72 w-72 rounded-full bg-blue-600/10 blur-3xl" />
        <div className="absolute bottom-10 right-0 h-80 w-80 rounded-full bg-indigo-600/10 blur-3xl" />
      </div>

      <div className="relative z-10 flex w-full max-w-[1480px] items-center justify-center gap-8">
        <WorkerScene />

        <div className="relative w-full max-w-md shrink-0">
          <div className="orbit orbit-one absolute -left-12 top-16 h-16 w-16 rounded-2xl border border-blue-700 bg-blue-900/80 shadow-2xl backdrop-blur-sm">
            <div className="flex h-full items-center justify-center text-xs font-semibold text-blue-100">
              Task
            </div>
          </div>
          <div className="orbit orbit-two absolute -right-10 top-36 h-14 w-14 rounded-full border border-indigo-700 bg-indigo-900/80 shadow-2xl backdrop-blur-sm">
            <div className="flex h-full items-center justify-center text-[11px] font-semibold text-indigo-100">
              Plan
            </div>
          </div>
          <div className="orbit orbit-three absolute left-6 -bottom-8 h-14 w-14 rounded-full border border-emerald-700 bg-emerald-900/80 shadow-2xl backdrop-blur-sm">
            <div className="flex h-full items-center justify-center text-[11px] font-semibold text-emerald-100">
              Done
            </div>
          </div>
          <div className="pulse-ring absolute inset-[-18px] rounded-[34px] border border-blue-500/30" />
          <div className="pulse-ring-delayed absolute inset-[-32px] rounded-[42px] border border-indigo-500/20" />

          <div className="rounded-[28px] bg-gradient-to-r from-blue-500 to-indigo-600 p-[2px] shadow-2xl">
            <div className="card-float rounded-[26px] border border-gray-800 bg-gray-900 px-8 py-10">
              <div className="mb-8 text-center">
                <div className="mb-5 flex items-center justify-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-lg text-white shadow-lg">
                  ✓
                 </div>
                  <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-3xl font-bold text-transparent">
                    TASKI
                  </span>
                </div>
                <h1 className="text-3xl font-bold text-white">Welcome back</h1>
                <p className="mt-2 text-sm text-gray-400">
                  Sign in to manage your projects, tasks, and deadlines.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-300">
                    Email
                  </label>
                  <input
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-white placeholder:text-gray-500 outline-none transition focus:border-blue-500"
                    type="email"
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-300">
                    Password
                  </label>
                  <input
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-white placeholder:text-gray-500 outline-none transition focus:border-blue-500"
                    type="password"
                    placeholder="Enter your password"
                    required
                  />
                </div>

                {error && (
                  <div className="rounded-lg border border-red-800 bg-red-950/50 px-4 py-3 text-sm text-red-300">
                    {error}
                  </div>
                )}

                <button
                  className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:from-blue-700 hover:to-indigo-700"
                  type="submit"
                >
                  Sign In
                </button>
              </form>
            </div>
          </div>
        </div>

        <ManagerScene />
      </div>

      <style jsx>{`
        .worker-float-a {
          animation: driftA 4.8s ease-in-out infinite;
        }
        .worker-float-b {
          animation: driftB 5.4s ease-in-out infinite;
        }
        .task-card-slide-a {
          animation: taskFlowA 5.2s ease-in-out infinite;
        }
        .task-card-slide-b {
          animation: taskFlowB 6s ease-in-out infinite;
        }
        .task-card-slide-c {
          animation: taskFlowC 5.6s ease-in-out infinite;
        }
        .manager-board-pulse {
          animation: boardPulse 4s ease-in-out infinite;
        }
        .manager-note-float {
          animation: noteFloat 4.8s ease-in-out infinite;
        }
        .worker-reply-pop {
          animation: replyPop 3.8s ease-in-out infinite;
        }
        .signal-dot-a {
          animation: signalPulse 1.8s ease-in-out infinite;
        }
        .signal-dot-b {
          animation: signalPulse 2.2s ease-in-out infinite 0.3s;
        }
        .signal-dot-c {
          animation: signalPulse 2s ease-in-out infinite 0.6s;
        }
        .flow-line {
          animation: lineGlow 2.8s ease-in-out infinite;
        }
        .card-float {
          animation: cardFloat 4.5s ease-in-out infinite;
        }
        .orbit {
          z-index: 20;
        }
        .orbit-one {
          animation: orbitOne 5s ease-in-out infinite;
        }
        .orbit-two {
          animation: orbitTwo 4.2s ease-in-out infinite;
        }
        .orbit-three {
          animation: orbitThree 5.8s ease-in-out infinite;
        }
        .pulse-ring {
          animation: ringPulse 2.6s ease-out infinite;
        }
        .pulse-ring-delayed {
          animation: ringPulse 2.6s ease-out infinite 1.1s;
        }

        @keyframes driftA {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-14px);
          }
        }

        @keyframes driftB {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(12px);
          }
        }

        @keyframes taskFlowA {
          0%,
          100% {
            transform: translateX(0px) translateY(0px);
            opacity: 0.9;
          }
          50% {
            transform: translateX(28px) translateY(12px);
            opacity: 1;
          }
        }

        @keyframes taskFlowB {
          0%,
          100% {
            transform: translateX(0px) translateY(0px);
            opacity: 0.85;
          }
          50% {
            transform: translateX(-24px) translateY(-10px);
            opacity: 1;
          }
        }

        @keyframes taskFlowC {
          0%,
          100% {
            transform: translateX(0px);
            opacity: 0.9;
          }
          50% {
            transform: translateX(34px);
            opacity: 1;
          }
        }

        @keyframes boardPulse {
          0%,
          100% {
            transform: scale(1);
            box-shadow: 0 0 0 rgba(59, 130, 246, 0);
          }
          50% {
            transform: scale(1.02);
            box-shadow: 0 14px 36px rgba(59, 130, 246, 0.14);
          }
        }

        @keyframes noteFloat {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes replyPop {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.08);
          }
        }

        @keyframes signalPulse {
          0%,
          100% {
            transform: scale(0.9);
            opacity: 0.35;
            box-shadow: 0 0 0 0 rgba(96, 165, 250, 0.1);
          }
          50% {
            transform: scale(1.5);
            opacity: 1;
            box-shadow: 0 0 0 12px rgba(96, 165, 250, 0);
          }
        }

        @keyframes lineGlow {
          0%,
          100% {
            opacity: 0.45;
            filter: drop-shadow(0 0 0 rgba(59, 130, 246, 0));
          }
          50% {
            opacity: 1;
            filter: drop-shadow(0 0 6px rgba(59, 130, 246, 0.55));
          }
        }

        @keyframes cardFloat {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        @keyframes orbitOne {
          0%,
          100% {
            transform: translate(0px, 0px) rotate(0deg);
          }
          50% {
            transform: translate(16px, -14px) rotate(8deg);
          }
        }

        @keyframes orbitTwo {
          0%,
          100% {
            transform: translate(0px, 0px) scale(1);
          }
          50% {
            transform: translate(-10px, 16px) scale(1.08);
          }
        }

        @keyframes orbitThree {
          0%,
          100% {
            transform: translate(0px, 0px);
          }
          50% {
            transform: translate(18px, -10px);
          }
        }

        @keyframes ringPulse {
          0% {
            opacity: 0.15;
            transform: scale(0.98);
          }
          70% {
            opacity: 0.5;
            transform: scale(1.03);
          }
          100% {
            opacity: 0;
            transform: scale(1.06);
          }
        }
      `}</style>
    </div>
  );
}
