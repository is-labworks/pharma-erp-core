"use client";
import { DashboardLayout } from "@/components/dashboard-layout";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { salesOrders, statusLabels } from "@/lib/mock-data";
import { ShoppingBag, AlertCircle, Calendar, Package } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function SalesOrdersPage() {
  const [filter, setFilter] = useState<"all" | "pending" | "planned">("all");

  const filteredOrders =
    filter === "all"
      ? salesOrders
      : salesOrders.filter((so) => so.status === filter);

  return (
    <DashboardLayout
      role="production_planner"
      breadcrumbs={[
        { label: "Tổng quan", href: "/production/overview" },
        { label: "Đơn hàng" },
      ]}
    >
      <div className="space-y-6">
        <PageHeader
          title="Đơn hàng Sản xuất"
          description="Tiếp nhận và quản lý đơn hàng từ phòng Kế hoạch - Kinh doanh"
        />

        <div className="flex gap-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
          >
            Tất cả ({salesOrders.length})
          </Button>
          <Button
            variant={filter === "pending" ? "default" : "outline"}
            onClick={() => setFilter("pending")}
          >
            Chờ xử lý (
            {salesOrders.filter((so) => so.status === "pending").length})
          </Button>
          <Button
            variant={filter === "planned" ? "default" : "outline"}
            onClick={() => setFilter("planned")}
          >
            Đã lập kế hoạch (
            {salesOrders.filter((so) => so.status === "planned").length})
          </Button>
        </div>

        <div className="grid gap-6">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="p-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold">{order.code}</h3>
                      <Badge
                        variant={
                          order.status === "pending"
                            ? "default"
                            : order.status === "planned"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {statusLabels[order.status]}
                      </Badge>
                      <Badge
                        variant={
                          order.priority === "urgent" ||
                          order.priority === "high"
                            ? "destructive"
                            : "outline"
                        }
                      >
                        {statusLabels[order.priority]}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {order.customerName}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      <Calendar className="mr-1 inline h-4 w-4" />
                      Ngày đặt:{" "}
                      {new Date(order.orderDate).toLocaleDateString("vi-VN")}
                    </p>
                    <p className="text-sm font-medium text-orange-600">
                      <AlertCircle className="mr-1 inline h-4 w-4" />
                      Yêu cầu:{" "}
                      {new Date(order.requiredDate).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                </div>

                <div className="rounded-md border">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="px-4 py-2 text-left text-sm font-medium">
                            Mã thuốc
                          </th>
                          <th className="px-4 py-2 text-left text-sm font-medium">
                            Tên sản phẩm
                          </th>
                          <th className="px-4 py-2 text-right text-sm font-medium">
                            Số lượng
                          </th>
                          <th className="px-4 py-2 text-center text-sm font-medium">
                            Đơn vị
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.items.map((item) => (
                          <tr key={item.id} className="border-t">
                            <td className="px-4 py-3 text-sm">
                              {item.medicineCode}
                            </td>
                            <td className="px-4 py-3 text-sm font-medium">
                              {item.medicineName}
                            </td>
                            <td className="px-4 py-3 text-right text-sm">
                              {item.quantity.toLocaleString("vi-VN")}
                            </td>
                            <td className="px-4 py-3 text-center text-sm">
                              {item.unit}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {order.notes && (
                  <div className="rounded-md bg-yellow-50 p-3 dark:bg-yellow-950">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      <AlertCircle className="mr-2 inline h-4 w-4" />
                      <strong>Ghi chú:</strong> {order.notes}
                    </p>
                  </div>
                )}

                <div className="flex justify-end gap-2">
                  {order.status === "pending" && (
                    <Link href="/production/quantity-planning">
                      <Button>
                        <Package className="mr-2 h-4 w-4" />
                        Lập kế hoạch sản xuất
                      </Button>
                    </Link>
                  )}
                  {order.status === "planned" && (
                    <Link href="/production/schedule">
                      <Button variant="outline">Xem kế hoạch sản xuất</Button>
                    </Link>
                  )}
                </div>
              </div>
            </Card>
          ))}

          {filteredOrders.length === 0 && (
            <Card className="p-12">
              <div className="flex flex-col items-center justify-center text-center">
                <ShoppingBag className="h-16 w-16 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">
                  Không có đơn hàng
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Không tìm thấy đơn hàng nào với bộ lọc hiện tại
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
