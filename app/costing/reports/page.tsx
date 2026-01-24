"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { batchCostings } from "@/lib/costing-mock-data";
import { BarChart3, TrendingUp, DollarSign } from "lucide-react";

export default function CostingReportsPage() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const completedCostings = batchCostings.filter(
    (c) => c.status === "completed" || c.status === "approved",
  );

  const avgCostPerUnit =
    completedCostings.reduce((sum, c) => sum + c.costPerUnit, 0) /
    completedCostings.length;
  const avgMaterialPercent =
    completedCostings.reduce(
      (sum, c) => sum + (c.totalMaterialCost / c.totalCost) * 100,
      0,
    ) / completedCostings.length;
  const avgLaborPercent =
    completedCostings.reduce(
      (sum, c) => sum + (c.totalLaborCost / c.totalCost) * 100,
      0,
    ) / completedCostings.length;
  const avgOverheadPercent =
    completedCostings.reduce(
      (sum, c) => sum + (c.totalOverheadCost / c.totalCost) * 100,
      0,
    ) / completedCostings.length;

  return (
    <DashboardLayout
      role="accountant"
      breadcrumbs={[{ label: "Báo cáo giá thành" }]}
    >
      <div className="space-y-6">
        <PageHeader
          title="Báo cáo & Phân tích Giá thành"
          description="Phân tích xu hướng và so sánh giá thành sản xuất"
        />

        {/* Summary Stats */}
        <div className="grid gap-4 sm:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">
                  TB Giá/đơn vị
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(avgCostPerUnit)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">TB % NVL</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {avgMaterialPercent.toFixed(1)}%
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                TB % Nhân công
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {avgLaborPercent.toFixed(1)}%
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                TB % Overhead
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {avgOverheadPercent.toFixed(1)}%
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cost Comparison by Medicine */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              So sánh Giá thành theo Sản phẩm
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {completedCostings.map((costing) => (
                <div key={costing.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{costing.medicineName}</p>
                      <p className="text-sm text-muted-foreground">
                        Lô {costing.batchNumber}
                      </p>
                    </div>
                    <p className="text-lg font-bold">
                      {formatCurrency(costing.costPerUnit)}/{costing.unit}
                    </p>
                  </div>

                  {/* Cost breakdown bar */}
                  <div className="flex h-8 w-full overflow-hidden rounded-lg">
                    <div
                      className="bg-blue-500 flex items-center justify-center text-xs text-white"
                      style={{
                        width: `${(costing.totalMaterialCost / costing.totalCost) * 100}%`,
                      }}
                    >
                      {Math.round(
                        (costing.totalMaterialCost / costing.totalCost) * 100,
                      )}
                      %
                    </div>
                    <div
                      className="bg-green-500 flex items-center justify-center text-xs text-white"
                      style={{
                        width: `${(costing.totalLaborCost / costing.totalCost) * 100}%`,
                      }}
                    >
                      {Math.round(
                        (costing.totalLaborCost / costing.totalCost) * 100,
                      )}
                      %
                    </div>
                    <div
                      className="bg-orange-500 flex items-center justify-center text-xs text-white"
                      style={{
                        width: `${(costing.totalOverheadCost / costing.totalCost) * 100}%`,
                      }}
                    >
                      {Math.round(
                        (costing.totalOverheadCost / costing.totalCost) * 100,
                      )}
                      %
                    </div>
                  </div>

                  <div className="flex gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <div className="h-3 w-3 rounded bg-blue-500"></div>
                      <span>
                        NVL: {formatCurrency(costing.totalMaterialCost)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="h-3 w-3 rounded bg-green-500"></div>
                      <span>
                        Nhân công: {formatCurrency(costing.totalLaborCost)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="h-3 w-3 rounded bg-orange-500"></div>
                      <span>
                        Overhead: {formatCurrency(costing.totalOverheadCost)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Detailed Comparison Table */}
        <Card>
          <CardHeader>
            <CardTitle>Bảng So sánh Chi tiết</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      Sản phẩm
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      Lô
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-medium">
                      SL
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-medium">
                      NVL
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-medium">
                      Nhân công
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-medium">
                      Overhead
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-medium">
                      Tổng
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-medium">
                      Giá/ĐV
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {completedCostings.map((c) => (
                    <tr key={c.id} className="border-t">
                      <td className="px-4 py-3 text-sm font-medium">
                        {c.medicineName}
                      </td>
                      <td className="px-4 py-3 text-sm">{c.batchNumber}</td>
                      <td className="px-4 py-3 text-sm text-right">
                        {c.quantityProduced.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-right">
                        {formatCurrency(c.totalMaterialCost)}
                      </td>
                      <td className="px-4 py-3 text-sm text-right">
                        {formatCurrency(c.totalLaborCost)}
                      </td>
                      <td className="px-4 py-3 text-sm text-right">
                        {formatCurrency(c.totalOverheadCost)}
                      </td>
                      <td className="px-4 py-3 text-sm text-right font-medium">
                        {formatCurrency(c.totalCost)}
                      </td>
                      <td className="px-4 py-3 text-sm text-right font-bold text-green-600">
                        {formatCurrency(c.costPerUnit)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
