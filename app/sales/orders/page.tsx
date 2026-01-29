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
  ShoppingCart,
  Plus,
  AlertCircle,
  Clock,
  CheckCircle,
  Truck,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { OrderStatus } from "@/lib/sales-types";

export default function OrdersPage() {
  const [statusFilter, setStatusFilter] = useState<"all" | OrderStatus>("all");

  const filteredOrders =
    statusFilter === "all"
      ? salesOrdersExtended
      : salesOrdersExtended.filter((o) => o.status === statusFilter);

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case "pending_approval":
        return <Clock className="h-4 w-4" />;
      case "approved":
        return <CheckCircle className="h-4 w-4" />;
      case "shipped":
        return <Truck className="h-4 w-4" />;
      case "delivered":
        return <CheckCircle className="h-4 w-4" />;
      case "invoiced":
        return <FileText className="h-4 w-4" />;
      default:
        return <ShoppingCart className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "pending_approval":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "approved":
        return "bg-green-50 text-green-700 border-green-200";
      case "rejected":
        return "bg-red-50 text-red-700 border-red-200";
      case "shipped":
      case "delivered":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "completed":
        return "bg-gray-50 text-gray-700 border-gray-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <DashboardLayout
      role="sales_staff"
      breadcrumbs={[
        { label: "Kinh doanh", href: "/sales" },
        { label: "Đơn hàng" },
      ]}
    >
      <div className="space-y-6">
        <PageHeader
          title="Quản lý Đơn hàng"
          description="Danh sách đơn hàng bán và trạng thái xử lý"
          action={
            <Link href="/sales/orders/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Tạo đơn hàng mới
              </Button>
            </Link>
          }
        />

        <Card className="p-6">
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={statusFilter === "all" ? "default" : "outline"}
              onClick={() => setStatusFilter("all")}
              size="sm"
            >
              Tất cả ({salesOrdersExtended.length})
            </Button>
            <Button
              variant={
                statusFilter === "pending_approval" ? "default" : "outline"
              }
              onClick={() => setStatusFilter("pending_approval")}
              size="sm"
            >
              Chờ phê duyệt (
              {
                salesOrdersExtended.filter(
                  (o) => o.status === "pending_approval",
                ).length
              }
              )
            </Button>
            <Button
              variant={statusFilter === "approved" ? "default" : "outline"}
              onClick={() => setStatusFilter("approved")}
              size="sm"
            >
              Đã phê duyệt (
              {
                salesOrdersExtended.filter((o) => o.status === "approved")
                  .length
              }
              )
            </Button>
            <Button
              variant={statusFilter === "shipped" ? "default" : "outline"}
              onClick={() => setStatusFilter("shipped")}
              size="sm"
            >
              Đã xuất kho (
              {salesOrdersExtended.filter((o) => o.status === "shipped").length}
              )
            </Button>
            <Button
              variant={statusFilter === "delivered" ? "default" : "outline"}
              onClick={() => setStatusFilter("delivered")}
              size="sm"
            >
              Đã giao (
              {
                salesOrdersExtended.filter((o) => o.status === "delivered")
                  .length
              }
              )
            </Button>
          </div>
        </Card>

        <div className="grid gap-4">
          {filteredOrders.map((order) => (
            <Card
              key={order.id}
              className="p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-lg font-semibold">{order.code}</h3>
                    <Badge className={getStatusColor(order.status)}>
                      {getStatusIcon(order.status)}
                      <span className="ml-1">
                        {statusLabelsExtended[order.status]}
                      </span>
                    </Badge>
                    <Badge
                      variant={
                        order.priority === "urgent" || order.priority === "high"
                          ? "destructive"
                          : "outline"
                      }
                    >
                      {statusLabelsExtended[order.priority]}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Ngày đặt / Yêu cầu giao
                      </p>
                      <p className="text-sm">
                        {new Date(order.orderDate).toLocaleDateString("vi-VN")}
                      </p>
                      <p className="text-sm text-orange-600">
                        {new Date(
                          order.requiredDeliveryDate,
                        ).toLocaleDateString("vi-VN")}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Tổng tiền
                      </p>
                      <p className="text-lg font-bold">
                        {(order.totalAmount / 1000000).toFixed(2)}tr VNĐ
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {order.items.length} sản phẩm
                      </p>
                    </div>
                  </div>

                  {order.notes && (
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-sm flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5" />
                        <span className="text-muted-foreground">
                          {order.notes}
                        </span>
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  <Link href={`/sales/orders/${order.id}`}>
                    <Button variant="outline" size="sm">
                      Xem chi tiết
                    </Button>
                  </Link>
                  {order.status === "approved" && (
                    <Button size="sm">Xuất kho</Button>
                  )}
                </div>
              </div>
            </Card>
          ))}

          {filteredOrders.length === 0 && (
            <Card className="p-12">
              <div className="flex flex-col items-center justify-center text-center">
                <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold">Không có đơn hàng</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Không tìm thấy đơn hàng với bộ lọc hiện tại
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
