"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { PageHeader } from "@/components/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { batchCostings } from "@/lib/costing-mock-data";
import { productionBatches } from "@/lib/warehouse-mock-data";
import { Calculator, TrendingUp, DollarSign, Package } from "lucide-react";
import Link from "next/link";

export default function CostingBatchesPage() {
  const completedCostings = batchCostings.filter(
    (c) => c.status === "completed" || c.status === "approved",
  );
  const pendingCostings = batchCostings.filter(
    (c) => c.status === "draft" || c.status === "calculating",
  );

  // Find batches without costing
  const batchesWithoutCosting = productionBatches.filter((batch) => {
    return !batchCostings.some((c) => c.productionBatchId === batch.id);
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-blue-500">Đã tính</Badge>;
      case "approved":
        return <Badge className="bg-green-500">Đã duyệt</Badge>;
      case "calculating":
        return <Badge variant="secondary">Đang tính</Badge>;
      case "draft":
        return <Badge variant="outline">Nháp</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <DashboardLayout
      role="accounting"
      breadcrumbs={[{ label: "Tính giá thành" }]}
    >
      <div className="space-y-6">
        <PageHeader
          title="Tính giá thành Sản xuất"
          description="Tập hợp chi phí và tính giá thành cho từng lô sản phẩm"
        />

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Tổng lô đã tính
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{batchCostings.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Đã phê duyệt
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {batchCostings.filter((c) => c.status === "approved").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Đang xử lý</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {pendingCostings.length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Chờ tính</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {batchesWithoutCosting.length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Batches needing costing */}
        {batchesWithoutCosting.length > 0 && (
          <Card>
            <CardHeader className="bg-blue-50">
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-blue-500" />
                Lô sản phẩm chưa tính giá thành ({batchesWithoutCosting.length})
              </CardTitle>
              <CardDescription>
                Các lô đã hoàn thành sản xuất nhưng chưa tính giá thành
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3">
                {batchesWithoutCosting.map((batch) => (
                  <div
                    key={batch.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{batch.productName}</p>
                      <p className="text-sm text-muted-foreground">
                        Lô: {batch.batchNumber} •{" "}
                        {batch.quantity.toLocaleString()} {batch.unit}
                      </p>
                    </div>
                    <Button>
                      <Calculator className="mr-2 h-4 w-4" />
                      Tính giá thành
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Completed Costings */}
        <Card>
          <CardHeader>
            <CardTitle>Lô sản phẩm đã tính giá thành</CardTitle>
            <CardDescription>
              {batchCostings.length} lô đã được tính giá
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {batchCostings.map((costing) => (
                <Link key={costing.id} href={`/costing/view/${costing.id}`}>
                  <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">
                            {costing.medicineName}
                          </CardTitle>
                          <CardDescription>
                            {costing.code} • Lô {costing.batchNumber}
                          </CardDescription>
                        </div>
                        {getStatusBadge(costing.status)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Số lượng SX
                          </p>
                          <p className="font-medium">
                            {costing.quantityProduced.toLocaleString()}{" "}
                            {costing.unit}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Chi phí NVL
                          </p>
                          <p className="font-medium">
                            {formatCurrency(costing.totalMaterialCost)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Tổng giá thành
                          </p>
                          <p className="font-medium text-primary">
                            {formatCurrency(costing.totalCost)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Giá/đơn vị
                          </p>
                          <p className="font-medium text-green-600">
                            {formatCurrency(costing.costPerUnit)}
                          </p>
                        </div>
                      </div>

                      {/* Cost Breakdown */}
                      <div className="mt-4 grid grid-cols-3 gap-2">
                        <div className="rounded-lg bg-blue-50 p-3 text-center">
                          <p className="text-xs text-muted-foreground">NVL</p>
                          <p className="font-semibold text-blue-600">
                            {Math.round(
                              (costing.totalMaterialCost / costing.totalCost) *
                                100,
                            )}
                            %
                          </p>
                        </div>
                        <div className="rounded-lg bg-green-50 p-3 text-center">
                          <p className="text-xs text-muted-foreground">
                            Nhân công
                          </p>
                          <p className="font-semibold text-green-600">
                            {Math.round(
                              (costing.totalLaborCost / costing.totalCost) *
                                100,
                            )}
                            %
                          </p>
                        </div>
                        <div className="rounded-lg bg-orange-50 p-3 text-center">
                          <p className="text-xs text-muted-foreground">
                            Overhead
                          </p>
                          <p className="font-semibold text-orange-600">
                            {Math.round(
                              (costing.totalOverheadCost / costing.totalCost) *
                                100,
                            )}
                            %
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
