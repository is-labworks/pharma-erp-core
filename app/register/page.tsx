"use client";

import * as React from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { roleLinks } from "@/lib/auth-context";
import { roleLabels } from "@/lib/mock-data";
import type { UserRole } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
} from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Pill, Shield, Eye, EyeOff, AlertCircle, Loader2, UserPlus, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

const departmentByRole: Record<UserRole, string[]> = {
  requester: ["Phòng Sản xuất", "Phòng Kinh doanh", "Phòng Marketing", "Phòng IT"],
  department_head: ["Phòng Sản xuất", "Phòng QA/QC", "Phòng Kinh doanh", "Phòng R&D"],
  procurement: ["Phòng Mua hàng"],
  procurement_manager: ["Phòng Mua hàng"],
  qa_qc: ["Phòng QA", "Phòng QC", "Phòng Kiểm nghiệm"],
  warehouse: ["Kho Nguyên liệu", "Kho Thành phẩm", "Kho GSP/GDP"],
  accounting: ["Phòng Kế toán – Tài chính"],
  director: ["Ban Giám đốc"],
  admin: ["Phòng IT – Quản trị Hệ thống"],
  production_planner: ["Phòng Kế hoạch Sản xuất"],
  sales_staff: ["Phòng Kinh doanh", "Kênh ETC", "Kênh OTC"],
  sales_manager: ["Phòng Kinh doanh"],
  hr_manager: ["Phòng Hành chính – Nhân sự"],
  hr_staff: ["Phòng Hành chính – Nhân sự"],
};

export default function RegisterPage() {
  const { register, isAuthenticated, user, isLoading } = useAuth();
  const router = useRouter();
  const [form, setForm] = React.useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "" as UserRole | "",
    department: "",
  });
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      router.push(roleLinks[user.role]);
    }
  }, [isAuthenticated, user, router, isLoading]);

  const departments = form.role ? departmentByRole[form.role] : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim()) { setError("Vui lòng nhập họ tên"); return; }
    if (!form.email.trim()) { setError("Vui lòng nhập email"); return; }
    if (!form.role) { setError("Vui lòng chọn vai trò"); return; }
    if (!form.department) { setError("Vui lòng chọn phòng ban"); return; }
    if (form.password.length < 6) { setError("Mật khẩu phải có ít nhất 6 ký tự"); return; }
    if (form.password !== form.confirmPassword) { setError("Mật khẩu xác nhận không khớp"); return; }

    setIsSubmitting(true);
    const result = await register(
      form.name.trim(),
      form.email.trim(),
      form.password,
      form.role,
      form.department
    );
    if (!result.success && result.error) {
      setError(result.error);
    }
    setIsSubmitting(false);
  };

  const set = (field: keyof typeof form) => (val: string) =>
    setForm((prev) => ({ ...prev, [field]: val, ...(field === "role" ? { department: "" } : {}) }));

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex flex-col">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white">
              <Pill className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-semibold">PharmaPro ERP</h1>
              <p className="text-xs text-muted-foreground">Hệ thống Quản lý Dược phẩm</p>
            </div>
          </div>
          <Badge variant="outline" className="gap-1.5">
            <Shield className="h-3 w-3" />
            GMP Compliant
          </Badge>
        </div>
      </header>

      {/* Main */}
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg space-y-6">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <UserPlus className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Tạo tài khoản</h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Đăng ký tài khoản với vai trò phù hợp trong hệ thống
            </p>
          </div>

          <Card className="shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Thông tin tài khoản</CardTitle>
              <CardDescription>Điền đầy đủ thông tin để tạo tài khoản mới</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Họ và tên <span className="text-red-500">*</span></Label>
                  <Input
                    id="name"
                    placeholder="Nguyễn Văn A"
                    value={form.name}
                    onChange={(e) => set("name")(e.target.value)}
                    disabled={isSubmitting}
                    required
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@pharma.vn"
                    value={form.email}
                    onChange={(e) => set("email")(e.target.value)}
                    disabled={isSubmitting}
                    autoComplete="email"
                    required
                  />
                </div>

                {/* Role */}
                <div className="space-y-2">
                  <Label>Vai trò <span className="text-red-500">*</span></Label>
                  <Select value={form.role} onValueChange={set("role")} disabled={isSubmitting}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn vai trò trong hệ thống" />
                    </SelectTrigger>
                    <SelectContent>
                      {(Object.entries(roleLabels) as [UserRole, string][]).map(([r, label]) => (
                        <SelectItem key={r} value={r}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.role && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <CheckCircle2 className="h-3 w-3 text-green-500" />
                      Sau khi đăng nhập, sidebar sẽ hiển thị đúng chức năng của vai trò này
                    </p>
                  )}
                </div>

                {/* Department */}
                <div className="space-y-2">
                  <Label>Phòng ban <span className="text-red-500">*</span></Label>
                  <Select
                    value={form.department}
                    onValueChange={set("department")}
                    disabled={!form.role || isSubmitting}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={form.role ? "Chọn phòng ban" : "Chọn vai trò trước"} />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((d) => (
                        <SelectItem key={d} value={d}>{d}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password">Mật khẩu <span className="text-red-500">*</span></Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Tối thiểu 6 ký tự"
                      value={form.password}
                      onChange={(e) => set("password")(e.target.value)}
                      disabled={isSubmitting}
                      autoComplete="new-password"
                      required
                      className="pr-10"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {form.password.length > 0 && form.password.length < 6 && (
                    <p className="text-xs text-red-500">Mật khẩu quá ngắn</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirm">Xác nhận mật khẩu <span className="text-red-500">*</span></Label>
                  <div className="relative">
                    <Input
                      id="confirm"
                      type={showConfirm ? "text" : "password"}
                      placeholder="Nhập lại mật khẩu"
                      value={form.confirmPassword}
                      onChange={(e) => set("confirmPassword")(e.target.value)}
                      disabled={isSubmitting}
                      required
                      className={`pr-10 ${form.confirmPassword && form.password !== form.confirmPassword ? "border-red-400" : form.confirmPassword && form.password === form.confirmPassword ? "border-green-400" : ""}`}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowConfirm(!showConfirm)}
                    >
                      {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {form.confirmPassword && form.password !== form.confirmPassword && (
                    <p className="text-xs text-red-500">Mật khẩu không khớp</p>
                  )}
                  {form.confirmPassword && form.password === form.confirmPassword && form.password.length >= 6 && (
                    <p className="text-xs text-green-600 flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />Mật khẩu khớp
                    </p>
                  )}
                </div>

                <Button type="submit" className="w-full gap-2 mt-2" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Đang tạo tài khoản...
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4" />
                      Tạo tài khoản & Đăng nhập
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="border-t pt-5">
              <p className="text-sm text-center text-muted-foreground w-full">
                Đã có tài khoản?{" "}
                <Link href="/login" className="text-primary font-medium hover:underline">
                  Đăng nhập
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </main>

      <footer className="border-t bg-white/60 py-4 text-center text-xs text-muted-foreground">
        © 2026 PharmaPro – Tuân thủ tiêu chuẩn GMP/GDP/GSP
      </footer>
    </div>
  );
}
