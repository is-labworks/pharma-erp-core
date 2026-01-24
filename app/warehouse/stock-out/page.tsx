"use client";
import { DashboardLayout } from "@/components/dashboard-layout";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { productionBatches } from "@/lib/warehouse-mock-data";
import {
  ShoppingCart,
  Package,
  Calendar,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { useState } from "react";

export default function StockOutPage() {
  const [selectedCategory, setSelectedCategory] = useState("raw_material");
  const [requestedQuantity, setRequestedQuantity] = useState("");

  const availableBatches = productionBatches.filter(
    (b) => b.category === selectedCategory && b.status === "available",
  );

  // FIFO/FEFO allocation logic
  const allocateBatches = (quantity: number) => {
    const sorted = [...availableBatches].sort(
      (a, b) =>
        new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime(),
    );

    const allocations: any[] = [];
    let remaining = quantity;

    for (const batch of sorted) {
      if (remaining <= 0) break;

      const allocated = Math.min(batch.quantity, remaining);
      allocations.push({
        ...batch,
        allocatedQuantity: allocated,
      });
      remaining -= allocated;
    }

    return { allocations, shortage: remaining > 0 ? remaining : 0 };
  };

  const requested = parseFloat(requestedQuantity) || 0;
  const allocation = requested > 0 ? allocateBatches(requested) : null;

  return (
    <DashboardLayout
      role="warehouse"
      breadcrumbs={[
        { label: "Quản lý kho", href: "/warehouse/inventory" },
        { label: "Xuất kho" },
      ]}
    >
      <div className="space-y-6">
        <PageHeader
          title="Xuất kho (Stock Requisition)"
          description="Tạo yêu cầu xuất kho với phân bổ tự động theo FIFO/FEFO"
        />

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Request Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Yêu cầu xuất kho
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Loại sản phẩm</Label>
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="raw_material">Nguyên liệu</SelectItem>
                    <SelectItem value="semi_finished">
                      Bán thành phẩm
                    </SelectItem>
                    <SelectItem value="finished_goods">Thành phẩm</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Số lượng yêu cầu</Label>
                <Input
                  type="number"
                  placeholder="Nhập số lượng..."
                  value={requestedQuantity}
                  onChange={(e) => setRequestedQuantity(e.target.value)}
                />
              </div>

              <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-900">
                <p className="font-medium">ℹ️ Chiến lược phân bổ: FEFO</p>
                <p className="mt-1 text-xs">
                  Hệ thống tự động chọn lô hết hạn sớm nhất (First Expire, First
                  Out)
                </p>
              </div>

              {allocation && (
                <div className="space-y-3">
                  {allocation.shortage > 0 ? (
                    <div className="rounded-lg bg-red-50 p-4">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-5 w-5 text-red-600" />
                        <div>
                          <p className="font-medium text-red-900">
                            Không đủ tồn kho
                          </p>
                          <p className="mt-1 text-sm text-red-700">
                            Thiếu: {allocation.shortage.toLocaleString("vi-VN")}{" "}
                            đơn vị
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-lg bg-green-50 p-4">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-medium text-green-900">
                            Đủ tồn kho
                          </p>
                          <p className="mt-1 text-sm text-green-700">
                            Phân bổ từ {allocation.allocations.length} lô
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <Button className="w-full" disabled={allocation.shortage > 0}>
                    Tạo phiếu xuất kho
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Allocation Result */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Phân bổ lô hàng (FEFO)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!allocation ? (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <Package className="h-12 w-12 text-muted-foreground" />
                  <p className="mt-4 text-sm text-muted-foreground">
                    Nhập số lượng để xem phân bổ tự động
                  </p>
                </div>
              ) : allocation.allocations.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <AlertCircle className="h-12 w-12 text-red-500" />
                  <p className="mt-4 text-sm font-medium">
                    Không có lô khả dụng
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {allocation.allocations.map((batch: any, index: number) => (
                    <div
                      key={batch.id}
                      className="rounded-lg border bg-card p-4"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                              {index + 1}
                            </span>
                            <h4 className="font-semibold">
                              {batch.productName}
                            </h4>
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">
                            Lô: {batch.batchNumber}
                          </p>
                        </div>
                        <Badge variant="default">
                          {batch.allocatedQuantity} / {batch.quantity}
                        </Badge>
                      </div>

                      <div className="mt-3 grid gap-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Hạn dùng:
                          </span>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3 w-3" />
                            <span className="font-medium">
                              {new Date(batch.expiryDate).toLocaleDateString(
                                "vi-VN",
                              )}
                            </span>
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Vị trí:</span>
                          <span className="font-medium">{batch.location}</span>
                        </div>
                      </div>

                      {index === 0 && (
                        <div className="mt-2 text-xs text-blue-600">
                          ⭐ Ưu tiên xuất (hết hạn sớm nhất)
                        </div>
                      )}
                    </div>
                  ))}

                  {allocation.shortage > 0 && (
                    <div className="rounded-lg border-2 border-dashed border-red-200 bg-red-50 p-4 text-center">
                      <p className="font-medium text-red-900">
                        Còn thiếu: {allocation.shortage.toLocaleString("vi-VN")}{" "}
                        đơn vị
                      </p>
                      <p className="mt-1 text-xs text-red-700">
                        Cần tạo yêu cầu mua hàng hoặc điều chỉnh kế hoạch
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
