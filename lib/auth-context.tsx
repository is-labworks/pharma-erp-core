"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import type { UserRole, User } from "./types";
import { users } from "./mock-data";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (
    name: string,
    email: string,
    password: string,
    role: UserRole,
    department: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export const roleLinks: Record<UserRole, string> = {
  requester: "/requester/list",
  department_head: "/department-head/pending",
  procurement: "/procurement/approved-requests",
  procurement_manager: "/procurement/orders",
  qa_qc: "/qa-qc/pending",
  warehouse: "/warehouse/inventory",
  accounting: "/accounting/completed-pos",
  director: "/director/overview",
  admin: "/admin/users",
  production_planner: "/production/overview",
  sales_staff: "/sales/orders",
  sales_manager: "/sales/dashboard",
  hr_manager: "/hr",
  hr_staff: "/hr/candidates",
  payroll_accountant: "/payroll",
};

// In-memory store for registered users (extends mock data at runtime)
let registeredUsers: User[] = [];

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
    // Load any registered users from localStorage
    const storedRegistered = localStorage.getItem("pharma_registered_users");
    if (storedRegistered) {
      try {
        registeredUsers = JSON.parse(storedRegistered);
      } catch {}
    }
    setIsLoading(false);
  }, []);

  const getAllUsers = () => [...users, ...registeredUsers];

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const foundUser = getAllUsers().find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (!foundUser) {
      return { success: false, error: "Email không tồn tại trong hệ thống" };
    }

    if (password.length < 6) {
      return { success: false, error: "Mật khẩu phải có ít nhất 6 ký tự" };
    }

    // For registered users, check stored password hash
    const registeredUser = registeredUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
    if (registeredUser && (registeredUser as any).passwordHash !== password) {
      return { success: false, error: "Mật khẩu không đúng" };
    }

    setUser(foundUser);
    setIsAuthenticated(true);
    localStorage.setItem("pharma_user", JSON.stringify(foundUser));
    router.push(roleLinks[foundUser.role]);
    return { success: true };
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    role: UserRole,
    department: string
  ): Promise<{ success: boolean; error?: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 600));

    const allUsers = getAllUsers();
    if (allUsers.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, error: "Email này đã được đăng ký" };
    }

    if (password.length < 6) {
      return { success: false, error: "Mật khẩu phải có ít nhất 6 ký tự" };
    }

    const newUser: User & { passwordHash?: string } = {
      id: `user-reg-${Date.now()}`,
      name,
      email,
      role,
      department,
      passwordHash: password, // In production, hash this server-side
    };

    registeredUsers = [...registeredUsers, newUser];
    localStorage.setItem("pharma_registered_users", JSON.stringify(registeredUsers));

    // Auto-login after registration
    setUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem("pharma_user", JSON.stringify(newUser));
    router.push(roleLinks[role]);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("pharma_user");
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
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
