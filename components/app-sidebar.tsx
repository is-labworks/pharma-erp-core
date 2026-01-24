"use client";

import type * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Package,
  CheckSquare,
  Building2,
  ClipboardList,
  FileCheck,
  Warehouse,
  Receipt,
  LayoutDashboard,
  Settings,
  Users,
  ChevronUp,
  LogOut,
  Pill,
  FlaskConical,
  AlertTriangle,
  BarChart3,
  CreditCard,
  History,
  FilePlus,
  Send,
  Scale,
  ShoppingCart,
  Truck,
  TestTube,
  BoxIcon,
  Calculator,
  FileSpreadsheet,
  Wallet,
  PieChart,
  Briefcase,
  Shield,
  Cog,
  Database,
  ListTodo,
  Activity,
  Home,
  FileText,
} from "lucide-react";
import type { UserRole } from "@/lib/types";
import { roleLabels } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const navigationByRole: Record<UserRole, NavGroup[]> = {
  requester: [
    {
      label: "Đề xuất mua hàng",
      items: [
        {
          title: "Tạo phiếu đề nghị",
          href: "/requester/create",
          icon: FilePlus,
        },
        {
          title: "Danh sách phiếu",
          href: "/requester/list",
          icon: ClipboardList,
        },
        { title: "Xem tồn kho", href: "/requester/inventory", icon: Package },
      ],
    },
  ],
  department_head: [
    {
      label: "Phê duyệt",
      items: [
        {
          title: "Chờ duyệt",
          href: "/department-head/pending",
          icon: CheckSquare,
        },
        {
          title: "Lịch sử duyệt",
          href: "/department-head/history",
          icon: History,
        },
      ],
    },
  ],
  procurement: [
    {
      label: "Mua hàng",
      items: [
        {
          title: "Nhu cầu đã duyệt",
          href: "/procurement/approved-requests",
          icon: FileCheck,
        },
        {
          title: "Nhà cung cấp",
          href: "/procurement/suppliers",
          icon: Building2,
        },
        {
          title: "Yêu cầu báo giá (RFQ)",
          href: "/procurement/rfq",
          icon: Send,
        },
        { title: "So sánh báo giá", href: "/procurement/compare", icon: Scale },
        {
          title: "Đơn mua hàng (PO)",
          href: "/procurement/orders",
          icon: ShoppingCart,
        },
      ],
    },
  ],
  procurement_manager: [
    {
      label: "Quản lý mua hàng",
      items: [
        {
          title: "Phê duyệt NCC",
          href: "/procurement-manager/supplier-approval",
          icon: Building2,
        },
        {
          title: "Phê duyệt PO",
          href: "/procurement-manager/po-approval",
          icon: FileCheck,
        },
        {
          title: "Dashboard ngân sách",
          href: "/procurement-manager/budget",
          icon: Wallet,
        },
        {
          title: "Kế hoạch mua sắm",
          href: "/procurement-manager/planning",
          icon: ListTodo,
        },
        {
          title: "Báo cáo",
          href: "/procurement-manager/reports",
          icon: BarChart3,
        },
      ],
    },
  ],
  qa_qc: [
    {
      label: "Kiểm soát chất lượng",
      items: [
        { title: "Lô hàng chờ kiểm", href: "/qa-qc/pending", icon: TestTube },
        { title: "Nhập kết quả", href: "/qa-qc/results", icon: FlaskConical },
        { title: "Lịch sử kiểm tra", href: "/qa-qc/history", icon: History },
        {
          title: "Cảnh báo chất lượng",
          href: "/qa-qc/alerts",
          icon: AlertTriangle,
        },
      ],
    },
  ],
  warehouse: [
    {
      label: "Quản lý kho",
      items: [
        { title: "Tồn kho", href: "/warehouse/inventory", icon: Warehouse },
        { title: "Tiếp nhận hàng", href: "/warehouse/receiving", icon: Truck },
        { title: "Quản lý lô hàng", href: "/warehouse/batches", icon: Package },
        {
          title: "Giao dịch kho",
          href: "/warehouse/stock-transactions",
          icon: FileSpreadsheet,
        },
        {
          title: "Bán thành phẩm",
          href: "/warehouse/semi-finished",
          icon: BoxIcon,
        },
        {
          title: "Thành phẩm",
          href: "/warehouse/finished-goods",
          icon: Package,
        },
        { title: "Xuất kho", href: "/warehouse/stock-out", icon: Truck },
        { title: "Cảnh báo", href: "/warehouse/alerts", icon: AlertTriangle },
      ],
    },
  ],
  accounting: [
    {
      label: "Kế toán",
      items: [
        {
          title: "PO hoàn thành",
          href: "/accounting/completed-pos",
          icon: FileCheck,
        },
        {
          title: "Đối chiếu chứng từ",
          href: "/accounting/reconciliation",
          icon: FileSpreadsheet,
        },
        { title: "Thanh toán", href: "/accounting/payments", icon: CreditCard },
        {
          title: "Công nợ NCC",
          href: "/accounting/payables",
          icon: Calculator,
        },
        {
          title: "Báo cáo chi phí",
          href: "/accounting/reports",
          icon: Receipt,
        },
      ],
    },
    {
      label: "Tính giá thành",
      items: [
        {
          title: "Lô sản xuất",
          href: "/costing/batches",
          icon: Calculator,
        },
        {
          title: "Báo cáo giá thành",
          href: "/costing/reports",
          icon: PieChart,
        },
        {
          title: "Cài đặt phân bổ",
          href: "/costing/settings",
          icon: Settings,
        },
      ],
    },
  ],
  director: [
    {
      label: "Ban Giám đốc",
      items: [
        {
          title: "Tổng quan",
          href: "/director/overview",
          icon: LayoutDashboard,
        },
        {
          title: "Chi phí mua hàng",
          href: "/director/expenses",
          icon: PieChart,
        },
        {
          title: "Tình trạng tồn kho",
          href: "/director/inventory",
          icon: Package,
        },
        {
          title: "NCC chiến lược",
          href: "/director/strategic-suppliers",
          icon: Briefcase,
        },
        {
          title: "Phê duyệt lớn",
          href: "/director/high-value-approvals",
          icon: Shield,
        },
        { title: "Báo cáo", href: "/director/reports", icon: BarChart3 },
      ],
    },
  ],
  production_planner: [
    {
      label: "Hoạch định Sản xuất",
      items: [
        {
          title: "Tổng quan",
          href: "/production/overview",
          icon: LayoutDashboard,
        },
        {
          title: "Đơn hàng",
          href: "/production/sales-orders",
          icon: ShoppingCart,
        },
        {
          title: "Hoạch định số lượng",
          href: "/production/quantity-planning",
          icon: Calculator,
        },
        {
          title: "Lịch dây chuyền",
          href: "/production/line-schedule",
          icon: Activity,
        },
        {
          title: "Phân bổ nguồn lực",
          href: "/production/resource-allocation",
          icon: Users,
        },
        {
          title: "Lịch sản xuất chi tiết",
          href: "/production/schedule",
          icon: ListTodo,
        },
      ],
    },
    {
      label: "Quản lý BOM",
      items: [
        {
          title: "Tổng quan BOM",
          href: "/bom/overview",
          icon: FileText,
        },
        {
          title: "Công thức sản xuất",
          href: "/bom/formulas",
          icon: FileText,
        },
        {
          title: "Quản lý phiên bản",
          href: "/bom/versions",
          icon: Activity,
        },
        {
          title: "Tính nhu cầu NVL",
          href: "/bom/requirements",
          icon: Calculator,
        },
      ],
    },
    {
      label: "Quản lý Bảo trì",
      items: [
        {
          title: "Danh sách thiết bị",
          href: "/maintenance/equipment",
          icon: Cog,
        },
        {
          title: "Kế hoạch bảo trì",
          href: "/maintenance/schedules",
          icon: ListTodo,
        },
        {
          title: "Lịch sử sửa chữa",
          href: "/maintenance/records",
          icon: History,
        },
        {
          title: "Cảnh báo bảo dưỡng",
          href: "/maintenance/alerts",
          icon: AlertTriangle,
        },
      ],
    },
  ],
  qa_qc: [
    {
      label: "Kiểm tra chất lượng",
      items: [
        {
          title: "Tổng quan",
          href: "/qa-qc/overview",
          icon: LayoutDashboard,
        },
        {
          title: "Nguyên liệu đầu vào",
          href: "/qa-qc/pending",
          icon: TestTube,
        },
        {
          title: "Kiểm tra công đoạn",
          href: "/qa-qc/in-process",
          icon: Activity,
        },
        {
          title: "Kiểm nghiệm thành phẩm",
          href: "/qa-qc/final-inspection",
          icon: Shield,
        },
        {
          title: "Hồ sơ lô hàng",
          href: "/qa-qc/batch-records",
          icon: FileText,
        },
        {
          title: "Lịch sử",
          href: "/qa-qc/history",
          icon: History,
        },
      ],
    },
  ],
  admin: [
    {
      label: "Quản trị hệ thống",
      items: [
        { title: "Người dùng & Phân quyền", href: "/admin/users", icon: Users },
        {
          title: "Quy trình phê duyệt",
          href: "/admin/workflows",
          icon: Activity,
        },
        {
          title: "Ngưỡng ngân sách",
          href: "/admin/budget-thresholds",
          icon: Wallet,
        },
        { title: "Danh mục vật tư", href: "/admin/materials", icon: Package },
        { title: "Nhật ký hệ thống", href: "/admin/audit-log", icon: Database },
        { title: "Cài đặt", href: "/admin/settings", icon: Cog },
      ],
    },
  ],
};

interface AppSidebarProps {
  role: UserRole;
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
  onRoleChange: (role: UserRole) => void;
  onLogout?: () => void;
}

export function AppSidebar({
  role,
  user,
  onRoleChange,
  onLogout,
}: AppSidebarProps) {
  const pathname = usePathname();
  const navGroups = navigationByRole[role];

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Pill className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold">PharmaPro</span>
            <span className="text-xs text-sidebar-foreground/70">
              Quản lý Mua hàng
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/"}>
                  <Link href="/">
                    <Home className="h-4 w-4" />
                    <span>Trang chủ</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {navGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.href}
                    >
                      <Link href={item.href}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="h-auto py-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={user.avatar || "/placeholder.svg"}
                      alt={user.name}
                    />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start text-left">
                    <span className="text-sm font-medium">{user.name}</span>
                    <span className="text-xs text-sidebar-foreground/70">
                      {roleLabels[role]}
                    </span>
                  </div>
                  <ChevronUp className="ml-auto h-4 w-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-(--radix-dropdown-menu-trigger-width)"
              >
                <DropdownMenuLabel>Chuyển vai trò</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {(Object.keys(roleLabels) as UserRole[]).map((r) => (
                  <DropdownMenuItem
                    key={r}
                    onClick={() => onRoleChange(r)}
                    className={cn(role === r && "bg-accent")}
                  >
                    {roleLabels[r]}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Cài đặt
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={onLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Đăng xuất
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
