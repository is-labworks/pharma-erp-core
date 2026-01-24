"use client"
import { DashboardLayout } from "@/components/dashboard-layout"
import { PageHeader } from "@/components/page-header"
import { DataTable } from "@/components/data-table"
import { StatusBadge } from "@/components/status-badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { purchaseRequisitions } from "@/lib/mock-data"
import type { PurchaseRequisition } from "@/lib/types"
import { CheckCircle, XCircle, Clock, History } from "lucide-react"
import { ApprovalTimeline } from "@/components/approval-timeline"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"

export default function DepartmentHeadHistoryPage() {
  const processedRequisitions = purchaseRequisitions.filter((r) => r.status !== "pending")

  const approvedCount = processedRequisitions.filter((r) => r.status === "approved").length
  const rejectedCount = processedRequisitions.filter((r) => r.status === "rejected").length

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
      key: "status",
      header: "Trạng thái",
      cell: (item: PurchaseRequisition) => <StatusBadge status={item.status} />,
    },
    {
      key: "updatedAt",
      header: "Ngày xử lý",
      cell: (item: PurchaseRequisition) => new Date(item.updatedAt).toLocaleDateString("vi-VN"),
    },
    {
      key: "actions",
      header: "Thao tác",
      cell: (item: PurchaseRequisition) => (
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
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Người đề xuất</label>
                  <p className="mt-1">{item.requesterName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Bộ phận</label>
                  <p className="mt-1">{item.department}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Mục đích</label>
                  <p className="mt-1">{item.purpose}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Trạng thái</label>
                  <div className="mt-1">
                    <StatusBadge status={item.status} />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Danh sách vật tư</label>
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

              <div>
                <label className="text-sm font-medium text-muted-foreground">Lịch sử phê duyệt</label>
                <div className="mt-2">
                  <ApprovalTimeline steps={item.approvalHistory} />
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      ),
    },
  ]

  return (
    <DashboardLayout role="department_head" breadcrumbs={[{ label: "Lịch sử duyệt" }]}>
      <div className="space-y-6">
        <PageHeader title="Lịch sử phê duyệt" description="Xem lại các phiếu đề nghị đã được xử lý" />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Tổng đã xử lý</CardTitle>
              <History className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{processedRequisitions.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Đã duyệt</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{approvedCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Đã từ chối</CardTitle>
              <XCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{rejectedCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Tỷ lệ duyệt</CardTitle>
              <Clock className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {processedRequisitions.length > 0
                  ? Math.round((approvedCount / processedRequisitions.length) * 100)
                  : 0}
                %
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Danh sách phiếu đã xử lý</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              data={processedRequisitions}
              columns={columns}
              searchPlaceholder="Tìm kiếm theo mã phiếu hoặc người đề xuất..."
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
