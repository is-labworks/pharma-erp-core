"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuth, roleLinks } from "@/lib/auth-context";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import type { UserRole } from "@/lib/types";
import { roleLabels } from "@/lib/mock-data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FilePlus,
  CheckSquare,
  Building2,
  TestTube,
  Warehouse,
  Receipt,
  LayoutDashboard,
  Settings,
  ArrowRight,
  Loader2,
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

const roleDescriptions: Record<UserRole, string> = {
  requester: "Tạo và quản lý phiếu đề nghị mua hàng",
  department_head: "Phê duyệt các yêu cầu mua hàng từ nhân viên",
  procurement: "Quản lý nhà cung cấp, RFQ và đơn mua hàng",
  procurement_manager: "Kiểm soát ngân sách và phê duyệt PO",
  qa_qc: "Kiểm tra chất lượng nguyên liệu nhập kho",
  warehouse: "Tiếp nhận và quản lý tồn kho",
  accounting: "Đối chiếu chứng từ và thanh toán",
  director: "Giám sát tổng quan hoạt động mua sắm",
  admin: "Quản lý người dùng và cấu hình hệ thống",
  production_planner: "Lập kế hoạch sản xuất và phân bổ nguồn lực",
  sales_staff: "Quản lý đơn hàng và chăm sóc khách hàng",
  sales_manager: "Giám sát hoạt động kinh doanh và phê duyệt đơn hàng",
};

export default function HomePage() {
  const router = useRouter();
  const { user, isAuthenticated, switchRole, logout } = useAuth();
  const [role, setRole] = React.useState<UserRole>("requester");
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      if (!isAuthenticated) {
        router.push("/login");
      } else if (user) {
        setRole(user.role);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isAuthenticated, user, router]);

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    switchRole(newRole);
  };

  const handleNavigate = (targetRole: UserRole) => {
    setRole(targetRole);
    switchRole(targetRole);
    router.push(roleLinks[targetRole]);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-2 text-sm text-muted-foreground">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <SidebarProvider>
      <AppSidebar
        role={role}
        user={{
          name: user.name,
          email: user.email,
          avatar: user.avatar,
        }}
        onRoleChange={handleRoleChange}
        onLogout={logout}
      />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Trang chủ</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <main className="flex-1 p-6">
          <div className="mx-auto max-w-6xl space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold tracking-tight">
                Hệ thống Quản lý Mua hàng
              </h1>
              <p className="text-muted-foreground mt-2">
                Công ty Dược phẩm PharmaPro - Tuân thủ GMP
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {(Object.keys(roleLabels) as UserRole[]).map((r) => {
                const Icon = roleIcons[r];
                return (
                  <Card
                    key={r}
                    className="group cursor-pointer transition-all hover:shadow-lg"
                    onClick={() => handleNavigate(r)}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Icon className="h-6 w-6" />
                        </div>
                        <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                      </div>
                      <CardTitle className="mt-4">{roleLabels[r]}</CardTitle>
                      <CardDescription>{roleDescriptions[r]}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="secondary" className="w-full">
                        Truy cập
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
