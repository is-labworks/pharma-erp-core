"use client";
import { DashboardLayout } from "@/components/dashboard-layout";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  customers,
  statusLabelsExtended,
  productPrices,
} from "@/lib/sales-mock-data";
import { medicines } from "@/lib/mock-data";
import {
  Plus,
  X,
  AlertTriangle,
  CheckCircle,
  Calculator,
  User,
  Package,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import type { Customer, SalesOrderItemExtended } from "@/lib/sales-types";
import { useSearchParams } from "next/navigation";

export default function NewOrderPage() {
  const searchParams = useSearchParams();
  const preselectedCustomerId = searchParams?.get("customerId");

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    preselectedCustomerId
      ? customers.find((c) => c.id === preselectedCustomerId) || null
      : null,
  );
  const [orderItems, setOrderItems] = useState<SalesOrderItemExtended[]>([]);
  const [requiredDate, setRequiredDate] = useState("");
  const [priority, setPriority] = useState<
    "low" | "medium" | "high" | "urgent"
  >("medium");
  const [paymentMethod, setPaymentMethod] = useState<
    "cash" | "transfer" | "credit"
  >("credit");
  const [notes, setNotes] = useState("");

  const addOrderItem = () => {
    const newItem: SalesOrderItemExtended = {
      id: `item-${Date.now()}`,
      medicineId: "",
      medicineName: "",
      medicineCode: "",
      unit: "",
      quantity: 0,
      unitPrice: 0,
      discountPercent: 0,
      discountAmount: 0,
      subtotal: 0,
      vatPercent: 8,
      vatAmount: 0,
      total: 0,
      availableStock: 0,
    };
    setOrderItems([...orderItems, newItem]);
  };

  const removeOrderItem = (id: string) => {
    setOrderItems(orderItems.filter((item) => item.id !== id));
  };

  const updateOrderItem = (id: string, field: string, value: any) => {
    setOrderItems(
      orderItems.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };

          if (field === "medicineId") {
            const medicine = medicines.find((m) => m.id === value);
            if (medicine && selectedCustomer) {
              const price = productPrices.find(
                (p) =>
                  p.medicineId === medicine.id &&
                  p.customerCategory === selectedCustomer.category,
              );
              updatedItem.medicineName = medicine.name;
              updatedItem.medicineCode = medicine.code;
              updatedItem.unit = medicine.unit;
              updatedItem.unitPrice = price?.unitPrice || 0;
              updatedItem.discountPercent = price?.discountPercent || 0;
              updatedItem.availableStock = 50000; // Mock stock
            }
          }

          // Recalculate amounts
          const quantity = updatedItem.quantity || 0;
          const unitPrice = updatedItem.unitPrice || 0;
          const discountPercent = updatedItem.discountPercent || 0;
          const vatPercent = updatedItem.vatPercent || 8;

          const subtotal = quantity * unitPrice;
          const discountAmount = (subtotal * discountPercent) / 100;
          const afterDiscount = subtotal - discountAmount;
          const vatAmount = (afterDiscount * vatPercent) / 100;
          const total = afterDiscount + vatAmount;

          updatedItem.subtotal = subtotal;
          updatedItem.discountAmount = discountAmount;
          updatedItem.vatAmount = vatAmount;
          updatedItem.total = total;

          return updatedItem;
        }
        return item;
      }),
    );
  };

  // Calculate totals
  const orderSubtotal = orderItems.reduce(
    (sum, item) => sum + item.subtotal,
    0,
  );
  const orderTotalDiscount = orderItems.reduce(
    (sum, item) => sum + item.discountAmount,
    0,
  );
  const orderVatAmount = orderItems.reduce(
    (sum, item) => sum + item.vatAmount,
    0,
  );
  const orderTotalAmount = orderItems.reduce(
    (sum, item) => sum + item.total,
    0,
  );

  // Debt check
  const wouldExceedDebtLimit =
    selectedCustomer &&
    paymentMethod === "credit" &&
    selectedCustomer.currentDebt + orderTotalAmount >
      selectedCustomer.debtLimit;

  const canSubmit =
    selectedCustomer &&
    orderItems.length > 0 &&
    orderItems.every((item) => item.medicineId && item.quantity > 0) &&
    requiredDate &&
    !wouldExceedDebtLimit;

  return (
    <DashboardLayout
      role="sales_staff"
      breadcrumbs={[
        { label: "Kinh doanh", href: "/sales" },
        { label: "Đơn hàng", href: "/sales/orders" },
        { label: "Tạo đơn mới" },
      ]}
    >
      <div className="space-y-6">
        <PageHeader
          title="Tạo đơn hàng mới"
          description="Nhập thông tin đơn hàng từ khách hàng"
        />

        {/* Customer Selection */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <User className="h-5 w-5" />
            <h3 className="font-semibold">Thông tin khách hàng</h3>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Chọn khách hàng *</Label>
              <Select
                value={selectedCustomer?.id || ""}
                onValueChange={(value) => {
                  const customer = customers.find((c) => c.id === value);
                  setSelectedCustomer(customer || null);
                  setOrderItems([]); // Reset items when customer changes
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="--  Chọn khách hàng --" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name} ({customer.code}) -{" "}
                      {statusLabelsExtended[customer.category]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedCustomer && (
              <Card className="p-4 bg-muted/50">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Loại KH:</span>
                    <Badge variant="outline">
                      {statusLabelsExtended[selectedCustomer.category]}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Công nợ:</span>
                    <span className="font-medium">
                      {(selectedCustomer.currentDebt / 1000000).toFixed(0)}tr /{" "}
                      {(selectedCustomer.debtLimit / 1000000).toFixed(0)}tr
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Điều kiện TT:</span>
                    <span>{selectedCustomer.paymentTerms}</span>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </Card>

        {/* Order Items */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              <h3 className="font-semibold">Sản phẩm</h3>
            </div>
            <Button
              onClick={addOrderItem}
              disabled={!selectedCustomer}
              size="sm"
            >
              <Plus className="mr-2 h-4 w-4" />
              Thêm sản phẩm
            </Button>
          </div>

          {orderItems.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Chưa có sản phẩm nào. Nhấn "Thêm sản phẩm" để bắt đầu
            </div>
          ) : (
            <div className="space-y-4">
              {orderItems.map((item, index) => (
                <Card key={item.id} className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-1 grid gap-4 md:grid-cols-6">
                      <div className="md:col-span-2">
                        <Label className="text-xs">Sản phẩm *</Label>
                        <Select
                          value={item.medicineId}
                          onValueChange={(value) =>
                            updateOrderItem(item.id, "medicineId", value)
                          }
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="--Chọn--" />
                          </SelectTrigger>
                          <SelectContent>
                            {medicines.map((med) => (
                              <SelectItem key={med.id} value={med.id}>
                                {med.name} ({med.code})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-xs">Số lượng *</Label>
                        <Input
                          type="number"
                          value={item.quantity || ""}
                          onChange={(e) =>
                            updateOrderItem(
                              item.id,
                              "quantity",
                              parseInt(e.target.value) || 0,
                            )
                          }
                          className="mt-1"
                          min="0"
                        />
                        {item.quantity > item.availableStock && (
                          <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            Vượt tồn kho
                          </p>
                        )}
                      </div>

                      <div>
                        <Label className="text-xs">Đơn giá</Label>
                        <Input
                          type="text"
                          value={item.unitPrice.toLocaleString("vi-VN")}
                          readOnly
                          className="mt-1 bg-muted"
                        />
                      </div>

                      <div>
                        <Label className="text-xs">Giảm (%)</Label>
                        <Input
                          type="number"
                          value={item.discountPercent || ""}
                          onChange={(e) =>
                            updateOrderItem(
                              item.id,
                              "discountPercent",
                              parseFloat(e.target.value) || 0,
                            )
                          }
                          className="mt-1"
                          min="0"
                          max="100"
                        />
                      </div>

                      <div>
                        <Label className="text-xs">Thành tiền</Label>
                        <Input
                          type="text"
                          value={(item.total / 1000).toFixed(0) + "k"}
                          readOnly
                          className="mt-1 bg-muted font-medium"
                        />
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeOrderItem(item.id)}
                      className="mt-6"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  {item.availableStock > 0 && (
                    <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      Tồn kho: {item.availableStock.toLocaleString(
                        "vi-VN",
                      )}{" "}
                      {item.unit}
                    </p>
                  )}
                </Card>
              ))}
            </div>
          )}
        </Card>

        {/* Order Summary */}
        {orderItems.length > 0 && (
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Calculator className="h-5 w-5" />
              <h3 className="font-semibold">Tổng kết đơn hàng</h3>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Tổng trước giảm giá:
                </span>
                <span className="font-medium">
                  {orderSubtotal.toLocaleString("vi-VN")} VNĐ
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tổng giảm giá:</span>
                <span className="font-medium text-green-600">
                  -{orderTotalDiscount.toLocaleString("vi-VN")} VNĐ
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">VAT (8%):</span>
                <span className="font-medium">
                  {orderVatAmount.toLocaleString("vi-VN")} VNĐ
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>Tổng thanh toán:</span>
                <span className="text-primary">
                  {(orderTotalAmount / 1000000).toFixed(2)}tr VNĐ
                </span>
              </div>
            </div>

            {wouldExceedDebtLimit && (
              <Card className="p-4 bg-red-50 border-red-200 mt-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-red-900">
                      Vượt hạn mức công nợ
                    </p>
                    <p className="text-sm text-red-800 mt-1">
                      Đơn hàng này sẽ làm công nợ vượt quá hạn mức cho phép. Cần
                      chuyển sang thanh toán trước hoặc giảm giá trị đơn hàng.
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </Card>
        )}

        {/* Order Details */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Thông tin đơn hàng</h3>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Ngày yêu cầu giao hàng *</Label>
              <Input
                type="date"
                value={requiredDate}
                onChange={(e) => setRequiredDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Độ ưu tiên</Label>
              <Select
                value={priority}
                onValueChange={(val: any) => setPriority(val)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Thấp</SelectItem>
                  <SelectItem value="medium">Trung bình</SelectItem>
                  <SelectItem value="high">Cao</SelectItem>
                  <SelectItem value="urgent">Khẩn cấp</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Hình thức thanh toán</Label>
              <Select
                value={paymentMethod}
                onValueChange={(val: any) => setPaymentMethod(val)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Tiền mặt</SelectItem>
                  <SelectItem value="transfer">Chuyển khoản</SelectItem>
                  <SelectItem value="credit">Công nợ</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Ghi chú</Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Nhập ghi chú cho đơn hàng..."
                rows={3}
              />
            </div>
          </div>
        </Card>

        {/* Actions */}
        <Card className="p-6">
          <div className="flex justify-between">
            <Link href="/sales/orders">
              <Button variant="outline">Hủy</Button>
            </Link>

            <div className="flex gap-2">
              <Button variant="outline" disabled={!canSubmit}>
                Lưu nháp
              </Button>
              <Button disabled={!canSubmit}>Gửi phê duyệt</Button>
            </div>
          </div>

          {!canSubmit && orderItems.length > 0 && (
            <p className="text-sm text-red-600 mt-4 text-right">
              Vui lòng kiểm tra lại thông tin đơn hàng
            </p>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
