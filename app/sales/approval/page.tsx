"use client";
import { DashboardLayout } from "@/components/dashboard-layout";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  salesOrdersExtended,
  statusLabelsExtended,
} from "@/lib/sales-mock-data";
import {
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Package,
  User,
  DollarSign,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ApprovalPage() {
  const [showOnlyPending, setShowOnlyPending] = useState(true);

  const pendingOrders = salesOrdersExtended.filter(
    (o) => o.status === "pending_approval",
  );
  const approvedOrders = salesOrdersExtended.filter(
    (o) => o.status === "approved",
  );
  const rejectedOrders = salesOrdersExtended.filter(
    (o) => o.status === "rejected",
  );

  const displayOrders = showOnlyPending ? pendingOrders : salesOrdersExtended;

  return (
    <DashboardLayout
      role="sales_manager"
      breadcrumbs={[
        { label: "Kinh doanh", href: "/sales" },
        { label: "Phê duyệt đơn hàng" },
      ]}
    >
      <div className="space-y-6">
        <PageHeader
          title="Phê duyệt Đơn hàng"
          description="Xét duyệt đơn hàng từ nhân viên kinh doanh"
        />

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Chờ phê duyệt
                </p>
                <h3 className="text-3xl font-bold mt-1 text-orange-600">
                  {pendingOrders.length}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">Cần xử lý</p>
              </div>
              <Clock className="h-10 w-10 text-orange-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Đã phê duyệt
                </p>
                <h3 className="text-3xl font-bold mt-1 text-green-600">
                  {approvedOrders.length}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">Hôm nay</p>
              </div>
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Từ chối
                </p>
                <h3 className="text-3xl font-bold mt-1 text-red-600">
                  {rejectedOrders.length}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">Hôm nay</p>
              </div>
              <XCircle className="h-10 w-10 text-red-600" />
            </div>
          </Card>
        </div>

        {/* Filter */}
        <Card className="p-4">
          <div className="flex gap-2">
            <Button
              variant={showOnlyPending ? "default" : "outline"}
              onClick={() => setShowOnlyPending(true)}
              size="sm"
            >
              Chỉ chờ duyệt ({pendingOrders.length})
            </Button>
            <Button
              variant={!showOnlyPending ? "default" : "outline"}
              onClick={() => setShowOnlyPending(false)}
              size="sm"
            >
              Tất cả
            </Button>
          </div>
        </Card>

        {/* Orders List */}
        <div className="grid gap-4">
          {displayOrders.map((order) => {
            // Calculate validation warnings
            const warnings = [];

            // Check inventory
            const hasInventoryIssue = order.items.some(
              (item) => item.quantity > item.availableStock,
            );
            if (hasInventoryIssue) {
              warnings.push("Vượt tồn kho");
            }

            // Check debt limit
            const newDebt = order.customer.currentDebt + order.totalAmount;
            const wouldExceedDebt = newDebt > order.customer.debtLimit;
            if (wouldExceedDebt && order.paymentMethod === "credit") {
              warnings.push("Vượt hạn mức công nợ");
            }

            // Check debt status
            if (
              order.customer.debtStatus === "overdue" ||
              order.customer.debtStatus === "blocked"
            ) {
              warnings.push("Khách hàng có công nợ quá hạn");
            }

            return (
              <Card
                key={order.id}
                className={`p-6 ${
                  warnings.length > 0 ? "border-orange-300 bg-orange-50/30" : ""
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-semibold">{order.code}</h3>
                      <Badge
                        className={
                          order.status === "pending_approval"
                            ? "bg-orange-100 text-orange-800"
                            : order.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                        }
                      >
                        {statusLabelsExtended[order.status]}
                      </Badge>
                      <Badge
                        variant={
                          order.priority === "urgent" ||
                          order.priority === "high"
                            ? "destructive"
                            : "outline"
                        }
                      >
                        {statusLabelsExtended[order.priority]}
                      </Badge>
                    </div>

                    {/* Warnings */}
                    {warnings.length > 0 && (
                      <div className="mb-3 p-3 bg-orange-100 border border-orange-300 rounded">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
                          <div>
                            <p className="font-medium text-orange-900 text-sm">
                              Cảnh báo kiểm tra
                            </p>
                            <ul className="text-sm text-orange-800 mt-1 list-disc list-inside">
                              {warnings.map((warning, idx) => (
                                <li key={idx}>{warning}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="flex items-start gap-3">
                        <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Khách hàng
                          </p>
                          <p className="text-sm font-medium">
                            {order.customer.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {statusLabelsExtended[order.customer.category]}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Package className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Sản phẩm
                          </p>
                          <p className="text-sm font-medium">
                            {order.items.length} mặt hàng
                          </p>
                          <p className="text-xs text-muted-foreground">
                            SL:{" "}
                            {order.items
                              .reduce((sum, i) => sum + i.quantity, 0)
                              .toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <DollarSign className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Tổng tiền
                          </p>
                          <p className="text-lg font-bold">
                            {(order.totalAmount / 1000000).toFixed(2)}tr
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {statusLabelsExtended[order.paymentMethod]}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Nhân viên KD
                        </p>
                        <p className="text-sm font-medium">
                          {order.salesStaffName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(order.orderDate).toLocaleDateString(
                            "vi-VN",
                          )}
                        </p>
                      </div>
                    </div>

                    {order.notes && (
                      <div className="mt-3 pt-3 border-t">
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium">Ghi chú:</span>{" "}
                          {order.notes}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <Link href={`/sales/approval/${order.id}`}>
                      <Button
                        variant={
                          order.status === "pending_approval"
                            ? "default"
                            : "outline"
                        }
                      >
                        {order.status === "pending_approval"
                          ? "Xét duyệt"
                          : "Xem chi tiết"}
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            );
          })}

          {displayOrders.length === 0 && (
            <Card className="p-12">
              <div className="flex flex-col items-center justify-center text-center">
                <CheckCircle className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold">
                  Không có đơn hàng cần phê duyệt
                </h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Tất cả đơn hàng đã được xử lý
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
