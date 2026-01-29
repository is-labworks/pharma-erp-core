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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  salesOrdersExtended,
  statusLabelsExtended,
} from "@/lib/sales-mock-data";
import {
  FileText,
  DollarSign,
  CheckCircle,
  Clock,
  Printer,
  Download,
  CreditCard,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useState } from "react";

export default function InvoiceDetailPage({
  params,
}: {
  params: { id: string };
}) {
  // Mock invoice from order
  const orderId = params.id.replace("inv-", "");
  const order = salesOrdersExtended.find((o) => o.id === orderId);

  if (!order) {
    return notFound();
  }

  const invoice = {
    id: params.id,
    invoiceNumber: `HD-${order.code.replace("DH-", "")}`,
    orderId: order.id,
    orderCode: order.code,
    customer: order.customer,
    items: order.items,
    subtotal: order.subtotal,
    totalDiscount: order.totalDiscount,
    vatAmount: order.vatAmount,
    totalAmount: order.totalAmount,
    paidAmount: order.status === "completed" ? order.totalAmount : 0,
    remainingAmount: order.status === "completed" ? 0 : order.totalAmount,
    status:
      order.status === "completed" ? ("paid" as const) : ("unpaid" as const),
    invoiceDate: order.orderDate,
    dueDate: new Date(
      new Date(order.orderDate).getTime() + 30 * 24 * 60 * 60 * 1000,
    ).toISOString(),
    paymentMethod: order.paymentMethod,
  };

  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [paymentData, setPaymentData] = useState({
    amount: invoice.remainingAmount.toString(),
    method: "bank_transfer" as "cash" | "bank_transfer" | "check",
    reference: "",
    date: new Date().toISOString().split("T")[0],
    notes: "",
  });

  const handlePayment = () => {
    console.log("Recording payment:", paymentData);
    alert("Đã ghi nhận thanh toán thành công!");
    setPaymentDialogOpen(false);
    window.location.reload();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Đã thanh toán
          </Badge>
        );
      case "unpaid":
        return (
          <Badge className="bg-orange-100 text-orange-800">
            <Clock className="h-3 w-3 mr-1" />
            Chưa thanh toán
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <DashboardLayout
      role="sales_staff"
      breadcrumbs={[
        { label: "Kinh doanh", href: "/sales" },
        { label: "Hóa đơn", href: "/sales/invoices" },
        { label: invoice.invoiceNumber },
      ]}
    >
      <div className="space-y-6">
        <PageHeader
          title={`Hóa đơn ${invoice.invoiceNumber}`}
          description={`Liên kết đơn hàng: ${invoice.orderCode}`}
        />

        {/* Actions Bar */}
        <Card className="p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              {getStatusBadge(invoice.status)}
              <span className="text-sm text-muted-foreground">
                Ngày:{" "}
                {new Date(invoice.invoiceDate).toLocaleDateString("vi-VN")}
              </span>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Printer className="mr-2 h-4 w-4" />
                In hóa đơn
              </Button>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Xuất PDF
              </Button>
              {invoice.status === "unpaid" && (
                <Dialog
                  open={paymentDialogOpen}
                  onOpenChange={setPaymentDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <DollarSign className="mr-2 h-4 w-4" />
                      Ghi nhận thanh toán
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Ghi nhận thanh toán</DialogTitle>
                      <DialogDescription>
                        Nhập thông tin thanh toán từ khách hàng
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Số tiền thanh toán (VNĐ)</Label>
                        <Input
                          type="number"
                          value={paymentData.amount}
                          onChange={(e) =>
                            setPaymentData({
                              ...paymentData,
                              amount: e.target.value,
                            })
                          }
                          placeholder="0"
                        />
                        <p className="text-xs text-muted-foreground">
                          Còn lại:{" "}
                          {(invoice.remainingAmount / 1000000).toFixed(2)}tr VNĐ
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label>Hình thức thanh toán</Label>
                        <Select
                          value={paymentData.method}
                          onValueChange={(val: any) =>
                            setPaymentData({ ...paymentData, method: val })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cash">Tiền mặt</SelectItem>
                            <SelectItem value="bank_transfer">
                              Chuyển khoản
                            </SelectItem>
                            <SelectItem value="check">Séc</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Mã tham chiếu / Số GD</Label>
                        <Input
                          value={paymentData.reference}
                          onChange={(e) =>
                            setPaymentData({
                              ...paymentData,
                              reference: e.target.value,
                            })
                          }
                          placeholder="FT123456789 hoặc số séc"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Ngày thanh toán</Label>
                        <Input
                          type="date"
                          value={paymentData.date}
                          onChange={(e) =>
                            setPaymentData({
                              ...paymentData,
                              date: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Ghi chú</Label>
                        <Textarea
                          value={paymentData.notes}
                          onChange={(e) =>
                            setPaymentData({
                              ...paymentData,
                              notes: e.target.value,
                            })
                          }
                          placeholder="Ghi chú về khoản thanh toán..."
                          rows={3}
                        />
                      </div>
                    </div>

                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setPaymentDialogOpen(false)}
                      >
                        Hủy
                      </Button>
                      <Button onClick={handlePayment}>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Xác nhận
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        </Card>

        {/* Invoice Header */}
        <Card className="p-8 bg-gradient-to-br from-blue-50 to-white">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-2xl font-bold text-primary mb-2">
                HÓA ĐƠN BÁN HÀNG
              </h2>
              <p className="text-lg font-semibold">{invoice.invoiceNumber}</p>
              <p className="text-sm text-muted-foreground mt-1">
                Đơn hàng: {invoice.orderCode}
              </p>
            </div>

            <div className="text-right">
              <p className="text-sm text-muted-foreground">Ngày hóa đơn</p>
              <p className="font-semibold">
                {new Date(invoice.invoiceDate).toLocaleDateString("vi-VN")}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Hạn thanh toán
              </p>
              <p className="font-semibold">
                {new Date(invoice.dueDate).toLocaleDateString("vi-VN")}
              </p>
            </div>
          </div>
        </Card>

        {/* Customer & Company Info */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="p-6">
            <h3 className="font-semibold mb-3">Khách hàng</h3>
            <div className="space-y-1">
              <p className="font-medium">{invoice.customer.name}</p>
              <p className="text-sm">MST: {invoice.customer.taxCode}</p>
              <p className="text-sm">
                {invoice.customer.address}, {invoice.customer.district}
              </p>
              <p className="text-sm">{invoice.customer.city}</p>
              <p className="text-sm">ĐT: {invoice.customer.phone}</p>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-3">Người bán</h3>
            <div className="space-y-1">
              <p className="font-medium">Công ty CP Dược Hậu Giang</p>
              <p className="text-sm">MST: 0301234567</p>
              <p className="text-sm">288 Bis Nguyễn Văn Cừ, P. An Hòa</p>
              <p className="text-sm">TP. Cần Thơ</p>
              <p className="text-sm">ĐT: 0292-3891-433</p>
            </div>
          </Card>
        </div>

        {/* Invoice Items */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Chi tiết hóa đơn</h3>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2">
                  <th className="text-left py-3 px-2 text-sm font-medium">
                    STT
                  </th>
                  <th className="text-left py-3 px-2 text-sm font-medium">
                    Tên hàng hóa, dịch vụ
                  </th>
                  <th className="text-center py-3 px-2 text-sm font-medium">
                    ĐVT
                  </th>
                  <th className="text-right py-3 px-2 text-sm font-medium">
                    SL
                  </th>
                  <th className="text-right py-3 px-2 text-sm font-medium">
                    Đơn giá
                  </th>
                  <th className="text-right py-3 px-2 text-sm font-medium">
                    Thành tiền
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, idx) => (
                  <tr key={item.id} className="border-b">
                    <td className="py-3 px-2 text-sm">{idx + 1}</td>
                    <td className="py-3 px-2">
                      <p className="text-sm font-medium">{item.medicineName}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.medicineCode}
                      </p>
                    </td>
                    <td className="py-3 px-2 text-sm text-center">
                      {item.unit}
                    </td>
                    <td className="py-3 px-2 text-sm text-right">
                      {item.quantity.toLocaleString()}
                    </td>
                    <td className="py-3 px-2 text-sm text-right">
                      {item.unitPrice.toLocaleString()}
                    </td>
                    <td className="py-3 px-2 text-sm text-right font-medium">
                      {item.subtotal.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 pt-4 border-t-2 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tổng cộng:</span>
              <span className="font-medium">
                {invoice.subtotal.toLocaleString()} VNĐ
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Chiết khấu:</span>
              <span className="font-medium text-green-600">
                -{invoice.totalDiscount.toLocaleString()} VNĐ
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Thuế GTGT (8%):</span>
              <span className="font-medium">
                {invoice.vatAmount.toLocaleString()} VNĐ
              </span>
            </div>
            <div className="flex justify-between text-lg font-bold pt-2 border-t">
              <span>Tổng thanh toán:</span>
              <span className="text-primary">
                {invoice.totalAmount.toLocaleString()} VNĐ
              </span>
            </div>
          </div>
        </Card>

        {/* Payment Status */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Trạng thái thanh toán</h3>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-muted-foreground">Tổng hóa đơn</p>
              <p className="text-2xl font-bold mt-1">
                {(invoice.totalAmount / 1000000).toFixed(2)}tr
              </p>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-muted-foreground">Đã thanh toán</p>
              <p className="text-2xl font-bold mt-1 text-green-600">
                {(invoice.paidAmount / 1000000).toFixed(2)}tr
              </p>
            </div>

            <div
              className={`p-4 rounded-lg ${
                invoice.remainingAmount > 0 ? "bg-orange-50" : "bg-gray-50"
              }`}
            >
              <p className="text-sm text-muted-foreground">Còn lại</p>
              <p
                className={`text-2xl font-bold mt-1 ${
                  invoice.remainingAmount > 0
                    ? "text-orange-600"
                    : "text-gray-600"
                }`}
              >
                {(invoice.remainingAmount / 1000000).toFixed(2)}tr
              </p>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
