"use client";
import { DashboardLayout } from "@/components/dashboard-layout";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
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
import { salesOrdersExtended, customers } from "@/lib/sales-mock-data";
import {
  BarChart3,
  TrendingUp,
  Users,
  Package,
  DollarSign,
  Download,
  Calendar,
} from "lucide-react";
import { useState } from "react";

export default function ReportsPage() {
  const [reportType, setReportType] = useState<
    "sales" | "customer" | "product"
  >("sales");
  const [startDate, setStartDate] = useState("2026-01-01");
  const [endDate, setEndDate] = useState("2026-01-31");

  // Calculate statistics
  const totalRevenue = salesOrdersExtended.reduce(
    (sum, order) => sum + order.totalAmount,
    0,
  );
  const totalOrders = salesOrdersExtended.length;
  const totalCustomers = customers.length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Top products
  const productSales: Record<
    string,
    { name: string; quantity: number; revenue: number }
  > = {};
  salesOrdersExtended.forEach((order) => {
    order.items.forEach((item) => {
      if (!productSales[item.medicineId]) {
        productSales[item.medicineId] = {
          name: item.medicineName,
          quantity: 0,
          revenue: 0,
        };
      }
      productSales[item.medicineId].quantity += item.quantity;
      productSales[item.medicineId].revenue += item.total;
    });
  });

  const topProducts = Object.entries(productSales)
    .map(([id, data]) => ({ id, ...data }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  // Top customers
  const customerSales: Record<
    string,
    { name: string; orders: number; revenue: number }
  > = {};
  salesOrdersExtended.forEach((order) => {
    if (!customerSales[order.customerId]) {
      customerSales[order.customerId] = {
        name: order.customer.name,
        orders: 0,
        revenue: 0,
      };
    }
    customerSales[order.customerId].orders += 1;
    customerSales[order.customerId].revenue += order.totalAmount;
  });

  const topCustomers = Object.entries(customerSales)
    .map(([id, data]) => ({ id, ...data }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  return (
    <DashboardLayout
      role="sales_manager"
      breadcrumbs={[
        { label: "Kinh doanh", href: "/sales" },
        { label: "Báo cáo & Thống kê" },
      ]}
    >
      <div className="space-y-6">
        <PageHeader
          title="Báo cáo & Thống kê"
          description="Phân tích doanh số và hiệu quả kinh doanh"
        />

        {/* Filter */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Tùy chọn báo cáo</h3>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label>Loại báo cáo</Label>
              <Select
                value={reportType}
                onValueChange={(val: any) => setReportType(val)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sales">Doanh số bán hàng</SelectItem>
                  <SelectItem value="customer">Theo khách hàng</SelectItem>
                  <SelectItem value="product">Theo sản phẩm</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Từ ngày</Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Đến ngày</Label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>&nbsp;</Label>
              <Button className="w-full">
                <BarChart3 className="mr-2 h-4 w-4" />
                Tạo báo cáo
              </Button>
            </div>
          </div>
        </Card>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Tổng doanh thu
                </p>
                <h3 className="text-2xl font-bold mt-1">
                  {(totalRevenue / 1000000).toFixed(0)}tr
                </h3>
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +12% so với tháng trước
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Số đơn hàng
                </p>
                <h3 className="text-2xl font-bold mt-1">{totalOrders}</h3>
                <p className="text-xs text-muted-foreground mt-1">Trong kỳ</p>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Giá trị TB/đơn
                </p>
                <h3 className="text-2xl font-bold mt-1">
                  {(avgOrderValue / 1000000).toFixed(1)}tr
                </h3>
                <p className="text-xs text-muted-foreground mt-1">Trung bình</p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Khách hàng
                </p>
                <h3 className="text-2xl font-bold mt-1">{totalCustomers}</h3>
                <p className="text-xs text-muted-foreground mt-1">Tổng cộng</p>
              </div>
              <Users className="h-8 w-8 text-orange-600" />
            </div>
          </Card>
        </div>

        {/* Top Products */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Top 5 sản phẩm bán chạy</h3>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Xuất Excel
            </Button>
          </div>

          <div className="space-y-3">
            {topProducts.map((product, idx) => (
              <div
                key={product.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                    {idx + 1}
                  </div>
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Đã bán: {product.quantity.toLocaleString()} đơn vị
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">
                    {(product.revenue / 1000000).toFixed(1)}tr
                  </p>
                  <p className="text-xs text-muted-foreground">Doanh thu</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Top Customers */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Top 5 khách hàng lớn</h3>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Xuất Excel
            </Button>
          </div>

          <div className="space-y-3">
            {topCustomers.map((customer, idx) => (
              <div
                key={customer.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold">
                    {idx + 1}
                  </div>
                  <div>
                    <p className="font-medium">{customer.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {customer.orders} đơn hàng
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">
                    {(customer.revenue / 1000000).toFixed(1)}tr
                  </p>
                  <p className="text-xs text-muted-foreground">Doanh thu</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Sales by Status */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Trạng thái đơn hàng</h3>

          <div className="grid gap-4 md:grid-cols-4">
            {[
              {
                status: "pending_approval",
                label: "Chờ duyệt",
                count: salesOrdersExtended.filter(
                  (o) => o.status === "pending_approval",
                ).length,
                color: "orange",
              },
              {
                status: "approved",
                label: "Đã duyệt",
                count: salesOrdersExtended.filter(
                  (o) => o.status === "approved",
                ).length,
                color: "green",
              },
              {
                status: "shipped",
                label: "Đã xuất kho",
                count: salesOrdersExtended.filter((o) => o.status === "shipped")
                  .length,
                color: "blue",
              },
              {
                status: "delivered",
                label: "Đã giao",
                count: salesOrdersExtended.filter(
                  (o) => o.status === "delivered",
                ).length,
                color: "purple",
              },
            ].map((item) => (
              <div key={item.status} className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">{item.label}</p>
                <p className="text-3xl font-bold mt-2">{item.count}</p>
                <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-${item.color}-600`}
                    style={{
                      width: `${(item.count / totalOrders) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
