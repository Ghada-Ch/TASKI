"use client";
import { useSession, signIn } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login"); // redirect to login if not authenticated
    }
  }, [status, router]);

  if (status === "loading") {
    return <div className="text-white p-6">Loading...</div>; // or a spinner
  }

  if (status === "authenticated") {
    return <>{children}</>;
  }

  return null; // during redirect
}
