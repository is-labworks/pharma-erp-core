"use client"
import { DashboardLayout } from "@/components/dashboard-layout"
import { PageHeader } from "@/components/page-header"
import { DataTable } from "@/components/data-table"
import { StatusBadge } from "@/components/status-badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { purchaseRequisitions } from "@/lib/mock-data"
import type { PurchaseRequisition } from "@/lib/types"
import { FileCheck, Send, Eye, ArrowRight } from "lucide-react"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function ApprovedRequestsPage() {
  const approvedRequisitions = purchaseRequisitions.filter((r) => r.status === "approved")

  const columns = [
    {
      key: "code",
      header: "Mã phiếu",
      cell: (item: PurchaseRequisition) => <span className="font-medium text-primary">{item.code}</span>,
      searchable: true,
    },
    {
      key: "requesterName",
      header: "Người đề xuất",
      cell: (item: PurchaseRequisition) => (
        <div>
          <div className="font-medium">{item.requesterName}</div>
          <div className="text-sm text-muted-foreground">{item.department}</div>
        </div>
      ),
      searchable: true,
    },
    {
      key: "items",
      header: "Vật tư",
      cell: (item: PurchaseRequisition) => (
        <div>
          <div>{item.items[0]?.materialName}</div>
          {item.items.length > 1 && (
            <span className="text-sm text-muted-foreground">+{item.items.length - 1} vật tư khác</span>
          )}
        </div>
      ),
    },
    {
      key: "requiredDate",
      header: "Thời gian cần",
      cell: (item: PurchaseRequisition) => new Date(item.requiredDate).toLocaleDateString("vi-VN"),
    },
    {
      key: "status",
      header: "Trạng thái",
      cell: (item: PurchaseRequisition) => <StatusBadge status={item.status} />,
    },
    {
      key: "actions",
      header: "Thao tác",
      cell: (item: PurchaseRequisition) => (
        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Eye className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Chi tiết phiếu đề nghị</DialogTitle>
                <DialogDescription>Mã phiếu: {item.code}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground">Mục đích</label>
                    <p className="mt-1 font-medium">{item.purpose}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Thời gian cần</label>
                    <p className="mt-1 font-medium">{new Date(item.requiredDate).toLocaleDateString("vi-VN")}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Danh sách vật tư</label>
                  <div className="mt-2 rounded-lg border">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="px-4 py-2 text-left font-medium">Mã</th>
                          <th className="px-4 py-2 text-left font-medium">Tên vật tư</th>
                          <th className="px-4 py-2 text-right font-medium">Số lượng</th>
                        </tr>
                      </thead>
                      <tbody>
                        {item.items.map((i) => (
                          <tr key={i.id} className="border-t">
                            <td className="px-4 py-2">{i.materialCode}</td>
                            <td className="px-4 py-2">{i.materialName}</td>
                            <td className="px-4 py-2 text-right">
                              {i.quantity} {i.unit}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Button size="sm" asChild>
            <Link href={`/procurement/rfq/create?requisition=${item.id}`}>
              <Send className="mr-2 h-4 w-4" />
              Tạo RFQ
            </Link>
          </Button>
        </div>
      ),
    },
  ]

  return (
    <DashboardLayout role="procurement" breadcrumbs={[{ label: "Nhu cầu đã duyệt" }]}>
      <div className="space-y-6">
        <PageHeader
          title="Nhu cầu mua hàng đã được duyệt"
          description={`Có ${approvedRequisitions.length} nhu cầu đã được phê duyệt và sẵn sàng xử lý`}
        />

        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Chờ xử lý</CardTitle>
              <FileCheck className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{approvedRequisitions.length}</div>
              <p className="text-xs text-muted-foreground">nhu cầu cần tạo RFQ</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Tổng vật tư</CardTitle>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {approvedRequisitions.reduce((acc, r) => acc + r.items.length, 0)}
              </div>
              <p className="text-xs text-muted-foreground">loại vật tư cần mua</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Gấp</CardTitle>
              <Send className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                {
                  approvedRequisitions.filter((r) => {
                    const daysUntil = Math.ceil(
                      (new Date(r.requiredDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
                    )
                    return daysUntil <= 7
                  }).length
                }
              </div>
              <p className="text-xs text-muted-foreground">cần trong 7 ngày</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Danh sách nhu cầu đã duyệt</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable data={approvedRequisitions} columns={columns} searchPlaceholder="Tìm kiếm nhu cầu..." />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
