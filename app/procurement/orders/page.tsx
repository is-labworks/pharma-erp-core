"use client"
import { DashboardLayout } from "@/components/dashboard-layout"
import { PageHeader } from "@/components/page-header"
import { DataTable } from "@/components/data-table"
import { StatusBadge } from "@/components/status-badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { purchaseOrders } from "@/lib/mock-data"
import type { PurchaseOrder } from "@/lib/types"
import { ShoppingCart, Plus, Eye, FileText, Truck, CheckCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"

export default function PurchaseOrdersPage() {
  const formatCurrency = (amount: number) => amount.toLocaleString("vi-VN") + " VNĐ"

  const columns = [
    {
      key: "code",
      header: "Mã PO",
      cell: (item: PurchaseOrder) => <span className="font-medium text-primary">{item.code}</span>,
      searchable: true,
    },
    {
      key: "supplierName",
      header: "Nhà cung cấp",
      cell: (item: PurchaseOrder) => <div className="max-w-[200px] truncate">{item.supplierName}</div>,
      searchable: true,
    },
    {
      key: "items",
      header: "Vật tư",
      cell: (item: PurchaseOrder) => (
        <div>
          <div>{item.items[0]?.materialName}</div>
          {item.items.length > 1 && (
            <span className="text-sm text-muted-foreground">+{item.items.length - 1} vật tư khác</span>
          )}
        </div>
      ),
    },
    {
      key: "totalAmount",
      header: "Giá trị",
      cell: (item: PurchaseOrder) => <span className="font-medium">{formatCurrency(item.totalAmount)}</span>,
    },
    {
      key: "deliveryDate",
      header: "Ngày giao",
      cell: (item: PurchaseOrder) => new Date(item.deliveryDate).toLocaleDateString("vi-VN"),
    },
    {
      key: "status",
      header: "Trạng thái",
      cell: (item: PurchaseOrder) => <StatusBadge status={item.status} />,
    },
    {
      key: "actions",
      header: "Thao tác",
      cell: (item: PurchaseOrder) => (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon">
              <Eye className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Chi tiết đơn mua hàng</DialogTitle>
              <DialogDescription>Mã PO: {item.code}</DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <ShoppingCart className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{item.code}</p>
                    <p className="text-sm text-muted-foreground">{item.supplierName}</p>
                  </div>
                </div>
                <StatusBadge status={item.status} />
              </div>

              <div>
                <h4 className="text-sm font-medium mb-3">Tiến trình đơn hàng</h4>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-muted-foreground">Tạo PO</span>
                      <span className="text-xs text-muted-foreground">Duyệt</span>
                      <span className="text-xs text-muted-foreground">Giao hàng</span>
                      <span className="text-xs text-muted-foreground">Hoàn thành</span>
                    </div>
                    <Progress value={item.status === "processing" ? 50 : item.status === "completed" ? 100 : 25} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Ngày tạo</Label>
                  <p className="font-medium">{new Date(item.createdAt).toLocaleDateString("vi-VN")}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Ngày duyệt</Label>
                  <p className="font-medium">
                    {item.approvedAt ? new Date(item.approvedAt).toLocaleDateString("vi-VN") : "-"}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Ngày giao hàng dự kiến</Label>
                  <p className="font-medium">{new Date(item.deliveryDate).toLocaleDateString("vi-VN")}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Điều kiện thanh toán</Label>
                  <p className="font-medium">{item.paymentTerms}</p>
                </div>
              </div>

              <Separator />

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
                      {item.items.map((i, index) => (
                        <tr key={index} className="border-t">
                          <td className="px-4 py-2">{i.materialName}</td>
                          <td className="px-4 py-2 text-right">
                            {i.quantity} {i.unit}
                          </td>
                          <td className="px-4 py-2 text-right">{formatCurrency(i.unitPrice)}</td>
                          <td className="px-4 py-2 text-right font-medium">{formatCurrency(i.totalPrice)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-muted/30">
                      <tr className="border-t">
                        <td colSpan={3} className="px-4 py-2 text-right font-medium">
                          Tổng cộng:
                        </td>
                        <td className="px-4 py-2 text-right font-bold text-primary">
                          {formatCurrency(item.totalAmount)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      ),
    },
  ]

  const processingCount = purchaseOrders.filter((p) => p.status === "processing").length
  const completedCount = purchaseOrders.filter((p) => p.status === "completed").length
  const totalValue = purchaseOrders.reduce((acc, p) => acc + p.totalAmount, 0)

  return (
    <DashboardLayout role="procurement" breadcrumbs={[{ label: "Đơn mua hàng (PO)" }]}>
      <div className="space-y-6">
        <PageHeader title="Quản lý đơn mua hàng (PO)" description="Theo dõi và quản lý các đơn mua hàng">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Tạo PO mới
          </Button>
        </PageHeader>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Tổng PO</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{purchaseOrders.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Đang xử lý</CardTitle>
              <Truck className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{processingCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Hoàn thành</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{completedCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Tổng giá trị</CardTitle>
              <ShoppingCart className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalValue)}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Danh sách đơn mua hàng</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable data={purchaseOrders} columns={columns} searchPlaceholder="Tìm kiếm đơn mua hàng..." />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
