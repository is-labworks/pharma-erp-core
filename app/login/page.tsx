"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { roleLinks } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Pill, LogIn, Shield, Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";

export default function LoginPage() {
  const { login, isAuthenticated, user, isLoading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState("");

  // Redirect if already authenticated
  React.useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      router.push(roleLinks[user.role]);
    }
  }, [isAuthenticated, user, router, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Vui lòng nhập email");
      return;
    }
    if (!password) {
      setError("Vui lòng nhập mật khẩu");
      return;
    }

    setIsSubmitting(true);
    const result = await login(email.trim(), password);
    if (!result.success && result.error) {
      setError(result.error);
    }
    setIsSubmitting(false);
  };

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
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <LogIn className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Đăng nhập</h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Nhập email và mật khẩu của bạn để truy cập hệ thống
            </p>
          </div>

          <Card className="shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Thông tin tài khoản</CardTitle>
              <CardDescription>
                Sử dụng email đã được cấp hoặc đăng ký
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
                  <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@pharma.vn"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    disabled={isSubmitting}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Mật khẩu <span className="text-red-500">*</span></Label>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                      disabled={isSubmitting}
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
                </div>

                <Button type="submit" className="w-full gap-2" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Đang đăng nhập...
                    </>
                  ) : (
                    <>
                      <LogIn className="h-4 w-4" />
                      Đăng nhập
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col gap-3 border-t pt-5">
              <p className="text-sm text-center text-muted-foreground">
                Chưa có tài khoản?{" "}
                <Link href="/register" className="text-primary font-medium hover:underline">
                  Đăng ký ngay
                </Link>
              </p>
              <div className="w-full rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
                <p className="font-medium mb-2 text-foreground">Tài khoản demo (Mật khẩu: bất kỳ ≥6 ký tự):</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-2 gap-y-1.5 h-48 overflow-y-auto pr-1">
                  <div className="flex flex-col"><span className="font-medium">Người yêu cầu / SX</span><span>an.nguyen@pharma.vn</span></div>
                  <div className="flex flex-col"><span className="font-medium">Trưởng bộ phận</span><span>binh.tran@pharma.vn</span></div>
                  <div className="flex flex-col"><span className="font-medium">Nhân viên Mua hàng</span><span>cuong.le@pharma.vn</span></div>
                  <div className="flex flex-col"><span className="font-medium">Trưởng phòng Mua hàng</span><span>dung.pham@pharma.vn</span></div>
                  <div className="flex flex-col"><span className="font-medium">QA / QC</span><span>em.hoang@pharma.vn</span></div>
                  <div className="flex flex-col"><span className="font-medium">Thủ kho (GSP/GDP)</span><span>phuong.vu@pharma.vn</span></div>
                  <div className="flex flex-col"><span className="font-medium">Kế toán</span><span>giang.dang@pharma.vn</span></div>
                  <div className="flex flex-col"><span className="font-medium">Ban Giám đốc</span><span>huong.ngo@pharma.vn</span></div>
                  <div className="flex flex-col"><span className="font-medium">Quản trị Hệ thống (IT)</span><span>inh.bui@pharma.vn</span></div>
                  <div className="flex flex-col"><span className="font-medium">Kế hoạch Sản xuất</span><span>kim.vo@pharma.vn</span></div>
                  <div className="flex flex-col"><span className="font-medium">Nhân viên Kinh doanh</span><span>lan.nguyen@pharma.vn</span></div>
                  <div className="flex flex-col"><span className="font-medium">Trưởng phòng KD</span><span>mai.le@pharma.vn</span></div>
                  <div className="flex flex-col"><span className="font-medium">Trưởng phòng Nhân sự</span><span>nhung.nguyen@pharma.vn</span></div>
                  <div className="flex flex-col"><span className="font-medium">Nhân viên Nhân sự</span><span>khoa.vo@pharma.vn</span></div>
                </div>
              </div>
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
