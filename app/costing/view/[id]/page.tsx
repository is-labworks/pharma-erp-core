"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { batchCostings } from "@/lib/costing-mock-data";
import { Download, CheckCircle } from "lucide-react";

export default function CostingViewPage({
  params,
}: {
  params: { id: string };
}) {
  const costing =
    batchCostings.find((c) => c.id === params.id) || batchCostings[0];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <DashboardLayout
      role="accounting"
      breadcrumbs={[
        { label: "Tính giá thành", href: "/costing/batches" },
        { label: costing.code },
      ]}
    >
      <div className="space-y-6">
        <PageHeader
          title={`Chi tiết Giá thành - ${costing.code}`}
          description={`${costing.medicineName} • Lô ${costing.batchNumber}`}
        >
          <div className="flex gap-2">
            <Button variant="outline" className="bg-transparent">
              <Download className="mr-2 h-4 w-4" />
              Xuất Excel
            </Button>
            {costing.status === "completed" && !costing.approvedBy && (
              <Button className="bg-green-600 hover:bg-green-700">
                <CheckCircle className="mr-2 h-4 w-4" />
                Phê duyệt
              </Button>
            )}
          </div>
        </PageHeader>

        {/* Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Số lượng SX</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {costing.quantityProduced.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">{costing.unit}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Tổng giá thành
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {formatCurrency(costing.totalCost)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Giá/đơn vị</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(costing.costPerUnit)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Trạng thái</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl">
                <Badge
                  className={
                    costing.status === "approved"
                      ? "bg-green-500"
                      : "bg-blue-500"
                  }
                >
                  {costing.status === "approved"
                    ? "Đã duyệt"
                    : costing.status === "completed"
                      ? "Đã tính"
                      : "Đang tính"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cost Breakdown Tabs */}
        <Tabs defaultValue="materials" className="space-y-4">
          <TabsList>
            <TabsTrigger value="materials">
              Nguyên vật liệu ({formatCurrency(costing.totalMaterialCost)})
            </TabsTrigger>
            <TabsTrigger value="labor">
              Nhân công ({formatCurrency(costing.totalLaborCost)})
            </TabsTrigger>
            <TabsTrigger value="overhead">
              Overhead ({formatCurrency(costing.totalOverheadCost)})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="materials">
            <Card>
              <CardHeader>
                <CardTitle>Chi phí Nguyên vật liệu</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium">
                          Mã NVL
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium">
                          Tên nguyên vật liệu
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium">
                          Loại
                        </th>
                        <th className="px-4 py-3 text-right text-sm font-medium">
                          Số lượng
                        </th>
                        <th className="px-4 py-3 text-right text-sm font-medium">
                          Đơn giá
                        </th>
                        <th className="px-4 py-3 text-right text-sm font-medium">
                          Thành tiền
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {costing.materialCosts.map((mat) => (
                        <tr key={mat.id} className="border-t">
                          <td className="px-4 py-3 text-sm">
                            {mat.materialCode}
                          </td>
                          <td className="px-4 py-3 text-sm font-medium">
                            {mat.materialName}
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant="outline" className="text-xs">
                              {mat.category === "raw_material"
                                ? "NVL"
                                : "Bao bì"}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-sm text-right">
                            {mat.quantity} {mat.unit}
                          </td>
                          <td className="px-4 py-3 text-sm text-right">
                            {formatCurrency(mat.unitCost)}
                          </td>
                          <td className="px-4 py-3 text-sm text-right font-medium">
                            {formatCurrency(mat.totalCost)}
                          </td>
                        </tr>
                      ))}
                      <tr className="border-t bg-muted/30 font-bold">
                        <td
                          colSpan={5}
                          className="px-4 py-3 text-sm text-right"
                        >
                          Tổng chi phí NVL:
                        </td>
                        <td className="px-4 py-3 text-sm text-right">
                          {formatCurrency(costing.totalMaterialCost)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="labor">
            <Card>
              <CardHeader>
                <CardTitle>Chi phí Nhân công Trực tiếp</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium">
                          Nhân viên
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium">
                          Chức vụ
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium">
                          Ngày làm việc
                        </th>
                        <th className="px-4 py-3 text-right text-sm font-medium">
                          Số giờ
                        </th>
                        <th className="px-4 py-3 text-right text-sm font-medium">
                          Đơn giá/giờ
                        </th>
                        <th className="px-4 py-3 text-right text-sm font-medium">
                          Thành tiền
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {costing.laborCosts.map((labor) => (
                        <tr key={labor.id} className="border-t">
                          <td className="px-4 py-3 text-sm font-medium">
                            {labor.employeeName}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {labor.position}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {new Date(labor.shiftDate).toLocaleDateString(
                              "vi-VN",
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm text-right">
                            {labor.hours}h
                          </td>
                          <td className="px-4 py-3 text-sm text-right">
                            {formatCurrency(labor.hourlyRate)}
                          </td>
                          <td className="px-4 py-3 text-sm text-right font-medium">
                            {formatCurrency(labor.totalCost)}
                          </td>
                        </tr>
                      ))}
                      <tr className="border-t bg-muted/30 font-bold">
                        <td
                          colSpan={5}
                          className="px-4 py-3 text-sm text-right"
                        >
                          Tổng chi phí nhân công:
                        </td>
                        <td className="px-4 py-3 text-sm text-right">
                          {formatCurrency(costing.totalLaborCost)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="overhead">
            <Card>
              <CardHeader>
                <CardTitle>Chi phí Sản xuất Chung</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium">
                          Loại chi phí
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium">
                          Cơ sở phân bổ
                        </th>
                        <th className="px-4 py-3 text-right text-sm font-medium">
                          Tỷ lệ phân bổ
                        </th>
                        <th className="px-4 py-3 text-right text-sm font-medium">
                          Chi phí phân bổ
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {costing.overheadCosts.map((overhead) => (
                        <tr key={overhead.id} className="border-t">
                          <td className="px-4 py-3 text-sm font-medium">
                            {overhead.category}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {overhead.allocationBase === "machine_hours" &&
                              "Giờ máy"}
                            {overhead.allocationBase === "direct_labor_hours" &&
                              "Giờ công trực tiếp"}
                            {overhead.allocationBase === "units_produced" &&
                              "Số lượng SX"}
                          </td>
                          <td className="px-4 py-3 text-sm text-right">
                            {overhead.allocationBase === "units_produced"
                              ? `${formatCurrency(overhead.allocationRate)}/đơn vị`
                              : `${formatCurrency(overhead.allocationRate)}/giờ`}
                          </td>
                          <td className="px-4 py-3 text-sm text-right font-medium">
                            {formatCurrency(overhead.allocatedAmount)}
                          </td>
                        </tr>
                      ))}
                      <tr className="border-t bg-muted/30 font-bold">
                        <td
                          colSpan={3}
                          className="px-4 py-3 text-sm text-right"
                        >
                          Tổng chi phí overhead:
                        </td>
                        <td className="px-4 py-3 text-sm text-right">
                          {formatCurrency(costing.totalOverheadCost)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Approval Info */}
        {costing.approvedBy && (
          <Card className="bg-green-50 border-green-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle className="h-5 w-5" />
                <div>
                  <p className="font-medium">
                    Đã được phê duyệt bởi {costing.approvedBy}
                  </p>
                  <p className="text-sm">
                    {costing.approvedAt &&
                      new Date(costing.approvedAt).toLocaleString("vi-VN")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
