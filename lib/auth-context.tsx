"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import type { UserRole, User } from "./types";
import { users } from "./mock-data";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string }>;
  loginAsRole: (role: UserRole) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

const roleLinks: Record<UserRole, string> = {
  requester: "/requester/list",
  department_head: "/department-head/pending",
  procurement: "/procurement/approved-requests",
  procurement_manager: "/procurement/orders", // Fixed missing route - use existing procurement orders page
  qa_qc: "/qa-qc/pending",
  warehouse: "/warehouse/inventory",
  accounting: "/accounting/completed-pos",
  director: "/director/overview",
  admin: "/admin/users",
  production_planner: "/production/overview",
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const router = useRouter();

  // Check for existing session on mount
  React.useEffect(() => {
    const storedUser = localStorage.getItem("pharma_user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch {
        localStorage.removeItem("pharma_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (
    email: string,
    password: string,
  ): Promise<{ success: boolean; error?: string }> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Find user by email (mock validation)
    const foundUser = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase(),
    );

    if (!foundUser) {
      return { success: false, error: "Email không tồn tại trong hệ thống" };
    }

    // Mock password check (in real app, this would be server-side)
    if (password.length < 4) {
      return { success: false, error: "Mật khẩu không đúng" };
    }

    setUser(foundUser);
    setIsAuthenticated(true);
    localStorage.setItem("pharma_user", JSON.stringify(foundUser));

    // Redirect to role-specific page
    router.push(roleLinks[foundUser.role]);
    return { success: true };
  };

  const loginAsRole = (role: UserRole) => {
    const foundUser = users.find((u) => u.role === role);
    if (foundUser) {
      setUser(foundUser);
      setIsAuthenticated(true);
      localStorage.setItem("pharma_user", JSON.stringify(foundUser));
      router.push(roleLinks[role]);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("pharma_user");
    router.push("/login");
  };

  const switchRole = (newRole: UserRole) => {
    const foundUser = users.find((u) => u.role === newRole);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem("pharma_user", JSON.stringify(foundUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        loginAsRole,
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export { roleLinks };
