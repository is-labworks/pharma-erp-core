"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { PageHeader } from "@/components/page-header";
import { DataTable } from "@/components/data-table";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Search, CreditCard, Clock, CheckCircle, Calendar } from "lucide-react";

const payments = [
  {
    id: "pay-1",
    poCode: "PO-2026-0001",
    supplierName: "Công ty CP Hóa Dược Việt Nam",
    amount: 60000000,
    dueDate: "2026-02-15",
    status: "pending",
    method: "",
  },
  {
    id: "pay-2",
    poCode: "PO-2025-0150",
    supplierName: "Công ty TNHH Nguyên liệu Dược phẩm Á Châu",
    amount: 450000000,
    dueDate: "2026-01-15",
    status: "paid",
    method: "Chuyển khoản",
    paidDate: "2026-01-14",
  },
  {
    id: "pay-3",
    poCode: "PO-2025-0148",
    supplierName: "Công ty CP Hóa Dược Việt Nam",
    amount: 320000000,
    dueDate: "2026-01-10",
    status: "paid",
    method: "Chuyển khoản",
    paidDate: "2026-01-09",
  },
];

export default function PaymentsPage() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const filteredPayments = payments.filter(
    (p) =>
      p.poCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.supplierName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const columns = [
    {
      key: "poCode",
      header: "Mã PO",
      searchable: true,
      cell: (p: (typeof payments)[0]) => p.poCode,
    },
    {
      key: "supplierName",
      header: "Nhà cung cấp",
      searchable: true,
      cell: (p: (typeof payments)[0]) => p.supplierName,
    },
    {
      key: "amount",
      header: "Số tiền",
      cell: (p: (typeof payments)[0]) =>
        new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(p.amount),
    },
    {
      key: "dueDate",
      header: "Hạn thanh toán",
      cell: (p: (typeof payments)[0]) => p.dueDate,
    },
    {
      key: "status",
      header: "Trạng thái",
      cell: (p: (typeof payments)[0]) => (
        <StatusBadge status={p.status === "paid" ? "completed" : "pending"}>
          {p.status === "paid" ? "Đã thanh toán" : "Chờ thanh toán"}
        </StatusBadge>
      ),
    },
    {
      key: "method",
      header: "Phương thức",
      cell: (p: (typeof payments)[0]) => p.method || "-",
    },
    {
      key: "actions",
      header: "Thao tác",
      cell: (p: (typeof payments)[0]) =>
        p.status === "pending" ? (
          <Button size="sm" onClick={() => setIsDialogOpen(true)}>
            <CreditCard className="mr-2 h-4 w-4" />
            Thanh toán
          </Button>
        ) : (
          <span className="text-sm text-muted-foreground">Đã xử lý</span>
        ),
    },
  ];

  const pendingTotal = payments
    .filter((p) => p.status === "pending")
    .reduce((sum, p) => sum + p.amount, 0);
  const paidTotal = payments
    .filter((p) => p.status === "paid")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <DashboardLayout role="accounting" breadcrumbs={[{ label: "Thanh toán" }]}>
      <div className="space-y-6">
        <PageHeader
          title="Quản lý thanh toán"
          description="Theo dõi và xử lý thanh toán cho nhà cung cấp"
          icon={CreditCard}
        />

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Tổng chờ thanh toán
              </CardTitle>
              <Clock className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                  notation: "compact",
                }).format(pendingTotal)}
              </div>
              <p className="text-xs text-muted-foreground">
                {payments.filter((p) => p.status === "pending").length} khoản
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Đã thanh toán tháng này
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                  notation: "compact",
                }).format(paidTotal)}
              </div>
              <p className="text-xs text-muted-foreground">
                {payments.filter((p) => p.status === "paid").length} khoản
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sắp đến hạn</CardTitle>
              <Calendar className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">1</div>
              <p className="text-xs text-muted-foreground">Trong 7 ngày tới</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Danh sách thanh toán</CardTitle>
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
            <DataTable columns={columns} data={filteredPayments} />
          </CardContent>
        </Card>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Xác nhận thanh toán</DialogTitle>
              <DialogDescription>
                Nhập thông tin thanh toán cho nhà cung cấp
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Phương thức thanh toán</Label>
                <Input placeholder="VD: Chuyển khoản ngân hàng" />
              </div>
              <div className="grid gap-2">
                <Label>Số tham chiếu</Label>
                <Input placeholder="Mã giao dịch / số chứng từ" />
              </div>
              <div className="grid gap-2">
                <Label>Ghi chú</Label>
                <Textarea placeholder="Ghi chú thêm (nếu có)" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Hủy
              </Button>
              <Button onClick={() => setIsDialogOpen(false)}>
                Xác nhận thanh toán
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
