"use client"

import * as React from "react"
import Link from "next/link"
import { DashboardLayout } from "@/components/dashboard-layout"
import { PageHeader } from "@/components/page-header"
import { DataTable } from "@/components/data-table"
import { StatusBadge } from "@/components/status-badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { purchaseRequisitions } from "@/lib/mock-data"
import type { PurchaseRequisition, RequestStatus } from "@/lib/types"
import { Plus, Eye, Pencil, Trash2, Clock, CheckCircle, XCircle, FileText } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ApprovalTimeline } from "@/components/approval-timeline"

export default function RequesterListPage() {
  const [selectedRequisition, setSelectedRequisition] = React.useState<PurchaseRequisition | null>(null)

  const pendingCount = purchaseRequisitions.filter((r) => r.status === "pending").length
  const approvedCount = purchaseRequisitions.filter((r) => r.status === "approved").length
  const rejectedCount = purchaseRequisitions.filter((r) => r.status === "rejected").length

  const columns = [
    {
      key: "code",
      header: "Mã phiếu",
      cell: (item: PurchaseRequisition) => <span className="font-medium text-primary">{item.code}</span>,
      searchable: true,
    },
    {
      key: "items",
      header: "Vật tư",
      cell: (item: PurchaseRequisition) => (
        <div>
          <div className="font-medium">{item.items[0]?.materialName}</div>
          {item.items.length > 1 && (
            <span className="text-sm text-muted-foreground">+{item.items.length - 1} vật tư khác</span>
          )}
        </div>
      ),
    },
    {
      key: "purpose",
      header: "Mục đích",
      cell: (item: PurchaseRequisition) => <span className="line-clamp-1 max-w-[200px]">{item.purpose}</span>,
      searchable: true,
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
      key: "createdAt",
      header: "Ngày tạo",
      cell: (item: PurchaseRequisition) => new Date(item.createdAt).toLocaleDateString("vi-VN"),
    },
    {
      key: "actions",
      header: "Thao tác",
      cell: (item: PurchaseRequisition) => (
        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" onClick={() => setSelectedRequisition(item)}>
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
                    <label className="text-sm font-medium text-muted-foreground">Mục đích</label>
                    <p className="mt-1">{item.purpose}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Thời gian cần</label>
                    <p className="mt-1">{new Date(item.requiredDate).toLocaleDateString("vi-VN")}</p>
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
                          <th className="px-4 py-2 text-right font-medium">Tồn kho</th>
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
                            <td className="px-4 py-2 text-right">
                              {i.currentStock} {i.unit}
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
          {item.status === "pending" && (
            <>
              <Button variant="ghost" size="icon" asChild>
                <Link href={`/requester/edit/${item.id}`}>
                  <Pencil className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      ),
    },
  ]

  const filterByStatus = (status?: RequestStatus) => {
    if (!status) return purchaseRequisitions
    return purchaseRequisitions.filter((r) => r.status === status)
  }

  return (
    <DashboardLayout role="requester" breadcrumbs={[{ label: "Danh sách phiếu đề nghị" }]}>
      <div className="space-y-6">
        <PageHeader title="Danh sách phiếu đề nghị mua hàng" description="Quản lý các phiếu đề nghị mua hàng của bạn">
          <Button asChild>
            <Link href="/requester/create">
              <Plus className="mr-2 h-4 w-4" />
              Tạo phiếu mới
            </Link>
          </Button>
        </PageHeader>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Tổng số phiếu</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{purchaseRequisitions.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Chờ duyệt</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Đã duyệt</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{approvedCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Từ chối</CardTitle>
              <XCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{rejectedCount}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">Tất cả ({purchaseRequisitions.length})</TabsTrigger>
            <TabsTrigger value="pending">Chờ duyệt ({pendingCount})</TabsTrigger>
            <TabsTrigger value="approved">Đã duyệt ({approvedCount})</TabsTrigger>
            <TabsTrigger value="rejected">Từ chối ({rejectedCount})</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <Card>
              <CardContent className="pt-6">
                <DataTable data={filterByStatus()} columns={columns} searchPlaceholder="Tìm kiếm phiếu đề nghị..." />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="pending">
            <Card>
              <CardContent className="pt-6">
                <DataTable
                  data={filterByStatus("pending")}
                  columns={columns}
                  searchPlaceholder="Tìm kiếm phiếu chờ duyệt..."
                />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="approved">
            <Card>
              <CardContent className="pt-6">
                <DataTable
                  data={filterByStatus("approved")}
                  columns={columns}
                  searchPlaceholder="Tìm kiếm phiếu đã duyệt..."
                />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="rejected">
            <Card>
              <CardContent className="pt-6">
                <DataTable
                  data={filterByStatus("rejected")}
                  columns={columns}
                  searchPlaceholder="Tìm kiếm phiếu bị từ chối..."
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
