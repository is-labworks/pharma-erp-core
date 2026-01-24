"use client";
import { DashboardLayout } from "@/components/dashboard-layout";
import { PageHeader } from "@/components/page-header";
import { KpiCard } from "@/components/kpi-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  salesOrders,
  productionPlans,
  productionCapacities,
  productionLines,
  productionLineSchedules,
} from "@/lib/mock-data";
import {
  Factory,
  ClipboardList,
  TrendingUp,
  AlertTriangle,
  Clock,
  ArrowRight,
  Calendar,
} from "lucide-react";
import Link from "next/link";

export default function ProductionOverviewPage() {
  const pendingOrders = salesOrders.filter(
    (so) => so.status === "pending",
  ).length;
  const activeProductionPlans = productionPlans.filter(
    (pp) => pp.status === "approved" || pp.status === "in_progress",
  ).length;

  const totalCapacityUtilization =
    productionCapacities.reduce((sum, pc) => sum + pc.currentUtilization, 0) /
    productionCapacities.length;

  const todaySchedules = productionLineSchedules.filter(
    (s) => s.date === "2026-01-27" || s.date === "2026-01-28",
  ).length;

  const maintenanceLines = productionLines.filter(
    (line) => line.status === "maintenance",
  ).length;

  return (
    <DashboardLayout
      role="production_planner"
      breadcrumbs={[{ label: "Tổng quan" }]}
    >
      <div className="space-y-6">
        <PageHeader
          title="Dashboard Hoạch định Sản xuất"
          description="Tổng quan hoạt động sản xuất và các chỉ số quan trọng"
        />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            title="Đơn hàng chờ xử lý"
            value={pendingOrders}
            icon={ClipboardList}
            description="Đơn hàng cần lập kế hoạch"
            trend={pendingOrders > 2 ? "up" : "down"}
            trendValue={pendingOrders > 2 ? "Cần xử lý" : "Bình thường"}
          />
          <KpiCard
            title="Kế hoạch đang chạy"
            value={activeProductionPlans}
            icon={Calendar}
            description="Kế hoạch sản xuất đang thực hiện"
            trend="neutral"
            trendValue="Đang sản xuất"
          />
          <KpiCard
            title="Tỷ lệ sử dụng công suất"
            value={`${totalCapacityUtilization.toFixed(0)}%`}
            icon={TrendingUp}
            description="Trung bình các dây chuyền"
            trend={totalCapacityUtilization > 75 ? "up" : "down"}
            trendValue={totalCapacityUtilization > 75 ? "Cao" : "Cần cải thiện"}
          />
          <KpiCard
            title="Cảnh báo"
            value={maintenanceLines}
            icon={AlertTriangle}
            description="Dây chuyền đang bảo trì"
            trend={maintenanceLines > 0 ? "up" : "down"}
            trendValue={maintenanceLines > 0 ? "Cần chú ý" : "Hoạt động tốt"}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Đơn hàng cần lập kế hoạch</CardTitle>
              <CardDescription>
                Đơn hàng từ phòng Kế hoạch - Kinh doanh
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {salesOrders
                  .filter((so) => so.status === "pending")
                  .map((so) => (
                    <div
                      key={so.id}
                      className="flex items-center justify-between rounded-lg border p-4"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{so.code}</span>
                          <Badge
                            variant={
                              so.priority === "urgent"
                                ? "destructive"
                                : "outline"
                            }
                          >
                            {so.priority === "urgent"
                              ? "Khẩn cấp"
                              : so.priority === "high"
                                ? "Cao"
                                : so.priority === "medium"
                                  ? "Trung bình"
                                  : "Thấp"}
                          </Badge>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {so.customerName}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          <Clock className="mr-1 inline h-3 w-3" />
                          Yêu cầu:{" "}
                          {new Date(so.requiredDate).toLocaleDateString(
                            "vi-VN",
                          )}
                        </p>
                      </div>
                      <Link href="/production/sales-orders">
                        <Button size="sm">
                          Xem chi tiết
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  ))}
                {salesOrders.filter((so) => so.status === "pending").length ===
                  0 && (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <ClipboardList className="h-12 w-12 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      Không có đơn hàng nào chờ xử lý
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tình trạng dây chuyền sản xuất</CardTitle>
              <CardDescription>
                Trạng thái và công suất các dây chuyền
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {productionCapacities.slice(0, 5).map((capacity) => {
                  const line = productionLines.find(
                    (l) => l.id === capacity.productionLineId,
                  );
                  return (
                    <div key={capacity.productionLineId} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">
                            {capacity.productionLineName}
                          </span>
                          <Badge
                            variant={
                              line?.status === "active"
                                ? "default"
                                : line?.status === "maintenance"
                                  ? "secondary"
                                  : "outline"
                            }
                            className="text-xs"
                          >
                            {line?.status === "active"
                              ? "Hoạt động"
                              : line?.status === "maintenance"
                                ? "Bảo trì"
                                : "Không hoạt động"}
                          </Badge>
                        </div>
                        <span className="text-sm font-bold">
                          {capacity.currentUtilization}%
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-muted">
                        <div
                          className={`h-2 rounded-full ${
                            capacity.currentUtilization > 80
                              ? "bg-red-500"
                              : capacity.currentUtilization > 60
                                ? "bg-green-500"
                                : "bg-yellow-500"
                          }`}
                          style={{ width: `${capacity.currentUtilization}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lịch sản xuất hôm nay</CardTitle>
            <CardDescription>
              Các ca sản xuất đang và sẽ diễn ra
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {productionLineSchedules.slice(0, 4).map((schedule) => (
                <div
                  key={schedule.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {schedule.medicineName}
                      </span>
                      <Badge variant="outline">
                        {schedule.shift === "morning"
                          ? "Ca sáng"
                          : schedule.shift === "afternoon"
                            ? "Ca chiều"
                            : "Ca đêm"}
                      </Badge>
                      <Badge
                        variant={
                          schedule.status === "in_progress"
                            ? "default"
                            : schedule.status === "approved"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {schedule.status === "in_progress"
                          ? "Đang sản xuất"
                          : "Đã lên lịch"}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {schedule.productionLineName}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Số lượng: {schedule.quantity.toLocaleString("vi-VN")} viên
                      • Nhân công: {schedule.assignedWorkers} người
                    </p>
                  </div>
                  <Link href="/production/schedule">
                    <Button size="sm" variant="outline">
                      Xem lịch
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
