"use client";
import { DashboardLayout } from "@/components/dashboard-layout";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  salesOrdersExtended,
  statusLabelsExtended,
} from "@/lib/sales-mock-data";
import {
  FileText,
  User,
  Package,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default function OrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const order = salesOrdersExtended.find((o) => o.id === params.id);

  if (!order) {
    return notFound();
  }

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      pending_approval: "bg-orange-100 text-orange-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      processing: "bg-blue-100 text-blue-800",
      delivered: "bg-gray-100 text-gray-800",
    };
    return (
      <Badge className={colors[status] || ""}>
        {statusLabelsExtended[status]}
      </Badge>
    );
  };

  return (
    <DashboardLayout
      role="sales_staff"
      breadcrumbs={[
        { label: "Kinh doanh", href: "/sales" },
        { label: "Đơn hàng", href: "/sales/orders" },
        { label: order.code },
      ]}
    >
      <div className="space-y-6">
        <PageHeader
          title={`Đơn hàng ${order.code}`}
          description={`Tạo ngày ${new Date(order.orderDate).toLocaleDateString("vi-VN")}`}
          action={
            <div className="flex gap-2">
              {order.status === "pending_approval" && (
                <Link href={`/sales/approval/${order.id}`}>
                  <Button>Phê duyệt đơn hàng</Button>
                </Link>
              )}
              {order.status === "approved" && <Button>Xuất kho</Button>}
            </div>
          }
        />

        <div className="grid gap-4 md:grid-cols-4">
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Trạng thái</div>
            <div className="mt-2">{getStatusBadge(order.status)}</div>
          </Card>

          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Độ ưu tiên</div>
            <Badge
              variant={
                order.priority === "urgent" || order.priority === "high"
                  ? "destructive"
                  : "outline"
              }
              className="mt-2"
            >
              {statusLabelsExtended[order.priority]}
            </Badge>
          </Card>

          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Tổng tiền</div>
            <div className="text-xl font-bold mt-1">
              {(order.totalAmount / 1000000).toFixed(2)}tr
            </div>
          </Card>

          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Thanh toán</div>
            <div className="mt-1 font-medium">
              {statusLabelsExtended[order.paymentMethod]}
            </div>
          </Card>
        </div>

        <Tabs defaultValue="info" className="space-y-4">
          <TabsList>
            <TabsTrigger value="info">Thông tin chung</TabsTrigger>
            <TabsTrigger value="items">Sản phẩm</TabsTrigger>
            <TabsTrigger value="approval">Phê duyệt</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-4">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <User className="h-5 w-5" />
                <h3 className="font-semibold">Thông tin khách hàng</h3>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Tên khách hàng
                  </p>
                  <p className="font-medium">{order.customer.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {order.customer.code} •{" "}
                    {statusLabelsExtended[order.customer.category]}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Liên hệ</p>
                  <p className="text-sm">{order.customer.phone}</p>
                  <p className="text-sm">{order.customer.email}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">
                    Địa chỉ giao hàng
                  </p>
                  <p className="text-sm">
                    {order.deliveryAddress ||
                      `${order.customer.address}, ${order.customer.district}, ${order.customer.city}`}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">
                    Điều kiện thanh toán
                  </p>
                  <p className="text-sm">{order.customer.paymentTerms}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="h-5 w-5" />
                <h3 className="font-semibold">Thông tin đơn hàng</h3>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Ngày đặt hàng</p>
                  <p className="font-medium">
                    {new Date(order.orderDate).toLocaleDateString("vi-VN")}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">
                    Yêu cầu giao hàng
                  </p>
                  <p className="font-medium text-orange-600">
                    {new Date(order.requiredDeliveryDate).toLocaleDateString(
                      "vi-VN",
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">
                    Nhân viên kinh doanh
                  </p>
                  <p className="font-medium">{order.salesStaffName}</p>
                </div>

                {order.approvedBy && (
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Người phê duyệt
                    </p>
                    <p className="font-medium">{order.approvedBy}</p>
                    <p className="text-xs text-muted-foreground">
                      {order.approvedAt &&
                        new Date(order.approvedAt).toLocaleString("vi-VN")}
                    </p>
                  </div>
                )}
              </div>

              {order.notes && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-muted-foreground">Ghi chú</p>
                  <p className="text-sm mt-1">{order.notes}</p>
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="items" className="space-y-4">
            <Card className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-2 text-sm font-medium">
                        Mã SP
                      </th>
                      <th className="text-left py-3 px-2 text-sm font-medium">
                        Tên sản phẩm
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
                        VAT
                      </th>
                      <th className="text-right py-3 px-2 text-sm font-medium">
                        Thành tiền
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item) => (
                      <tr key={item.id} className="border-b">
                        <td className="py-3 px-2 text-sm">
                          {item.medicineCode}
                        </td>
                        <td className="py-3 px-2 text-sm font-medium">
                          {item.medicineName}
                        </td>
                        <td className="py-3 px-2 text-sm text-right">
                          {item.quantity.toLocaleString("vi-VN")} {item.unit}
                        </td>
                        <td className="py-3 px-2 text-sm text-right">
                          {item.unitPrice.toLocaleString("vi-VN")}
                        </td>
                        <td className="py-3 px-2 text-sm text-right text-green-600">
                          {item.discountPercent}%
                        </td>
                        <td className="py-3 px-2 text-sm text-right">
                          {item.vatAmount.toLocaleString("vi-VN")}
                        </td>
                        <td className="py-3 px-2 text-sm text-right font-medium">
                          {item.total.toLocaleString("vi-VN")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 pt-4 border-t space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Tổng trước giảm giá:
                  </span>
                  <span className="font-medium">
                    {order.subtotal.toLocaleString("vi-VN")} VNĐ
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tổng giảm giá:</span>
                  <span className="font-medium text-green-600">
                    -{order.totalDiscount.toLocaleString("vi-VN")} VNĐ
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">VAT:</span>
                  <span className="font-medium">
                    {order.vatAmount.toLocaleString("vi-VN")} VNĐ
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Tổng thanh toán:</span>
                  <span className="text-primary">
                    {(order.totalAmount / 1000000).toFixed(2)}tr VNĐ
                  </span>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="approval" className="space-y-4">
            {order.approvalHistory && order.approvalHistory.length > 0 ? (
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Lịch sử phê duyệt</h3>
                <div className="space-y-4">
                  {order.approvalHistory.map((approval) => (
                    <div key={approval.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`p-2 rounded-full ${
                            approval.action === "approved"
                              ? "bg-green-100"
                              : "bg-red-100"
                          }`}
                        >
                          {approval.action === "approved" ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-600" />
                          )}
                        </div>
                        <div className="w-0.5 h-full bg-border mt-2" />
                      </div>

                      <div className="flex-1 pb-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium">
                              {approval.approverName}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {approval.approverRole}
                            </p>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {new Date(approval.timestamp).toLocaleString(
                              "vi-VN",
                            )}
                          </p>
                        </div>

                        {approval.comment && (
                          <p className="text-sm mt-2 p-3 bg-muted rounded">
                            {approval.comment}
                          </p>
                        )}

                        {approval.validationChecks &&
                          approval.validationChecks.length > 0 && (
                            <div className="mt-3 space-y-2">
                              {approval.validationChecks.map((check, idx) => (
                                <div
                                  key={idx}
                                  className={`text-sm p-2 rounded flex items-start gap-2 ${
                                    check.status === "passed"
                                      ? "bg-green-50 text-green-800"
                                      : check.status === "warning"
                                        ? "bg-yellow-50 text-yellow-800"
                                        : "bg-red-50 text-red-800"
                                  }`}
                                >
                                  {check.status === "passed" ? (
                                    <CheckCircle className="h-4 w-4 mt-0.5" />
                                  ) : (
                                    <AlertCircle className="h-4 w-4 mt-0.5" />
                                  )}
                                  <span>{check.message}</span>
                                </div>
                              ))}
                            </div>
                          )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ) : (
              <Card className="p-12">
                <div className="flex flex-col items-center justify-center text-center">
                  <Clock className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold">Chờ phê duyệt</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Đơn hàng này chưa được phê duyệt
                  </p>
                </div>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
