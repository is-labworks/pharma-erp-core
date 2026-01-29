"use client";
import { DashboardLayout } from "@/components/dashboard-layout";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  customers,
  salesOrdersExtended,
  statusLabelsExtended,
} from "@/lib/sales-mock-data";
import { statusLabels } from "@/lib/mock-data";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  FileText,
  DollarSign,
  ShoppingCart,
  Edit,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default function CustomerDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const customer = customers.find((c) => c.id === params.id);

  if (!customer) {
    return notFound();
  }

  const customerOrders = salesOrdersExtended.filter(
    (o) => o.customerId === customer.id,
  );

  const getDebtPercentage = () => {
    return (customer.currentDebt / customer.debtLimit) * 100;
  };

  return (
    <DashboardLayout
      role="sales_staff"
      breadcrumbs={[
        { label: "Kinh doanh", href: "/sales" },
        { label: "Khách hàng", href: "/sales/customers" },
        { label: customer.name },
      ]}
    >
      <div className="space-y-6">
        <PageHeader
          title={customer.name}
          description={`Mã KH: ${customer.code} • ${statusLabels[customer.category]}`}
        >
          <div className="flex gap-2">
            <Link href={`/sales/customers/${customer.id}/edit`}>
              <Button variant="outline">
                <Edit className="mr-2 h-4 w-4" />
                Chỉnh sửa
              </Button>
            </Link>
            <Link href={`/sales/orders/new?customerId=${customer.id}`}>
              <Button>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Tạo đơn hàng
              </Button>
            </Link>
          </div>
        </PageHeader>

        {/* Status Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Trạng thái
                </p>
                <div className="mt-2">
                  {customer.status === "active" ? (
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="mr-1 h-3 w-3" />
                      {statusLabels[customer.status]}
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      {statusLabels[customer.status]}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Tổng đơn hàng
                </p>
                <h3 className="text-2xl font-bold mt-1">
                  {customer.totalOrders}
                </h3>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Tổng doanh thu
                </p>
                <h3 className="text-2xl font-bold mt-1">
                  {(customer.totalRevenue / 1000000).toFixed(0)}tr
                </h3>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </Card>
        </div>

        {/* Debt Warning */}
        {(customer.debtStatus === "warning" ||
          customer.debtStatus === "overdue") && (
          <Card className="p-6 border-orange-200 bg-orange-50 dark:bg-orange-950">
            <div className="flex items-start gap-4">
              <AlertCircle className="h-6 w-6 text-orange-600 mt-1" />
              <div>
                <h3 className="font-semibold text-orange-900 dark:text-orange-100">
                  Cảnh báo công nợ
                </h3>
                <p className="text-sm text-orange-800 dark:text-orange-200 mt-1">
                  Khách hàng đang sử dụng {getDebtPercentage().toFixed(0)}% hạn
                  mức công nợ.
                  {customer.debtStatus === "overdue" &&
                    " Có công nợ quá hạn cần xử lý."}
                </p>
              </div>
            </div>
          </Card>
        )}

        <Tabs defaultValue="info" className="space-y-4">
          <TabsList>
            <TabsTrigger value="info">Thông tin</TabsTrigger>
            <TabsTrigger value="orders">Lịch sử đơn hàng</TabsTrigger>
            <TabsTrigger value="debt">Công nợ</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-4">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Thông tin liên hệ</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-start gap-3">
                  <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Loại khách hàng</p>
                    <p className="text-sm text-muted-foreground">
                      {statusLabels[customer.category]}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Mã số thuế</p>
                    <p className="text-sm text-muted-foreground">
                      {customer.taxCode}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Địa chỉ</p>
                    <p className="text-sm text-muted-foreground">
                      {customer.address}
                      <br />
                      {customer.district}, {customer.city}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Điện thoại</p>
                    <p className="text-sm text-muted-foreground">
                      {customer.phone}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">
                      {customer.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Người liên hệ</p>
                    <p className="text-sm text-muted-foreground">
                      {customer.contactPerson} - {customer.contactPhone}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Điều kiện kinh doanh</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Điều kiện thanh toán
                  </p>
                  <p className="text-sm mt-1">{customer.paymentTerms}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Ngày đăng ký
                  </p>
                  <p className="text-sm mt-1">
                    {new Date(customer.registrationDate).toLocaleDateString(
                      "vi-VN",
                    )}
                  </p>
                </div>
                {customer.lastOrderDate && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Đơn hàng gần nhất
                    </p>
                    <p className="text-sm mt-1">
                      {new Date(customer.lastOrderDate).toLocaleDateString(
                        "vi-VN",
                      )}
                    </p>
                  </div>
                )}
              </div>
              {customer.notes && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm font-medium text-muted-foreground">
                    Ghi chú
                  </p>
                  <p className="text-sm mt-1">{customer.notes}</p>
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            {customerOrders.length > 0 ? (
              customerOrders.map((order) => (
                <Card key={order.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{order.code}</h3>
                        <Badge>{statusLabelsExtended[order.status]}</Badge>
                        <Badge variant="outline">
                          {statusLabelsExtended[order.priority]}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {new Date(order.orderDate).toLocaleDateString("vi-VN")}{" "}
                        • {order.items.length} sản phẩm •{" "}
                        {(order.totalAmount / 1000000).toFixed(2)}tr VNĐ
                      </p>
                    </div>
                    <Link href={`/sales/orders/${order.id}`}>
                      <Button variant="outline" size="sm">
                        Xem chi tiết
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="p-12">
                <div className="flex flex-col items-center justify-center text-center">
                  <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold">Chưa có đơn hàng</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Khách hàng này chưa có đơn hàng nào
                  </p>
                </div>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="debt" className="space-y-4">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Thông tin công nợ</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium">Hạn mức công nợ</p>
                    <p className="text-sm font-bold">
                      {(customer.debtLimit / 1000000).toFixed(0)}tr VNĐ
                    </p>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium">Công nợ hiện tại</p>
                    <p className="text-sm font-bold text-orange-600">
                      {(customer.currentDebt / 1000000).toFixed(0)}tr VNĐ
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Còn lại</p>
                    <p className="text-sm font-bold text-green-600">
                      {(
                        (customer.debtLimit - customer.currentDebt) /
                        1000000
                      ).toFixed(0)}
                      tr VNĐ
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium">Tỷ lệ sử dụng</p>
                    <p className="text-sm font-bold">
                      {getDebtPercentage().toFixed(1)}%
                    </p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                    <div
                      className={`h-2 rounded-full ${
                        getDebtPercentage() > 80
                          ? "bg-red-600"
                          : getDebtPercentage() > 60
                            ? "bg-orange-600"
                            : "bg-green-600"
                      }`}
                      style={{ width: `${getDebtPercentage()}%` }}
                    />
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">Trạng thái:</p>
                    <Badge
                      variant={
                        customer.debtStatus === "good"
                          ? "outline"
                          : "destructive"
                      }
                    >
                      {statusLabelsExtended[customer.debtStatus]}
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
