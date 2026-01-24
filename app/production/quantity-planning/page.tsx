"use client";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  salesOrders,
  medicines,
  productionLines,
  materials,
} from "@/lib/mock-data";
import { Calculator, CheckCircle, AlertTriangle } from "lucide-react";
import { useState } from "react";

export default function QuantityPlanningPage() {
  const [selectedOrder, setSelectedOrder] = useState(salesOrders[0]?.id || "");
  const order = salesOrders.find((so) => so.id === selectedOrder);

  return (
    <DashboardLayout
      role="production_planner"
      breadcrumbs={[
        { label: "Tổng quan", href: "/production/overview" },
        { label: "Hoạch định số lượng" },
      ]}
    >
      <div className="space-y-6">
        <PageHeader
          title="Hoạch định Số lượng Sản xuất"
          description="Xác định số lượng sản phẩm cần sản xuất cho từng loại thuốc"
        />

        <Card>
          <CardHeader>
            <CardTitle>Chọn đơn hàng</CardTitle>
            <CardDescription>
              Chọn đơn hàng để lập kế hoạch sản xuất
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="order-select">Đơn hàng</Label>
                <Select value={selectedOrder} onValueChange={setSelectedOrder}>
                  <SelectTrigger id="order-select">
                    <SelectValue placeholder="Chọn đơn hàng" />
                  </SelectTrigger>
                  <SelectContent>
                    {salesOrders.map((so) => (
                      <SelectItem key={so.id} value={so.id}>
                        {so.code} - {so.customerName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {order && (
                <div className="rounded-md border bg-muted/50 p-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Khách hàng</p>
                      <p className="font-medium">{order.customerName}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Ngày yêu cầu</p>
                      <p className="font-medium">
                        {new Date(order.requiredDate).toLocaleDateString(
                          "vi-VN",
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Trạng thái</p>
                      <Badge>
                        {order.status === "pending"
                          ? "Chưa lập kế hoạch"
                          : "Đã lập kế hoạch"}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Ưu tiên</p>
                      <Badge
                        variant={
                          order.priority === "urgent"
                            ? "destructive"
                            : "outline"
                        }
                      >
                        {order.priority === "urgent"
                          ? "Khẩn cấp"
                          : order.priority === "high"
                            ? "Cao"
                            : "Trung bình"}
                      </Badge>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {order && (
          <Card>
            <CardHeader>
              <CardTitle>Kế hoạch sản xuất</CardTitle>
              <CardDescription>
                Phân bổ sản lượng và dây chuyền sản xuất
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {order.items.map((item) => {
                  const medicine = medicines.find(
                    (m) => m.id === item.medicineId,
                  );
                  const availableLines = productionLines.filter(
                    (line) =>
                      line.type === medicine?.type && line.status === "active",
                  );

                  // Calculate material requirements
                  const materialRequirements =
                    medicine?.materials.map((mat) => {
                      const material = materials.find(
                        (m) => m.id === mat.materialId,
                      );
                      const required =
                        (item.quantity * mat.quantityPerUnit) / 1000; // Convert gto kg
                      const available = material?.currentStock || 0;
                      const sufficient = available >= required;

                      return {
                        ...mat,
                        materialCode: material?.code || "",
                        required,
                        available,
                        sufficient,
                      };
                    }) || [];

                  return (
                    <div
                      key={item.id}
                      className="space-y-4 rounded-lg border p-4"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold">{item.medicineName}</h4>
                          <p className="text-sm text-muted-foreground">
                            {item.medicineCode}
                          </p>
                        </div>
                        <Badge variant="outline">
                          {medicine?.type === "tablet"
                            ? "Viên nén"
                            : medicine?.type === "capsule"
                              ? "Viên nang"
                              : "Xi-rô"}
                        </Badge>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <Label>Số lượng đặt hàng</Label>
                          <Input
                            value={item.quantity.toLocaleString("vi-VN")}
                            disabled
                          />
                        </div>
                        <div>
                          <Label>Số lượng sản xuất (dự kiến)</Label>
                          <Input
                            type="number"
                            defaultValue={Math.ceil(item.quantity * 1.05)}
                            placeholder="Nhập số lượng..."
                          />
                          <p className="mt-1 text-xs text-muted-foreground">
                            Đề xuất:{" "}
                            {Math.ceil(item.quantity * 1.05).toLocaleString(
                              "vi-VN",
                            )}{" "}
                            (bao gồm 5% dự phòng)
                          </p>
                        </div>
                      </div>

                      <div>
                        <Label>Chọn dây chuyền sản xuất</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn dây chuyền" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableLines.map((line) => (
                              <SelectItem key={line.id} value={line.id}>
                                {line.name} - Công suất:{" "}
                                {line.capacityPerShift.toLocaleString("vi-VN")}{" "}
                                {line.capacityUnit}/ca
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Kiểm tra nguyên liệu</Label>
                        <div className="space-y-2">
                          {materialRequirements.map((mat, idx) => (
                            <div
                              key={idx}
                              className={`flex items-center justify-between rounded-md border p-2 ${
                                !mat.sufficient
                                  ? "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950"
                                  : ""
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                {mat.sufficient ? (
                                  <CheckCircle className="h-4 w-4 text-green-600" />
                                ) : (
                                  <AlertTriangle className="h-4 w-4 text-red-600" />
                                )}
                                <span className="text-sm">
                                  {mat.materialName} ({mat.materialCode})
                                </span>
                              </div>
                              <div className="text-right text-sm">
                                <p>
                                  Cần:{" "}
                                  <strong>{mat.required.toFixed(2)} kg</strong>
                                </p>
                                <p
                                  className={
                                    mat.sufficient
                                      ? "text-green-600"
                                      : "text-red-600"
                                  }
                                >
                                  Tồn kho: {mat.available} kg
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}

                <div className="flex justify-end gap-2">
                  <Button variant="outline">Lưu nháp</Button>
                  <Button>Tạo kế hoạch sản xuất</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
