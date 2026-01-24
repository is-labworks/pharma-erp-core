"use client";
import { DashboardLayout } from "@/components/dashboard-layout";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { productionBatches } from "@/lib/warehouse-mock-data";
import {
  Package,
  Calendar,
  AlertTriangle,
  TrendingUp,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function FinishedGoodsPage() {
  const finishedBatches = productionBatches.filter(
    (b) => b.category === "finished_goods",
  );

  // Sort by expiry date for FEFO
  const sortedByExpiry = [...finishedBatches].sort(
    (a, b) =>
      new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime(),
  );

  const totalQuantity = finishedBatches.reduce((sum, b) => sum + b.quantity, 0);
  const availableQuantity = finishedBatches
    .filter((b) => b.status === "available")
    .reduce((sum, b) => sum + b.quantity, 0);

  // Calculate expiry alerts
  const getExpiryStatus = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.ceil(
      (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (daysUntilExpiry <= 0) return "expired";
    if (daysUntilExpiry <= 30) return "urgent";
    if (daysUntilExpiry <= 180) return "warning";
    return "ok";
  };

  const urgentBatches = finishedBatches.filter(
    (b) =>
      getExpiryStatus(b.expiryDate) === "urgent" ||
      getExpiryStatus(b.expiryDate) === "expired",
  );

  return (
    <DashboardLayout
      role="warehouse"
      breadcrumbs={[
        { label: "Quản lý kho", href: "/warehouse/inventory" },
        { label: "Thành phẩm" },
      ]}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <PageHeader
            title="Kho Thành phẩm (Finished Goods)"
            description="Thuốc hoàn chỉnh sẵn sàng xuất bán - Áp dụng FIFO/FEFO"
          />
          <Badge variant="outline" className="text-sm">
            Chiến lược: FEFO (First Expiry, First Out)
          </Badge>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">
                Tổng tồn kho
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {totalQuantity.toLocaleString("vi-VN")}
              </p>
              <p className="text-xs text-muted-foreground">
                đơn vị (tất cả lô)
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">
                Sẵn sàng xuất
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-600">
                {availableQuantity.toLocaleString("vi-VN")}
              </p>
              <p className="text-xs text-muted-foreground">đơn vị khả dụng</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Tổng số lô</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-blue-600">
                {finishedBatches.length}
              </p>
              <p className="text-xs text-muted-foreground">lô thành phẩm</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">
                Ưu tiên xuất
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-orange-600">
                {urgentBatches.length}
              </p>
              <p className="text-xs text-muted-foreground">lô hết hạn gần</p>
            </CardContent>
          </Card>
        </div>

        {/* FEFO Priority List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Danh sách Xuất kho theo FEFO
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Sắp xếp theo hạn sử dụng - ưu tiên xuất lô hết hạn sớm nhất
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {sortedByExpiry.map((batch, index) => {
              const expiryStatus = getExpiryStatus(batch.expiryDate);
              const daysUntilExpiry = Math.ceil(
                (new Date(batch.expiryDate).getTime() - new Date().getTime()) /
                  (1000 * 60 * 60 * 24),
              );

              return (
                <div
                  key={batch.id}
                  className={cn(
                    "flex items-start gap-4 rounded-lg border p-4",
                    expiryStatus === "expired" && "border-red-200 bg-red-50/50",
                    expiryStatus === "urgent" &&
                      "border-orange-200 bg-orange-50/50",
                    index === 0 &&
                      expiryStatus !== "expired" &&
                      "ring-2 ring-green-200",
                  )}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-background font-bold text-sm">
                    {index + 1}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{batch.productName}</h4>
                          {index === 0 && expiryStatus !== "expired" && (
                            <Badge variant="default" className="bg-green-600">
                              Ưu tiên xuất
                            </Badge>
                          )}
                          {expiryStatus === "expired" && (
                            <Badge variant="destructive">
                              <AlertTriangle className="mr-1 h-3 w-3" />
                              Hết hạn
                            </Badge>
                          )}
                          {expiryStatus === "urgent" && (
                            <Badge
                              variant="secondary"
                              className="border-orange-500 text-orange-600"
                            >
                              <Clock className="mr-1 h-3 w-3" />
                              Còn {daysUntilExpiry} ngày
                            </Badge>
                          )}
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Lô: {batch.batchNumber} • Vị trí: {batch.location}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="font-semibold">
                          {batch.quantity.toLocaleString("vi-VN")} {batch.unit}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Khả dụng
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 grid gap-2 text-sm md:grid-cols-3">
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Ngày sản xuất
                        </p>
                        <p className="mt-1 font-medium">
                          {new Date(batch.manufacturingDate).toLocaleDateString(
                            "vi-VN",
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Hạn sử dụng
                        </p>
                        <p
                          className={cn(
                            "mt-1 font-medium",
                            expiryStatus === "expired" && "text-red-600",
                            expiryStatus === "urgent" && "text-orange-600",
                          )}
                        >
                          {new Date(batch.expiryDate).toLocaleDateString(
                            "vi-VN",
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Tỷ lệ sử dụng
                        </p>
                        <p className="mt-1 font-medium">
                          {(
                            ((batch.originalQuantity - batch.quantity) /
                              batch.originalQuantity) *
                            100
                          ).toFixed(0)}
                          %
                        </p>
                      </div>
                    </div>

                    {batch.notes && (
                      <div className="mt-2 text-xs text-muted-foreground italic">
                        💡 {batch.notes}
                      </div>
                    )}

                    {index === 0 && batch.status === "available" && (
                      <Button size="sm" className="mt-3">
                        Tạo phiếu xuất kho
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
