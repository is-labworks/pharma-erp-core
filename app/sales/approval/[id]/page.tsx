"use client";
import { DashboardLayout } from "@/components/dashboard-layout";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  salesOrdersExtended,
  statusLabelsExtended,
} from "@/lib/sales-mock-data";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  User,
  Package,
  DollarSign,
  FileText,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useState } from "react";

export default function ApprovalDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const order = salesOrdersExtended.find((o) => o.id === params.id);
  const [comment, setComment] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  if (!order) {
    return notFound();
  }

  // Validation checks
  const validationResults = [
    {
      check: "Tồn kho",
      status: order.items.every((item) => item.quantity <= item.availableStock)
        ? "passed"
        : "warning",
      message: order.items.every((item) => item.quantity <= item.availableStock)
        ? "Tất cả sản phẩm đều có đủ tồn kho"
        : "Một số sản phẩm vượt quá tồn kho hiện có",
    },
    {
      check: "Hạn mức công nợ",
      status:
        order.paymentMethod !== "credit" ||
        order.customer.currentDebt + order.totalAmount <=
          order.customer.debtLimit
          ? "passed"
          : "failed",
      message:
        order.paymentMethod !== "credit"
          ? "Thanh toán trước, không ảnh hưởng công nợ"
          : order.customer.currentDebt + order.totalAmount <=
              order.customer.debtLimit
            ? `Trong hạn mức: ${((order.customer.currentDebt + order.totalAmount) / 1000000).toFixed(1)}tr / ${(order.customer.debtLimit / 1000000).toFixed(0)}tr`
            : `Vượt hạn mức: ${((order.customer.currentDebt + order.totalAmount) / 1000000).toFixed(1)}tr / ${(order.customer.debtLimit / 1000000).toFixed(0)}tr`,
    },
    {
      check: "Trạng thái công nợ KH",
      status:
        order.customer.debtStatus === "good" ||
        order.customer.debtStatus === "warning"
          ? "passed"
          : "warning",
      message:
        order.customer.debtStatus === "good"
          ? "Khách hàng có lịch sử thanh toán tốt"
          : order.customer.debtStatus === "warning"
            ? "Khách hàng đang ở mức cảnh báo"
            : "Khách hàng có công nợ quá hạn hoặc bị khóa",
    },
    {
      check: "Giá bán",
      status: "passed",
      message: "Giá bán phù hợp với bảng giá hiện hành",
    },
    {
      check: "Chiết khấu",
      status: order.items.every((item) => item.discountPercent <= 20)
        ? "passed"
        : "warning",
      message: order.items.every((item) => item.discountPercent <= 20)
        ? "Chiết khấu trong mức cho phép"
        : "Một số sản phẩm có chiết khấu vượt mức",
    },
  ];

  const hasFailedChecks = validationResults.some((v) => v.status === "failed");
  const hasWarnings = validationResults.some((v) => v.status === "warning");

  const handleApprove = () => {
    setIsProcessing(true);
    // In real app: API call to approve order
    console.log("Approving order:", order.id, "Comment:", comment);
    setTimeout(() => {
      alert("Đơn hàng đã được phê duyệt!");
      window.location.href = "/sales/approval";
    }, 1000);
  };

  const handleReject = () => {
    if (!comment.trim()) {
      alert("Vui lòng nhập lý do từ chối");
      return;
    }
    setIsProcessing(true);
    // In real app: API call to reject order
    console.log("Rejecting order:", order.id, "Comment:", comment);
    setTimeout(() => {
      alert("Đơn hàng đã bị từ chối!");
      window.location.href = "/sales/approval";
    }, 1000);
  };

  return (
    <DashboardLayout
      role="sales_manager"
      breadcrumbs={[
        { label: "Kinh doanh", href: "/sales" },
        { label: "Phê duyệt", href: "/sales/approval" },
        { label: order.code },
      ]}
    >
      <div className="space-y-6">
        <PageHeader
          title={`Phê duyệt đơn hàng ${order.code}`}
          description={`Ngày tạo: ${new Date(order.orderDate).toLocaleDateString("vi-VN")}`}
        />

        {/* Status Banner */}
        {order.status === "pending_approval" && (
          <Card className="p-6 bg-orange-50 border-orange-200">
            <div className="flex items-start gap-4">
              <Clock className="h-6 w-6 text-orange-600 mt-1" />
              <div className="flex-1">
                <h3 className="font-semibold text-orange-900">
                  Đơn hàng chờ phê duyệt
                </h3>
                <p className="text-sm text-orange-800 mt-1">
                  Vui lòng kiểm tra kỹ thông tin trước khi phê duyệt
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Validation Checks */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Kiểm tra tự động
          </h3>

          <div className="space-y-3">
            {validationResults.map((result, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg border ${
                  result.status === "passed"
                    ? "bg-green-50 border-green-200"
                    : result.status === "warning"
                      ? "bg-yellow-50 border-yellow-200"
                      : "bg-red-50 border-red-200"
                }`}
              >
                <div className="flex items-start gap-3">
                  {result.status === "passed" ? (
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  ) : result.status === "warning" ? (
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-sm">{result.check}</p>
                    <p
                      className={`text-sm mt-1 ${
                        result.status === "passed"
                          ? "text-green-800"
                          : result.status === "warning"
                            ? "text-yellow-800"
                            : "text-red-800"
                      }`}
                    >
                      {result.message}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {hasFailedChecks && (
            <div className="mt-4 p-4 bg-red-100 border border-red-300 rounded">
              <p className="text-sm font-medium text-red-900">
                ⚠️ Đơn hàng có vấn đề nghiêm trọng. Khuyến nghị từ chối hoặc yêu
                cầu điều chỉnh.
              </p>
            </div>
          )}
        </Card>

        {/* Order Summary */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <User className="h-5 w-5" />
              <h3 className="font-semibold">Thông tin khách hàng</h3>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Tên khách hàng</p>
                <p className="font-medium">{order.customer.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Loại khách hàng</p>
                <Badge variant="outline">
                  {statusLabelsExtended[order.customer.category]}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Công nợ hiện tại
                </p>
                <p className="font-medium">
                  {(order.customer.currentDebt / 1000000).toFixed(1)}tr /{" "}
                  {(order.customer.debtLimit / 1000000).toFixed(0)}tr
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Điều kiện thanh toán
                </p>
                <p className="font-medium">{order.customer.paymentTerms}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="h-5 w-5" />
              <h3 className="font-semibold">Thông tin thanh toán</h3>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Tổng trước giảm giá
                </span>
                <span className="font-medium">
                  {order.subtotal.toLocaleString("vi-VN")} VNĐ
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Giảm giá</span>
                <span className="font-medium text-green-600">
                  -{order.totalDiscount.toLocaleString("vi-VN")} VNĐ
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">VAT</span>
                <span className="font-medium">
                  {order.vatAmount.toLocaleString("vi-VN")} VNĐ
                </span>
              </div>
              <div className="flex justify-between pt-3 border-t">
                <span className="font-semibold">Tổng thanh toán</span>
                <span className="text-xl font-bold text-primary">
                  {(order.totalAmount / 1000000).toFixed(2)}tr VNĐ
                </span>
              </div>
              <div className="pt-3 border-t">
                <p className="text-sm text-muted-foreground">
                  Hình thức thanh toán
                </p>
                <Badge className="mt-1">
                  {statusLabelsExtended[order.paymentMethod]}
                </Badge>
              </div>
            </div>
          </Card>
        </div>

        {/* Order Items */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Package className="h-5 w-5" />
            <h3 className="font-semibold">Danh sách sản phẩm</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2 text-sm font-medium">
                    STT
                  </th>
                  <th className="text-left py-3 px-2 text-sm font-medium">
                    Sản phẩm
                  </th>
                  <th className="text-right py-3 px-2 text-sm font-medium">
                    SL
                  </th>
                  <th className="text-right py-3 px-2 text-sm font-medium">
                    Đơn giá
                  </th>
                  <th className="text-right py-3 px-2 text-sm font-medium">
                    Giảm
                  </th>
                  <th className="text-right py-3 px-2 text-sm font-medium">
                    Thành tiền
                  </th>
                  <th className="text-center py-3 px-2 text-sm font-medium">
                    Tồn kho
                  </th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, idx) => (
                  <tr key={item.id} className="border-b">
                    <td className="py-3 px-2 text-sm">{idx + 1}</td>
                    <td className="py-3 px-2">
                      <p className="text-sm font-medium">{item.medicineName}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.medicineCode}
                      </p>
                    </td>
                    <td className="py-3 px-2 text-sm text-right">
                      {item.quantity.toLocaleString()} {item.unit}
                    </td>
                    <td className="py-3 px-2 text-sm text-right">
                      {item.unitPrice.toLocaleString()}
                    </td>
                    <td className="py-3 px-2 text-sm text-right text-green-600">
                      {item.discountPercent}%
                    </td>
                    <td className="py-3 px-2 text-sm text-right font-medium">
                      {item.total.toLocaleString()}
                    </td>
                    <td className="py-3 px-2 text-center">
                      {item.quantity <= item.availableStock ? (
                        <Badge variant="outline" className="bg-green-50">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          {item.availableStock.toLocaleString()}
                        </Badge>
                      ) : (
                        <Badge variant="destructive">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Thiếu{" "}
                          {(
                            item.quantity - item.availableStock
                          ).toLocaleString()}
                        </Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Approval Actions */}
        {order.status === "pending_approval" && (
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Quyết định phê duyệt</h3>

            <div className="space-y-4">
              <div>
                <Label>Ý kiến phê duyệt</Label>
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Nhập ý kiến của bạn về đơn hàng này..."
                  rows={4}
                  className="mt-2"
                />
              </div>

              <div className="flex justify-between gap-4">
                <Link href="/sales/approval">
                  <Button variant="outline">Quay lại</Button>
                </Link>

                <div className="flex gap-3">
                  <Button
                    variant="destructive"
                    onClick={handleReject}
                    disabled={isProcessing}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Từ chối
                  </Button>
                  <Button
                    onClick={handleApprove}
                    disabled={isProcessing || hasFailedChecks}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Phê duyệt
                  </Button>
                </div>
              </div>

              {hasFailedChecks && (
                <p className="text-sm text-red-600 text-right">
                  * Không thể phê duyệt do có lỗi nghiêm trọng
                </p>
              )}
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
