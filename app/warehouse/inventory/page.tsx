"use client"
import { DashboardLayout } from "@/components/dashboard-layout"
import { PageHeader } from "@/components/page-header"
import { DataTable } from "@/components/data-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { inventoryItems, materials } from "@/lib/mock-data"
import type { InventoryItem } from "@/lib/types"
import { Warehouse, Package, AlertTriangle, Clock, MapPin, Calendar } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

export default function WarehouseInventoryPage() {
  const totalItems = inventoryItems.length
  const totalQuantity = inventoryItems.reduce((acc, item) => acc + item.quantity, 0)

  // Check for expiring items (within 6 months)
  const expiringItems = inventoryItems.filter((item) => {
    const expiryDate = new Date(item.expiryDate)
    const sixMonthsFromNow = new Date()
    sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6)
    return expiryDate <= sixMonthsFromNow
  })

  // Check for low stock
  const lowStockMaterials = materials.filter((m) => m.currentStock < m.minStock)

  const columns = [
    {
      key: "materialCode",
      header: "Mã vật tư",
      cell: (item: InventoryItem) => <span className="font-medium">{item.materialCode}</span>,
      searchable: true,
    },
    {
      key: "materialName",
      header: "Tên vật tư",
      cell: (item: InventoryItem) => item.materialName,
      searchable: true,
    },
    {
      key: "batchNumber",
      header: "Số lô",
      cell: (item: InventoryItem) => <Badge variant="outline">{item.batchNumber}</Badge>,
      searchable: true,
    },
    {
      key: "quantity",
      header: "Số lượng",
      cell: (item: InventoryItem) => (
        <span className="font-medium">
          {item.quantity} {item.unit}
        </span>
      ),
    },
    {
      key: "location",
      header: "Vị trí",
      cell: (item: InventoryItem) => (
        <div className="flex items-center gap-1">
          <MapPin className="h-3 w-3 text-muted-foreground" />
          {item.location}
        </div>
      ),
    },
    {
      key: "expiryDate",
      header: "Hạn sử dụng",
      cell: (item: InventoryItem) => {
        const expiryDate = new Date(item.expiryDate)
        const today = new Date()
        const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
        const isExpiringSoon = daysUntilExpiry <= 180 // 6 months
        const isExpired = daysUntilExpiry <= 0

        return (
          <div className="flex items-center gap-2">
            <Calendar className="h-3 w-3 text-muted-foreground" />
            <span className={cn(isExpired && "text-destructive", isExpiringSoon && !isExpired && "text-yellow-600")}>
              {expiryDate.toLocaleDateString("vi-VN")}
            </span>
            {isExpired && <Badge variant="destructive">Hết hạn</Badge>}
            {isExpiringSoon && !isExpired && (
              <Badge variant="secondary" className="text-yellow-600">
                Sắp hết hạn
              </Badge>
            )}
          </div>
        )
      },
    },
    {
      key: "supplierName",
      header: "Nhà cung cấp",
      cell: (item: InventoryItem) => <div className="max-w-[150px] truncate">{item.supplierName}</div>,
    },
  ]

  return (
    <DashboardLayout role="warehouse" breadcrumbs={[{ label: "Tồn kho" }]}>
      <div className="space-y-6">
        <PageHeader title="Quản lý tồn kho" description="Theo dõi tồn kho theo lô và hạn sử dụng" />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Tổng lô hàng</CardTitle>
              <Warehouse className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalItems}</div>
              <p className="text-xs text-muted-foreground">lô trong kho</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Tổng số lượng</CardTitle>
              <Package className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalQuantity.toLocaleString("vi-VN")}</div>
              <p className="text-xs text-muted-foreground">đơn vị</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Sắp hết hạn</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{expiringItems.length}</div>
              <p className="text-xs text-muted-foreground">lô trong 6 tháng</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Tồn kho thấp</CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{lowStockMaterials.length}</div>
              <p className="text-xs text-muted-foreground">vật tư dưới mức tối thiểu</p>
            </CardContent>
          </Card>
        </div>

        {(expiringItems.length > 0 || lowStockMaterials.length > 0) && (
          <div className="grid gap-4 lg:grid-cols-2">
            {lowStockMaterials.length > 0 && (
              <Card className="border-destructive/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-destructive">
                    <AlertTriangle className="h-5 w-5" />
                    Cảnh báo tồn kho thấp
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {lowStockMaterials.map((material) => (
                      <div key={material.id} className="flex items-center justify-between rounded-lg border p-3">
                        <div>
                          <p className="font-medium">{material.name}</p>
                          <p className="text-sm text-muted-foreground">{material.code}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-destructive">
                            {material.currentStock} / {material.minStock} {material.unit}
                          </p>
                          <Progress
                            value={(material.currentStock / material.minStock) * 100}
                            className="h-2 w-24 mt-1"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {expiringItems.length > 0 && (
              <Card className="border-yellow-500/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-yellow-600">
                    <Clock className="h-5 w-5" />
                    Lô hàng sắp hết hạn
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {expiringItems.slice(0, 5).map((item) => {
                      const daysUntilExpiry = Math.ceil(
                        (new Date(item.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
                      )
                      return (
                        <div key={item.id} className="flex items-center justify-between rounded-lg border p-3">
                          <div>
                            <p className="font-medium">{item.materialName}</p>
                            <p className="text-sm text-muted-foreground">Lô: {item.batchNumber}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-yellow-600">
                              {new Date(item.expiryDate).toLocaleDateString("vi-VN")}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {daysUntilExpiry > 0 ? `Còn ${daysUntilExpiry} ngày` : "Đã hết hạn"}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Danh sách tồn kho chi tiết</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable data={inventoryItems} columns={columns} searchPlaceholder="Tìm kiếm theo mã, tên, số lô..." />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
