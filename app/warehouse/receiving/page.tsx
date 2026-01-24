"use client"

import * as React from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { purchaseOrders } from "@/lib/mock-data"
import { StatusBadge } from "@/components/status-badge"
import { Truck, Package, Eye, CheckCircle, ClipboardCheck, Calendar, Building2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import type { PurchaseOrder } from "@/lib/types"

export default function WarehouseReceivingPage() {
  const [receiveDialogOpen, setReceiveDialogOpen] = React.useState(false)
  const [selectedPO, setSelectedPO] = React.useState<PurchaseOrder | null>(null)

  // Filter POs that are in processing status (waiting to be received)
  const pendingPOs = purchaseOrders.filter((po) => po.status === "processing")

  const handleReceive = () => {
    // Handle receiving logic
    setReceiveDialogOpen(false)
    setSelectedPO(null)
  }

  return (
    <DashboardLayout role="warehouse" breadcrumbs={[{ label: "Tiếp nhận hàng" }]}>
      <div className="space-y-6">
        <PageHeader
          title="Tiếp nhận hàng theo PO"
          description={`Có ${pendingPOs.length} đơn hàng đang chờ tiếp nhận`}
        />

        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Chờ tiếp nhận</CardTitle>
              <Truck className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingPOs.length}</div>
              <p className="text-xs text-muted-foreground">đơn hàng</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Đã nhận trong tháng</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">12</div>
              <p className="text-xs text-muted-foreground">đơn hàng</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Tổng vật tư</CardTitle>
              <Package className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingPOs.reduce((acc, po) => acc + po.items.length, 0)}</div>
              <p className="text-xs text-muted-foreground">loại chờ nhận</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {pendingPOs.length === 0 ? (
            <Card className="lg:col-span-2">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Truck className="h-12 w-12 text-green-500 mb-4" />
                <h3 className="text-lg font-medium">Không có đơn hàng chờ nhận</h3>
                <p className="text-muted-foreground">Tất cả đơn hàng đã được tiếp nhận</p>
              </CardContent>
            </Card>
          ) : (
            pendingPOs.map((po) => (
              <Card key={po.id} className="overflow-hidden">
                <CardHeader className="bg-muted/30">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Package className="h-5 w-5 text-primary" />
                        {po.code}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-3 w-3" />
                          {po.supplierName}
                        </div>
                      </CardDescription>
                    </div>
                    <StatusBadge status={po.status} />
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Ngày giao dự kiến:</span>
                      <p className="font-medium flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(po.deliveryDate).toLocaleDateString("vi-VN")}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Giá trị:</span>
                      <p className="font-medium">{po.totalAmount.toLocaleString("vi-VN")} VNĐ</p>
                    </div>
                  </div>

                  <div>
                    <span className="text-sm text-muted-foreground">Vật tư:</span>
                    <div className="mt-2 space-y-2">
                      {po.items.map((item, index) => (
                        <div key={index} className="flex items-center justify-between rounded-lg border p-3 text-sm">
                          <span className="font-medium">{item.materialName}</span>
                          <Badge variant="outline">
                            {item.quantity} {item.unit}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="flex-1 bg-transparent">
                          <Eye className="mr-2 h-4 w-4" />
                          Chi tiết
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Chi tiết đơn hàng</DialogTitle>
                          <DialogDescription>Mã PO: {po.code}</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-muted-foreground">Nhà cung cấp</Label>
                              <p className="font-medium">{po.supplierName}</p>
                            </div>
                            <div>
                              <Label className="text-muted-foreground">Ngày giao dự kiến</Label>
                              <p className="font-medium">{new Date(po.deliveryDate).toLocaleDateString("vi-VN")}</p>
                            </div>
                            <div>
                              <Label className="text-muted-foreground">Điều kiện thanh toán</Label>
                              <p className="font-medium">{po.paymentTerms}</p>
                            </div>
                            <div>
                              <Label className="text-muted-foreground">Tổng giá trị</Label>
                              <p className="font-medium text-primary">{po.totalAmount.toLocaleString("vi-VN")} VNĐ</p>
                            </div>
                          </div>

                          <div>
                            <Label className="text-muted-foreground">Danh sách vật tư</Label>
                            <div className="mt-2 rounded-lg border">
                              <table className="w-full text-sm">
                                <thead className="bg-muted/50">
                                  <tr>
                                    <th className="px-4 py-2 text-left font-medium">Vật tư</th>
                                    <th className="px-4 py-2 text-right font-medium">SL</th>
                                    <th className="px-4 py-2 text-right font-medium">Đơn giá</th>
                                    <th className="px-4 py-2 text-right font-medium">Thành tiền</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {po.items.map((item, index) => (
                                    <tr key={index} className="border-t">
                                      <td className="px-4 py-2">{item.materialName}</td>
                                      <td className="px-4 py-2 text-right">
                                        {item.quantity} {item.unit}
                                      </td>
                                      <td className="px-4 py-2 text-right">{item.unitPrice.toLocaleString("vi-VN")}</td>
                                      <td className="px-4 py-2 text-right font-medium">
                                        {item.totalPrice.toLocaleString("vi-VN")}
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

                    <Dialog open={receiveDialogOpen} onOpenChange={setReceiveDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          className="flex-1"
                          onClick={() => {
                            setSelectedPO(po)
                            setReceiveDialogOpen(true)
                          }}
                        >
                          <ClipboardCheck className="mr-2 h-4 w-4" />
                          Tiếp nhận
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Tiếp nhận hàng</DialogTitle>
                          <DialogDescription>
                            Kiểm tra và xác nhận tiếp nhận đơn hàng {selectedPO?.code}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="rounded-lg border p-4 space-y-4">
                            <h4 className="font-medium">Checklist kiểm tra</h4>
                            <div className="space-y-3">
                              <div className="flex items-center space-x-2">
                                <Checkbox id="qty" />
                                <label htmlFor="qty" className="text-sm cursor-pointer">
                                  Số lượng đúng theo PO
                                </label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox id="packaging" />
                                <label htmlFor="packaging" className="text-sm cursor-pointer">
                                  Bao bì nguyên vẹn, không hư hỏng
                                </label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox id="docs" />
                                <label htmlFor="docs" className="text-sm cursor-pointer">
                                  Có đầy đủ hồ sơ kèm theo (CoA, phiếu xuất kho)
                                </label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox id="label" />
                                <label htmlFor="label" className="text-sm cursor-pointer">
                                  Nhãn mác rõ ràng, đúng thông tin
                                </label>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Số lô nhà cung cấp</Label>
                              <Input placeholder="VD: LOT-2026-001" />
                            </div>
                            <div className="space-y-2">
                              <Label>Vị trí lưu kho</Label>
                              <Input placeholder="VD: Kho A1-01" />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label>Ghi chú</Label>
                            <Textarea placeholder="Nhập ghi chú nếu có..." />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setReceiveDialogOpen(false)}>
                            Hủy
                          </Button>
                          <Button onClick={handleReceive}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Xác nhận tiếp nhận
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
