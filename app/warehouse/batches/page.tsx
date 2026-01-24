"use client";
import { DashboardLayout } from "@/components/dashboard-layout";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { productionBatches } from "@/lib/warehouse-mock-data";
import {
  Package,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  MapPin,
  Search,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function BatchesPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBatches = productionBatches.filter(
    (batch) =>
      batch.batchNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      batch.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      batch.productCode.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const categoryLabels = {
    raw_material: "Nguyên liệu",
    semi_finished: "Bán thành phẩm",
    finished_goods: "Thành phẩm",
  };

  const categoryColors = {
    raw_material: "bg-blue-500/10 text-blue-600 borderblue-200",
    semi_finished: "bg-yellow-500/10 text-yellow-600 border-yellow-200",
    finished_goods: "bg-green-500/10 text-green-600 border-green-200",
  };

  const statusColors = {
    available: "bg-green-500/10 text-green-600 border-green-200",
    reserved: "bg-yellow-500/10 text-yellow-600 border-yellow-200",
    quarantine: "bg-orange-500/10 text-orange-600 border-orange-200",
    expired: "bg-red-500/10 text-red-600 border-red-200",
    consumed: "bg-gray-500/10 text-gray-600 border-gray-200",
  };

  const statusLabels = {
    available: "Sẵn sàng",
    reserved: "Đã đặt",
    quarantine: "Cách ly",
    expired: "Hết hạn",
    consumed: "Đã sử dụng",
  };

  // Calculate expiry alerts
  const getExpiryStatus = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.ceil(
      (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (daysUntilExpiry <= 0)
      return { level: "expired", label: "Đã hết hạn", days: daysUntilExpiry };
    if (daysUntilExpiry <= 7)
      return {
        level: "critical",
        label: "Còn " + daysUntilExpiry + " ngày",
        days: daysUntilExpiry,
      };
    if (daysUntilExpiry <= 30)
      return {
        level: "warning",
        label: "Còn " + daysUntilExpiry + " ngày",
        days: daysUntilExpiry,
      };
    if (daysUntilExpiry <= 180)
      return {
        level: "info",
        label: "Còn " + Math.round(daysUntilExpiry / 30) + " tháng",
        days: daysUntilExpiry,
      };
    return { level: "ok", label: "", days: daysUntilExpiry };
  };

  const expiredBatches = filteredBatches.filter(
    (b) => getExpiryStatus(b.expiryDate).level === "expired",
  );
  const criticalBatches = filteredBatches.filter(
    (b) => getExpiryStatus(b.expiryDate).level === "critical",
  );
  const warningBatches = filteredBatches.filter(
    (b) => getExpiryStatus(b.expiryDate).level === "warning",
  );

  const renderBatchCard = (batch: (typeof productionBatches)[0]) => {
    const expiryStatus = getExpiryStatus(batch.expiryDate);
    const usagePercent =
      ((batch.originalQuantity - batch.quantity) / batch.originalQuantity) *
      100;

    return (
      <Card
        key={batch.id}
        className={cn(
          "transition-shadow hover:shadow-md",
          expiryStatus.level === "expired" && "border-red-200",
          expiryStatus.level === "critical" && "border-orange-200",
        )}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{batch.productName}</h3>
                <Badge
                  variant="outline"
                  className={categoryColors[batch.category]}
                >
                  {categoryLabels[batch.category]}
                </Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Số lô: {batch.batchNumber} • Mã: {batch.productCode}
              </p>
            </div>
            <Badge variant="outline" className={statusColors[batch.status]}>
              {statusLabels[batch.status]}
            </Badge>
          </div>

          <div className="mt-4 grid gap-3 border-t pt-3">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Package className="h-4 w-4" />
                <span>Tồn kho:</span>
              </div>
              <span className="font-medium">
                {batch.quantity.toLocaleString("vi-VN")} /{" "}
                {batch.originalQuantity.toLocaleString("vi-VN")} {batch.unit}
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
                <span>Hạn sử dụng:</span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "font-medium",
                    expiryStatus.level === "expired" && "text-red-600",
                    expiryStatus.level === "critical" && "text-orange-600",
                    expiryStatus.level === "warning" && "text-yellow-600",
                  )}
                >
                  {new Date(batch.expiryDate).toLocaleDateString("vi-VN")}
                </span>
                {expiryStatus.label && (
                  <Badge
                    variant={
                      expiryStatus.level === "expired"
                        ? "destructive"
                        : expiryStatus.level === "critical"
                          ? "destructive"
                          : "secondary"
                    }
                    className="text-xs"
                  >
                    {expiryStatus.label}
                  </Badge>
                )}
              </div>
            </div>

            {batch.qualityStatus && (
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Chất lượng:</span>
                </div>
                <Badge
                  variant={
                    batch.qualityStatus === "approved" ? "default" : "secondary"
                  }
                >
                  {batch.qualityStatus === "approved"
                    ? "Đã duyệt"
                    : batch.qualityStatus === "pending"
                      ? "Chờ kiểm"
                      : "Từ chối"}
                </Badge>
              </div>
            )}

            {batch.supplierName && (
              <div className="text-xs text-muted-foreground">
                NCC: {batch.supplierName}
              </div>
            )}

            {batch.notes && (
              <div className="rounded-md bg-muted/50 p-2 text-xs">
                {batch.notes}
              </div>
            )}

            {/* Usage bar */}
            <div className="mt-2">
              <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                <span>Đã sử dụng</span>
                <span>{usagePercent.toFixed(0)}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${usagePercent}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <DashboardLayout
      role="warehouse"
      breadcrumbs={[
        { label: "Quản lý kho", href: "/warehouse/inventory" },
        { label: "Quản lý lô hàng" },
      ]}
    >
      <div className="space-y-6">
        <PageHeader
          title="Quản lý Lô hàng (Batch Management)"
          description="Theo dõi lô sản xuất, hạn sử dụng và trạng thái chất lượng"
        />

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-muted-foreground" />
                <CardTitle className="text-sm font-medium">
                  Tổng lô hàng
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{productionBatches.length}</p>
              <p className="text-xs text-muted-foreground">lô đang quản lý</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <CardTitle className="text-sm font-medium">
                  Đã hết hạn
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-red-600">
                {expiredBatches.length}
              </p>
              <p className="text-xs text-muted-foreground">cần xử lý ngay</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-orange-600" />
                <CardTitle className="text-sm font-medium">
                  Sắp hết hạn
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-orange-600">
                {criticalBatches.length}
              </p>
              <p className="text-xs text-muted-foreground">{"< 7 ngày"}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-yellow-600" />
                <CardTitle className="text-sm font-medium">Cần chú ý</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-yellow-600">
                {warningBatches.length}
              </p>
              <p className="text-xs text-muted-foreground">{"< 30 ngày"}</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm theo số lô, tên sản phẩm, mã..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Tabs by Category */}
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">
              Tất cả ({filteredBatches.length})
            </TabsTrigger>
            <TabsTrigger value="raw_material">
              Nguyên liệu (
              {
                filteredBatches.filter((b) => b.category === "raw_material")
                  .length
              }
              )
            </TabsTrigger>
            <TabsTrigger value="semi_finished">
              Bán thành phẩm (
              {
                filteredBatches.filter((b) => b.category === "semi_finished")
                  .length
              }
              )
            </TabsTrigger>
            <TabsTrigger value="finished_goods">
              Thành phẩm (
              {
                filteredBatches.filter((b) => b.category === "finished_goods")
                  .length
              }
              )
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredBatches.map(renderBatchCard)}
            </div>
          </TabsContent>

          <TabsContent value="raw_material" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredBatches
                .filter((b) => b.category === "raw_material")
                .map(renderBatchCard)}
            </div>
          </TabsContent>

          <TabsContent value="semi_finished" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredBatches
                .filter((b) => b.category === "semi_finished")
                .map(renderBatchCard)}
            </div>
          </TabsContent>

          <TabsContent value="finished_goods" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredBatches
                .filter((b) => b.category === "finished_goods")
                .map(renderBatchCard)}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
