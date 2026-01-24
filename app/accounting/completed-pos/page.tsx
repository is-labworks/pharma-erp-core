"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { PageHeader } from "@/components/page-header";
import { DataTable } from "@/components/data-table";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { purchaseOrders } from "@/lib/mock-data";
import {
  Search,
  FileCheck,
  Eye,
  Download,
  Receipt,
  Clock,
  CheckCircle,
} from "lucide-react";

const completedPOs = purchaseOrders.map((po) => ({
  ...po,
  status: "completed" as const,
  invoiceStatus: Math.random() > 0.5 ? "received" : "pending",
  paymentStatus: Math.random() > 0.7 ? "paid" : "pending",
}));

export default function CompletedPOsPage() {
  const [searchTerm, setSearchTerm] = React.useState("");

  const filteredPOs = completedPOs.filter(
    (po) =>
      po.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      po.supplierName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const columns = [
    {
      key: "code",
      header: "Mã PO",
      searchable: true,
      cell: (po: (typeof completedPOs)[0]) => po.code,
    },
    {
      key: "supplierName",
      header: "Nhà cung cấp",
      searchable: true,
      cell: (po: (typeof completedPOs)[0]) => po.supplierName,
    },
    {
      key: "totalAmount",
      header: "Giá trị",
      cell: (po: (typeof completedPOs)[0]) =>
        new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(po.totalAmount),
    },
    {
      key: "deliveryDate",
      header: "Ngày giao",
      cell: (po: (typeof completedPOs)[0]) => po.deliveryDate,
    },
    {
      key: "invoiceStatus",
      header: "Hóa đơn",
      cell: (po: (typeof completedPOs)[0]) => (
        <StatusBadge
          status={po.invoiceStatus === "received" ? "completed" : "pending"}
        >
          {po.invoiceStatus === "received" ? "Đã nhận" : "Chờ nhận"}
        </StatusBadge>
      ),
    },
    {
      key: "paymentStatus",
      header: "Thanh toán",
      cell: (po: (typeof completedPOs)[0]) => (
        <StatusBadge
          status={po.paymentStatus === "paid" ? "completed" : "processing"}
        >
          {po.paymentStatus === "paid" ? "Đã thanh toán" : "Chờ thanh toán"}
        </StatusBadge>
      ),
    },
    {
      key: "actions",
      header: "Thao tác",
      cell: (po: (typeof completedPOs)[0]) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const totalValue = completedPOs.reduce((sum, po) => sum + po.totalAmount, 0);
  const paidCount = completedPOs.filter(
    (po) => po.paymentStatus === "paid",
  ).length;
  const pendingCount = completedPOs.filter(
    (po) => po.paymentStatus === "pending",
  ).length;

  return (
    <DashboardLayout
      role="accounting"
      breadcrumbs={[{ label: "PO hoàn thành" }]}
    >
      <div className="space-y-6">
        <PageHeader
          title="PO hoàn thành"
          description="Danh sách đơn mua hàng đã hoàn thành cần đối chiếu và thanh toán"
          icon={FileCheck}
        />

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng PO</CardTitle>
              <Receipt className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedPOs.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Tổng giá trị
              </CardTitle>
              <Receipt className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                  notation: "compact",
                }).format(totalValue)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Đã thanh toán
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {paidCount}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Chờ thanh toán
              </CardTitle>
              <Clock className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {pendingCount}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Danh sách PO</CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Tìm theo mã PO, NCC..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <DataTable columns={columns} data={filteredPOs} />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
