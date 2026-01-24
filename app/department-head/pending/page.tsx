"use client"

import * as React from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { purchaseRequisitions, materials } from "@/lib/mock-data"
import type { PurchaseRequisition } from "@/lib/types"
import { CheckCircle, XCircle, Eye, Clock, Package, AlertTriangle, Calendar, User } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

export default function DepartmentHeadPendingPage() {
  const [selectedRequisition, setSelectedRequisition] = React.useState<PurchaseRequisition | null>(null)
  const [rejectReason, setRejectReason] = React.useState("")
  const [approveDialogOpen, setApproveDialogOpen] = React.useState(false)
  const [rejectDialogOpen, setRejectDialogOpen] = React.useState(false)

  const pendingRequisitions = purchaseRequisitions.filter((r) => r.status === "pending")

  const handleApprove = () => {
    // Approval logic here
    setApproveDialogOpen(false)
    setSelectedRequisition(null)
  }

  const handleReject = () => {
    // Rejection logic here
    setRejectDialogOpen(false)
    setSelectedRequisition(null)
    setRejectReason("")
  }

  const getMaterial = (materialId: string) => materials.find((m) => m.id === materialId)

  return (
    <DashboardLayout role="department_head" breadcrumbs={[{ label: "Chờ duyệt" }]}>
      <div className="space-y-6">
        <PageHeader
          title="Phiếu đề nghị chờ duyệt"
          description={`Có ${pendingRequisitions.length} phiếu đề nghị đang chờ phê duyệt`}
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Chờ duyệt</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingRequisitions.length}</div>
              <p className="text-xs text-muted-foreground">phiếu cần xử lý</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Tổng vật tư yêu cầu</CardTitle>
              <Package className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {pendingRequisitions.reduce((acc, r) => acc + r.items.length, 0)}
              </div>
              <p className="text-xs text-muted-foreground">loại vật tư</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Cảnh báo tồn kho</CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                {pendingRequisitions.filter((r) => r.items.some((i) => i.currentStock < i.quantity)).length}
              </div>
              <p className="text-xs text-muted-foreground">phiếu có vật tư thiếu</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {pendingRequisitions.length === 0 ? (
            <Card className="lg:col-span-2">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
                <h3 className="text-lg font-medium">Không có phiếu nào chờ duyệt</h3>
                <p className="text-muted-foreground">Tất cả phiếu đề nghị đã được xử lý</p>
              </CardContent>
            </Card>
          ) : (
            pendingRequisitions.map((requisition) => (
              <Card key={requisition.id} className="overflow-hidden">
                <CardHeader className="bg-muted/30">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{requisition.code}</CardTitle>
                      <CardDescription className="mt-1">
                        <div className="flex items-center gap-2">
                          <User className="h-3 w-3" />
                          {requisition.requesterName} - {requisition.department}
                        </div>
                      </CardDescription>
                    </div>
                    <Badge variant="secondary">
                      <Clock className="mr-1 h-3 w-3" />
                      Chờ duyệt
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Mục đích:</span>
                      <p className="font-medium line-clamp-2">{requisition.purpose}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Thời gian cần:</span>
                      <p className="font-medium flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(requisition.requiredDate).toLocaleDateString("vi-VN")}
                      </p>
                    </div>
                  </div>

                  <div>
                    <span className="text-sm text-muted-foreground">Vật tư yêu cầu:</span>
                    <div className="mt-2 space-y-2">
                      {requisition.items.slice(0, 2).map((item) => {
                        const material = getMaterial(item.materialId)
                        const isLowStock = item.currentStock < item.quantity

                        return (
                          <div
                            key={item.id}
                            className="flex items-center justify-between rounded-lg border p-2 text-sm"
                          >
                            <div>
                              <span className="font-medium">{item.materialName}</span>
                              <span className="text-muted-foreground ml-2">
                                ({item.quantity} {item.unit})
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground">
                                Tồn: {item.currentStock} {item.unit}
                              </span>
                              {isLowStock && <AlertTriangle className="h-4 w-4 text-destructive" />}
                            </div>
                          </div>
                        )
                      })}
                      {requisition.items.length > 2 && (
                        <p className="text-sm text-muted-foreground">+{requisition.items.length - 2} vật tư khác</p>
                      )}
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                          <Eye className="mr-2 h-4 w-4" />
                          Chi tiết
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl max-h-[90vh]">
                        <DialogHeader>
                          <DialogTitle>Chi tiết phiếu đề nghị</DialogTitle>
                          <DialogDescription>Mã phiếu: {requisition.code}</DialogDescription>
                        </DialogHeader>
                        <ScrollArea className="max-h-[60vh]">
                          <div className="space-y-6 pr-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="text-muted-foreground">Người đề xuất</Label>
                                <p className="font-medium">{requisition.requesterName}</p>
                              </div>
                              <div>
                                <Label className="text-muted-foreground">Bộ phận</Label>
                                <p className="font-medium">{requisition.department}</p>
                              </div>
                              <div>
                                <Label className="text-muted-foreground">Ngày tạo</Label>
                                <p className="font-medium">
                                  {new Date(requisition.createdAt).toLocaleDateString("vi-VN")}
                                </p>
                              </div>
                              <div>
                                <Label className="text-muted-foreground">Thời gian cần</Label>
                                <p className="font-medium">
                                  {new Date(requisition.requiredDate).toLocaleDateString("vi-VN")}
                                </p>
                              </div>
                            </div>

                            <div>
                              <Label className="text-muted-foreground">Mục đích sử dụng</Label>
                              <p className="font-medium mt-1">{requisition.purpose}</p>
                            </div>

                            <div>
                              <Label className="text-muted-foreground">Danh sách vật tư</Label>
                              <div className="mt-2 rounded-lg border overflow-hidden">
                                <table className="w-full text-sm">
                                  <thead className="bg-muted/50">
                                    <tr>
                                      <th className="px-4 py-2 text-left font-medium">Mã</th>
                                      <th className="px-4 py-2 text-left font-medium">Tên vật tư</th>
                                      <th className="px-4 py-2 text-right font-medium">Yêu cầu</th>
                                      <th className="px-4 py-2 text-right font-medium">Tồn kho</th>
                                      <th className="px-4 py-2 text-center font-medium">Trạng thái</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {requisition.items.map((item) => {
                                      const isLowStock = item.currentStock < item.quantity
                                      return (
                                        <tr key={item.id} className="border-t">
                                          <td className="px-4 py-2">{item.materialCode}</td>
                                          <td className="px-4 py-2">{item.materialName}</td>
                                          <td className="px-4 py-2 text-right">
                                            {item.quantity} {item.unit}
                                          </td>
                                          <td className="px-4 py-2 text-right">
                                            {item.currentStock} {item.unit}
                                          </td>
                                          <td className="px-4 py-2 text-center">
                                            {isLowStock ? (
                                              <Badge variant="destructive">Thiếu</Badge>
                                            ) : (
                                              <Badge variant="outline">Đủ</Badge>
                                            )}
                                          </td>
                                        </tr>
                                      )
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            </div>

                            {requisition.items.some((i) => i.note) && (
                              <div>
                                <Label className="text-muted-foreground">Ghi chú</Label>
                                {requisition.items
                                  .filter((i) => i.note)
                                  .map((item) => (
                                    <div key={item.id} className="mt-1 rounded-lg bg-muted/50 p-3 text-sm">
                                      <span className="font-medium">{item.materialName}:</span> {item.note}
                                    </div>
                                  ))}
                              </div>
                            )}
                          </div>
                        </ScrollArea>
                      </DialogContent>
                    </Dialog>

                    <Dialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={() => {
                            setSelectedRequisition(requisition)
                            setApproveDialogOpen(true)
                          }}
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Duyệt
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Xác nhận phê duyệt</DialogTitle>
                          <DialogDescription>
                            Bạn có chắc chắn muốn phê duyệt phiếu đề nghị {selectedRequisition?.code}?
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label>Ghi chú (tùy chọn)</Label>
                            <Textarea placeholder="Nhập ghi chú phê duyệt..." className="mt-2" />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setApproveDialogOpen(false)}>
                            Hủy
                          </Button>
                          <Button onClick={handleApprove}>Xác nhận duyệt</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="flex-1"
                          onClick={() => {
                            setSelectedRequisition(requisition)
                            setRejectDialogOpen(true)
                          }}
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          Từ chối
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Từ chối phiếu đề nghị</DialogTitle>
                          <DialogDescription>
                            Vui lòng nhập lý do từ chối phiếu đề nghị {selectedRequisition?.code}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label>
                              Lý do từ chối <span className="text-destructive">*</span>
                            </Label>
                            <Textarea
                              placeholder="Nhập lý do từ chối..."
                              className="mt-2"
                              value={rejectReason}
                              onChange={(e) => setRejectReason(e.target.value)}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
                            Hủy
                          </Button>
                          <Button variant="destructive" onClick={handleReject} disabled={!rejectReason.trim()}>
                            Xác nhận từ chối
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
