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
  MapPin,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

export default function SemiFinishedPage() {
  const semiFinishedBatches = productionBatches.filter(
    (b) => b.category === "semi_finished",
  );

  const totalQuantity = semiFinishedBatches.reduce(
    (sum, b) => sum + b.quantity,
    0,
  );
  const availableBatches = semiFinishedBatches.filter(
    (b) => b.status === "available",
  );
  const approvedBatches = semiFinishedBatches.filter(
    (b) => b.qualityStatus === "approved",
  );

  return (
    <DashboardLayout
      role="warehouse"
      breadcrumbs={[
        { label: "Quản lý kho", href: "/warehouse/inventory" },
        { label: "Bán thành phẩm" },
      ]}
    >
      <div className="space-y-6">
        <PageHeader
          title="Kho Bán thành phẩm (Semi-Finished Goods)"
          description="Quản lý sản phẩm trong quá trình sản xuất (WIP)"
        />

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">
                Tổng tồn kho BTP
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
              <CardTitle className="text-sm font-medium">Lô sẵn sàng</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-600">
                {availableBatches.length}
              </p>
              <p className="text-xs text-muted-foreground">có thể chuyển TP</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">
                Đã kiểm định
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-blue-600">
                {approvedBatches.length}
              </p>
              <p className="text-xs text-muted-foreground">đạt chất lượng</p>
            </CardContent>
          </Card>
        </div>

        {/* Batch List */}
        <div className="grid gap-4 md:grid-cols-2">
          {semiFinishedBatches.map((batch) => (
            <Card key={batch.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">
                      {batch.productName}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Số lô: {batch.batchNumber}
                    </p>
                  </div>
                  <Badge
                    variant={
                      batch.status === "available" ? "default" : "secondary"
                    }
                    className="ml-2"
                  >
                    {batch.status === "available"
                      ? "Sẵn sàng"
                      : batch.status === "reserved"
                        ? "Đang xử lý"
                        : "Khác"}
                  </Badge>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Package className="h-4 w-4" />
                      <span>Số lượng:</span>
                    </div>
                    <span className="font-medium">
                      {batch.quantity.toLocaleString("vi-VN")} {batch.unit}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>Vị trí:</span>
                    </div>
                    <span className="font-medium">{batch.location}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>NSX:</span>
                    </div>
                    <span className="font-medium">
                      {new Date(batch.manufacturingDate).toLocaleDateString(
                        "vi-VN",
                      )}
                    </span>
                  </div>

                  {batch.qualityStatus && (
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Chất lượng:</span>
                      </div>
                      <Badge
                        variant={
                          batch.qualityStatus === "approved"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {batch.qualityStatus === "approved"
                          ? "Đã duyệt"
                          : "Chờ kiểm"}
                      </Badge>
                    </div>
                  )}
                </div>

                {batch.notes && (
                  <div className="mt-3 rounded-md bg-yellow-50 p-3 text-xs text-yellow-900">
                    📋 {batch.notes}
                  </div>
                )}

                {batch.status === "available" &&
                  batch.qualityStatus === "approved" && (
                    <Button className="mt-4 w-full" variant="outline">
                      <ArrowRight className="mr-2 h-4 w-4" />
                      Chuyển sang thành phẩm
                    </Button>
                  )}
              </CardContent>
            </Card>
          ))}
        </div>

        {semiFinishedBatches.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-12 text-center">
              <Package className="h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">
                Chưa có bán thành phẩm
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Bán thành phẩm sẽ xuất hiện khi quá trình sản xuất hoàn tất các
                công đoạn chính
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
