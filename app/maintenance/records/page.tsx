"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { PageHeader } from "@/components/page-header";
import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { maintenanceRecords } from "@/lib/maintenance-mock-data";
import type { MaintenanceRecord } from "@/lib/maintenance-types";
import { History } from "lucide-react";

export default function MaintenanceRecordsPage() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const columns = [
    {
      key: "code",
      header: "Mã phiếu",
      cell: (item: MaintenanceRecord) => (
        <span className="font-medium text-primary">{item.code}</span>
      ),
      searchable: true,
    },
    {
      key: "equipmentName",
      header: "Thiết bị",
      cell: (item: MaintenanceRecord) => (
        <div>
          <p className="font-medium">{item.equipmentName}</p>
          <p className="text-xs text-muted-foreground">{item.equipmentCode}</p>
        </div>
      ),
      searchable: true,
    },
    {
      key: "type",
      header: "Loại",
      cell: (item: MaintenanceRecord) => {
        const typeLabels = {
          preventive: "Định kỳ",
          corrective: "Sửa chữa",
          calibration: "Hiệu chuẩn",
        };
        return <Badge variant="outline">{typeLabels[item.type]}</Badge>;
      },
    },
    {
      key: "scheduledDate",
      header: "Ngày thực hiện",
      cell: (item: MaintenanceRecord) =>
        new Date(item.scheduledDate).toLocaleDateString("vi-VN"),
    },
    {
      key: "assignedTo",
      header: "Người thực hiện",
      cell: (item: MaintenanceRecord) => item.assignedTo,
    },
    {
      key: "laborHours",
      header: "Giờ công",
      cell: (item: MaintenanceRecord) => `${item.laborHours}h`,
    },
    {
      key: "cost",
      header: "Chi phí",
      cell: (item: MaintenanceRecord) => (
        <span className="font-medium">{formatCurrency(item.cost)}</span>
      ),
    },
    {
      key: "status",
      header: "Trạng thái",
      cell: (item: MaintenanceRecord) => {
        const statusConfig = {
          scheduled: { label: "Đã lên lịch", variant: "secondary" as const },
          in_progress: { label: "Đang thực hiện", variant: "default" as const },
          completed: { label: "Hoàn thành", variant: "default" as const },
          cancelled: { label: "Đã hủy", variant: "outline" as const },
        };
        const config = statusConfig[item.status];
        return (
          <Badge
            variant={config.variant}
            className={item.status === "completed" ? "bg-green-500" : ""}
          >
            {config.label}
          </Badge>
        );
      },
    },
  ];

  return (
    <DashboardLayout
      role="production_planner"
      breadcrumbs={[{ label: "Lịch sử bảo trì" }]}
    >
      <div className="space-y-6">
        <PageHeader
          title="Lịch sử Bảo trì & Sửa chữa"
          description="Theo dõi tất cả hoạt động bảo trì thiết bị"
        />

        <DataTable
          data={maintenanceRecords}
          columns={columns}
          searchPlaceholder="Tìm kiếm theo mã phiếu, thiết bị..."
        />
      </div>
    </DashboardLayout>
  );
}
