"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuth, roleLinks } from "@/lib/auth-context";
import type { UserRole } from "@/lib/types";
import { users, roleLabels } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Pill,
  LogIn,
  Users,
  FilePlus,
  CheckSquare,
  Building2,
  TestTube,
  Warehouse,
  Receipt,
  LayoutDashboard,
  Settings,
  AlertCircle,
  Shield,
  Factory,
  User,
  UserCog,
} from "lucide-react";

const roleIcons: Record<UserRole, React.ElementType> = {
  requester: FilePlus,
  department_head: CheckSquare,
  procurement: Building2,
  procurement_manager: LayoutDashboard,
  qa_qc: TestTube,
  warehouse: Warehouse,
  accounting: Receipt,
  director: LayoutDashboard,
  admin: Settings,
  production_planner: Factory,
  sales_staff: User,
  sales_manager: UserCog,
};

const roleColors: Record<UserRole, string> = {
  requester: "bg-blue-500/10 text-blue-600 border-blue-200",
  department_head: "bg-purple-500/10 text-purple-600 border-purple-200",
  procurement: "bg-green-500/10 text-green-600 border-green-200",
  procurement_manager: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
  qa_qc: "bg-orange-500/10 text-orange-600 border-orange-200",
  warehouse: "bg-amber-500/10 text-amber-600 border-amber-200",
  accounting: "bg-cyan-500/10 text-cyan-600 border-cyan-200",
  director: "bg-rose-500/10 text-rose-600 border-rose-200",
  admin: "bg-slate-500/10 text-slate-600 border-slate-200",
  production_planner: "bg-indigo-500/10 text-indigo-600 border-indigo-200",
  sales_staff: "bg-teal-500/10 text-teal-600 border-teal-200",
  sales_manager: "bg-violet-500/10 text-violet-600 border-violet-200",
};

export default function LoginPage() {
  const { login, loginAsRole, isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated && user) {
      router.push(roleLinks[user.role]);
    }
  }, [isAuthenticated, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const result = await login(email, password);
    if (!result.success && result.error) {
      setError(result.error);
    }
    setIsLoading(false);
  };

  const handleQuickLogin = (role: UserRole) => {
    loginAsRole(role);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white">
              <Pill className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-semibold">PharmaPro</h1>
              <p className="text-xs text-muted-foreground">
                Hệ thống Quản lý Mua hàng
              </p>
            </div>
          </div>
          <Badge variant="outline" className="gap-1.5">
            <Shield className="h-3 w-3" />
            GMP Compliant
          </Badge>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-4 py-12">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            Đăng nhập hệ thống
          </h2>
          <p className="mt-2 text-muted-foreground">
            Chọn phương thức đăng nhập hoặc đăng nhập nhanh theo vai trò
          </p>
        </div>

        <Tabs defaultValue="quick" className="mx-auto max-w-4xl">
          <TabsList className="mx-auto mb-8 grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="quick" className="gap-2">
              <Users className="h-4 w-4" />
              Đăng nhập nhanh
            </TabsTrigger>
            <TabsTrigger value="credentials" className="gap-2">
              <LogIn className="h-4 w-4" />
              Email & Mật khẩu
            </TabsTrigger>
          </TabsList>

          {/* Quick Login Tab */}
          <TabsContent value="quick">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {users.map((u) => {
                const Icon = roleIcons[u.role];
                return (
                  <Card
                    key={u.id}
                    className="group cursor-pointer transition-all hover:shadow-lg hover:ring-2 hover:ring-primary/20"
                    onClick={() => handleQuickLogin(u.role)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <Avatar className="h-12 w-12 ring-2 ring-background">
                          <AvatarImage
                            src={
                              u.avatar || "/placeholder.svg?height=48&width=48"
                            }
                          />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {u.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <Badge variant="outline" className={roleColors[u.role]}>
                          <Icon className="mr-1 h-3 w-3" />
                          {roleLabels[u.role]}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardTitle className="text-base">{u.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {u.email}
                      </CardDescription>
                      <p className="mt-2 text-xs text-muted-foreground">
                        Bộ phận: {u.department}
                      </p>
                      <Button
                        variant="secondary"
                        className="mt-4 w-full opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        Đăng nhập
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Credentials Login Tab */}
          <TabsContent value="credentials">
            <Card className="mx-auto max-w-md">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <LogIn className="h-7 w-7 text-primary" />
                </div>
                <CardTitle>Đăng nhập bằng tài khoản</CardTitle>
                <CardDescription>
                  Nhập email và mật khẩu được cấp bởi quản trị viên
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="example@pharma.vn"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Mật khẩu</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
                  </Button>
                </form>

                <div className="mt-6 border-t pt-4">
                  <p className="text-center text-sm text-muted-foreground">
                    Demo: Sử dụng email từ danh sách nhân viên
                  </p>
                  <p className="mt-1 text-center text-xs text-muted-foreground">
                    Mật khẩu: bất kỳ (tối thiểu 4 ký tự)
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white/80 py-6 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © 2026 PharmaPro - Công ty Dược phẩm. Tuân thủ tiêu chuẩn GMP.
          </p>
        </div>
      </footer>
    </div>
  );
}
