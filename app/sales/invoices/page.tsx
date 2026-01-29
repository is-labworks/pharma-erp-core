"use client";
import { DashboardLayout } from "@/components/dashboard-layout";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { salesOrdersExtended } from "@/lib/sales-mock-data";
import {
  FileText,
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  Printer,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// Mock invoice data from delivered orders
const invoices = salesOrdersExtended
  .filter((o) => ["delivered", "invoiced", "completed"].includes(o.status))
  .map((order) => ({
    id: `inv-${order.id}`,
    invoiceNumber: `HD-${order.code.replace("DH-", "")}`,
    orderId: order.id,
    orderCode: order.code,
    customer: order.customer,
    totalAmount: order.totalAmount,
    vatAmount: order.vatAmount,
    paidAmount: order.status === "completed" ? order.totalAmount : 0,
    remainingAmount: order.status === "completed" ? 0 : order.totalAmount,
    status:
      order.status === "completed" ? ("paid" as const) : ("unpaid" as const),
    invoiceDate: order.orderDate,
    dueDate: new Date(
      new Date(order.orderDate).getTime() + 30 * 24 * 60 * 60 * 1000,
    ).toISOString(),
    paymentMethod: order.paymentMethod,
  }));

export default function InvoicesPage() {
  const [statusFilter, setStatusFilter] = useState<
    "all" | "unpaid" | "partial" | "paid" | "overdue"
  >("all");

  const filteredInvoices =
    statusFilter === "all"
      ? invoices
      : invoices.filter((inv) => inv.status === statusFilter);

  const unpaidCount = invoices.filter((inv) => inv.status === "unpaid").length;
  const paidCount = invoices.filter((inv) => inv.status === "paid").length;
  const totalUnpaid = invoices
    .filter((inv) => inv.status === "unpaid")
    .reduce((sum, inv) => sum + inv.remainingAmount, 0);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Đã thanh toán
          </Badge>
        );
      case "partial":
        return (
          <Badge className="bg-blue-100 text-blue-800">
            <Clock className="h-3 w-3 mr-1" />
            Thanh toán một phần
          </Badge>
        );
      case "unpaid":
        return (
          <Badge className="bg-orange-100 text-orange-800">
            <Clock className="h-3 w-3 mr-1" />
            Chưa thanh toán
          </Badge>
        );
      case "overdue":
        return (
          <Badge variant="destructive">
            <AlertCircle className="h-3 w-3 mr-1" />
            Quá hạn
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <DashboardLayout
      role="sales_staff"
      breadcrumbs={[
        { label: "Kinh doanh", href: "/sales" },
        { label: "Hóa đơn & Thanh toán" },
      ]}
    >
      <div className="space-y-6">
        <PageHeader
          title="Quản lý Hóa đơn"
          description="Theo dõi hóa đơn và thanh toán từ khách hàng"
        />

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Tổng hóa đơn
                </p>
                <h3 className="text-3xl font-bold mt-1">{invoices.length}</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Trong hệ thống
                </p>
              </div>
              <FileText className="h-10 w-10 text-blue-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Chưa thanh toán
                </p>
                <h3 className="text-3xl font-bold mt-1 text-orange-600">
                  {unpaidCount}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {(totalUnpaid / 1000000).toFixed(0)}tr VNĐ
                </p>
              </div>
              <Clock className="h-10 w-10 text-orange-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Đã thanh toán
                </p>
                <h3 className="text-3xl font-bold mt-1 text-green-600">
                  {paidCount}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">Hoàn tất</p>
              </div>
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-4">
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={statusFilter === "all" ? "default" : "outline"}
              onClick={() => setStatusFilter("all")}
              size="sm"
            >
              Tất cả ({invoices.length})
            </Button>
            <Button
              variant={statusFilter === "unpaid" ? "default" : "outline"}
              onClick={() => setStatusFilter("unpaid")}
              size="sm"
            >
              Chưa thanh toán ({unpaidCount})
            </Button>
            <Button
              variant={statusFilter === "paid" ? "default" : "outline"}
              onClick={() => setStatusFilter("paid")}
              size="sm"
            >
              Đã thanh toán ({paidCount})
            </Button>
          </div>
        </Card>

        {/* Invoice List */}
        <div className="grid gap-4">
          {filteredInvoices.map((invoice) => (
            <Card
              key={invoice.id}
              className="p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-lg font-semibold">
                      {invoice.invoiceNumber}
                    </h3>
                    {getStatusBadge(invoice.status)}
                    <Badge variant="outline">{invoice.orderCode}</Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Khách hàng
                      </p>
                      <p className="text-sm font-medium">
                        {invoice.customer.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {invoice.customer.code}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Ngày hóa đơn
                      </p>
                      <p className="text-sm">
                        {new Date(invoice.invoiceDate).toLocaleDateString(
                          "vi-VN",
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Hạn:{" "}
                        {new Date(invoice.dueDate).toLocaleDateString("vi-VN")}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Tổng tiền
                      </p>
                      <p className="text-lg font-bold">
                        {(invoice.totalAmount / 1000000).toFixed(2)}tr
                      </p>
                      <p className="text-xs text-muted-foreground">
                        VAT: {(invoice.vatAmount / 1000000).toFixed(2)}tr
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Còn lại
                      </p>
                      <p
                        className={`text-lg font-bold ${
                          invoice.remainingAmount > 0
                            ? "text-orange-600"
                            : "text-green-600"
                        }`}
                      >
                        {(invoice.remainingAmount / 1000000).toFixed(2)}tr
                      </p>
                      {invoice.paidAmount > 0 && (
                        <p className="text-xs text-green-600">
                          Đã thu: {(invoice.paidAmount / 1000000).toFixed(2)}tr
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  <Link href={`/sales/invoices/${invoice.id}`}>
                    <Button variant="outline" size="sm">
                      <Eye className="mr-2 h-4 w-4" />
                      Xem
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm">
                    <Printer className="mr-2 h-4 w-4" />
                    In
                  </Button>
                  {invoice.status === "unpaid" && (
                    <Button size="sm">
                      <DollarSign className="mr-2 h-4 w-4" />
                      Thu tiền
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}

          {filteredInvoices.length === 0 && (
            <Card className="p-12">
              <div className="flex flex-col items-center justify-center text-center">
                <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold">Không có hóa đơn</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Không tìm thấy hóa đơn với bộ lọc hiện tại
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
