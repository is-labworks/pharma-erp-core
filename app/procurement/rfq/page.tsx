"use client"
import { DashboardLayout } from "@/components/dashboard-layout"
import { PageHeader } from "@/components/page-header"
import { DataTable } from "@/components/data-table"
import { StatusBadge } from "@/components/status-badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { rfqs, suppliers } from "@/lib/mock-data"
import type { RFQ } from "@/lib/types"
import { Send, Plus, Eye, FileText, Clock, CheckCircle, Building2 } from "lucide-react"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

export default function RFQPage() {
  const getSupplierNames = (supplierIds: string[]) => {
    return supplierIds.map((id) => suppliers.find((s) => s.id === id)?.name || id)
  }

  const columns = [
    {
      key: "code",
      header: "Mã RFQ",
      cell: (item: RFQ) => <span className="font-medium text-primary">{item.code}</span>,
      searchable: true,
    },
    {
      key: "items",
      header: "Vật tư",
      cell: (item: RFQ) => (
        <div>
          <div>{item.items[0]?.materialName}</div>
          {item.items.length > 1 && (
            <span className="text-sm text-muted-foreground">+{item.items.length - 1} vật tư khác</span>
          )}
        </div>
      ),
    },
    {
      key: "suppliers",
      header: "NCC được gửi",
      cell: (item: RFQ) => (
        <div className="flex items-center gap-1">
          <Building2 className="h-4 w-4 text-muted-foreground" />
          <span>{item.suppliers.length} NCC</span>
        </div>
      ),
    },
    {
      key: "deadline",
      header: "Hạn nhận báo giá",
      cell: (item: RFQ) => new Date(item.deadline).toLocaleDateString("vi-VN"),
    },
    {
      key: "status",
      header: "Trạng thái",
      cell: (item: RFQ) => <StatusBadge status={item.status} />,
    },
    {
      key: "actions",
      header: "Thao tác",
      cell: (item: RFQ) => (
        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Eye className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Chi tiết yêu cầu báo giá</DialogTitle>
                <DialogDescription>Mã RFQ: {item.code}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Ngày tạo</Label>
                    <p className="font-medium">{new Date(item.createdAt).toLocaleDateString("vi-VN")}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Hạn nhận báo giá</Label>
                    <p className="font-medium">{new Date(item.deadline).toLocaleDateString("vi-VN")}</p>
                  </div>
                </div>

                <div>
                  <Label className="text-muted-foreground">Nhà cung cấp được gửi</Label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {getSupplierNames(item.suppliers).map((name, index) => (
                      <Badge key={index} variant="outline">
                        {name}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-muted-foreground">Danh sách vật tư yêu cầu</Label>
                  <div className="mt-2 rounded-lg border">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="px-4 py-2 text-left font-medium">Vật tư</th>
                          <th className="px-4 py-2 text-right font-medium">Số lượng</th>
                          <th className="px-4 py-2 text-right font-medium">Đơn vị</th>
                        </tr>
                      </thead>
                      <tbody>
                        {item.items.map((i, index) => (
                          <tr key={index} className="border-t">
                            <td className="px-4 py-2">{i.materialName}</td>
                            <td className="px-4 py-2 text-right">{i.quantity}</td>
                            <td className="px-4 py-2 text-right">{i.unit}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          {item.status === "received" && (
            <Button size="sm" asChild>
              <Link href="/procurement/compare">So sánh</Link>
            </Button>
          )}
        </div>
      ),
    },
  ]

  return (
    <DashboardLayout role="procurement" breadcrumbs={[{ label: "Yêu cầu báo giá (RFQ)" }]}>
      <div className="space-y-6">
        <PageHeader
          title="Quản lý yêu cầu báo giá (RFQ)"
          description="Tạo và quản lý các yêu cầu báo giá gửi nhà cung cấp"
        >
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Tạo RFQ mới
          </Button>
        </PageHeader>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Tổng RFQ</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{rfqs.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Đã gửi</CardTitle>
              <Send className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{rfqs.filter((r) => r.status === "sent").length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Đã nhận báo giá</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {rfqs.filter((r) => r.status === "received").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Chờ xử lý</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{rfqs.filter((r) => r.status === "draft").length}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Danh sách yêu cầu báo giá</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable data={rfqs} columns={columns} searchPlaceholder="Tìm kiếm RFQ..." />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
