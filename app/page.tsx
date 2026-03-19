"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { roleLinks } from "@/lib/auth-context";
import { Loader2 } from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  React.useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated || !user) {
      router.push("/login");
    } else {
      router.push(roleLinks[user.role]);
    }
  }, [isAuthenticated, user, isLoading, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}
