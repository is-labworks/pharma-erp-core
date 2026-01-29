"use client";
import { DashboardLayout } from "@/components/dashboard-layout";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  ShoppingCart,
  FileText,
  DollarSign,
  TrendingUp,
  AlertCircle,
  Package,
  UserCheck,
} from "lucide-react";
import Link from "next/link";
import { customers, salesOrdersExtended } from "@/lib/sales-mock-data";

export default function SalesPage() {
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter((c) => c.status === "active").length;
  const pendingOrders = salesOrdersExtended.filter(
    (o) => o.status === "pending_approval",
  ).length;
  const approvedOrders = salesOrdersExtended.filter(
    (o) => o.status === "approved",
  ).length;

  const totalRevenue = salesOrdersExtended.reduce(
    (sum, order) => sum + order.totalAmount,
    0,
  );

  const debtWarnings = customers.filter(
    (c) => c.debtStatus === "warning" || c.debtStatus === "overdue",
  ).length;

  return (
    <DashboardLayout
      role="sales_staff"
      breadcrumbs={[{ label: "Tổng quan Kinh doanh" }]}
    >
      <div className="space-y-6">
        <PageHeader
          title="Quản lý Kinh doanh"
          description="Tổng quan hệ thống bán hàng và quản lý khách hàng"
        />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Tổng khách hàng
                </p>
                <h3 className="text-2xl font-bold">{totalCustomers}</h3>
                <p className="text-xs text-green-600 mt-1">
                  {activeCustomers} đang hoạt động
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Đơn hàng chờ duyệt
                </p>
                <h3 className="text-2xl font-bold">{pendingOrders}</h3>
                <p className="text-xs text-orange-600 mt-1">Cần xử lý</p>
              </div>
              <AlertCircle className="h-8 w-8 text-orange-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Đơn đã phê duyệt
                </p>
                <h3 className="text-2xl font-bold">{approvedOrders}</h3>
                <p className="text-xs text-green-600 mt-1">Sẵn sàng xử lý</p>
              </div>
              <UserCheck className="h-8 w-8 text-green-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Doanh thu
                </p>
                <h3 className="text-2xl font-bold">
                  {(totalRevenue / 1000000).toFixed(0)}tr
                </h3>
                <p className="text-xs text-green-600 mt-1">Tháng này</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </Card>
        </div>

        {debtWarnings > 0 && (
          <Card className="p-6 border-orange-200 bg-orange-50 dark:bg-orange-950">
            <div className="flex items-start gap-4">
              <AlertCircle className="h-6 w-6 text-orange-600 mt-1" />
              <div className="flex-1">
                <h3 className="font-semibold text-orange-900 dark:text-orange-100">
                  Cảnh báo công nợ
                </h3>
                <p className="text-sm text-orange-800 dark:text-orange-200 mt-1">
                  Có {debtWarnings} khách hàng đang có cảnh báo về công nợ. Kiểm
                  tra danh sách để xem chi tiết.
                </p>
                <Link href="/sales/debt">
                  <Button variant="outline" size="sm" className="mt-3">
                    Xem chi tiết
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        )}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Link href="/sales/customers">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900">
                  <Users className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                </div>
                <div>
                  <h3 className="font-semibold">Quản lý Khách hàng</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Thêm, chỉnh sửa và quản lý thông tin khách hàng
                  </p>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/sales/products">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900">
                  <Package className="h-6 w-6 text-green-600 dark:text-green-300" />
                </div>
                <div>
                  <h3 className="font-semibold">Danh mục Sản phẩm</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Tra cứu sản phẩm, giá và tồn kho
                  </p>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/sales/orders">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900">
                  <ShoppingCart className="h-6 w-6 text-purple-600 dark:text-purple-300" />
                </div>
                <div>
                  <h3 className="font-semibold">Đơn hàng</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Lập và quản lý đơn hàng bán
                  </p>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/sales/approval">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-orange-100 dark:bg-orange-900">
                  <UserCheck className="h-6 w-6 text-orange-600 dark:text-orange-300" />
                </div>
                <div>
                  <h3 className="font-semibold">Phê duyệt Đơn hàng</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Duyệt và kiểm tra đơn hàng
                  </p>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/sales/invoices">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-yellow-100 dark:bg-yellow-900">
                  <FileText className="h-6 w-6 text-yellow-600 dark:text-yellow-300" />
                </div>
                <div>
                  <h3 className="font-semibold">Hóa đơn & Thanh toán</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Quản lý hóa đơn và thu tiền
                  </p>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/sales/reports">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-cyan-100 dark:bg-cyan-900">
                  <TrendingUp className="h-6 w-6 text-cyan-600 dark:text-cyan-300" />
                </div>
                <div>
                  <h3 className="font-semibold">Báo cáo & Thống kê</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Phân tích doanh số và hiệu quả
                  </p>
                </div>
              </div>
            </Card>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
