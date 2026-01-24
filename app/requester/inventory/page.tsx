"use client"
import { DashboardLayout } from "@/components/dashboard-layout"
import { PageHeader } from "@/components/page-header"
import { DataTable } from "@/components/data-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { materials } from "@/lib/mock-data"
import type { Material } from "@/lib/types"
import { Package, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export default function RequesterInventoryPage() {
  const lowStockCount = materials.filter((m) => m.currentStock < m.minStock).length
  const totalMaterials = materials.length

  const columns = [
    {
      key: "code",
      header: "Mã vật tư",
      cell: (item: Material) => <span className="font-medium">{item.code}</span>,
      searchable: true,
    },
    {
      key: "name",
      header: "Tên vật tư",
      cell: (item: Material) => item.name,
      searchable: true,
    },
    {
      key: "category",
      header: "Danh mục",
      cell: (item: Material) => <Badge variant="outline">{item.category}</Badge>,
    },
    {
      key: "currentStock",
      header: "Tồn kho",
      cell: (item: Material) => (
        <div className="flex items-center gap-2">
          <span className="font-medium">{item.currentStock}</span>
          <span className="text-muted-foreground">{item.unit}</span>
        </div>
      ),
    },
    {
      key: "minStock",
      header: "Tồn tối thiểu",
      cell: (item: Material) => (
        <span className="text-muted-foreground">
          {item.minStock} {item.unit}
        </span>
      ),
    },
    {
      key: "status",
      header: "Trạng thái",
      cell: (item: Material) => {
        const percentage = (item.currentStock / item.minStock) * 100
        const isLow = item.currentStock < item.minStock
        const isWarning = item.currentStock < item.minStock * 1.5 && !isLow

        return (
          <div className="space-y-2 min-w-[120px]">
            <Progress
              value={Math.min(percentage, 100)}
              className={isLow ? "bg-destructive/20" : isWarning ? "bg-yellow-200" : ""}
            />
            {isLow && (
              <div className="flex items-center gap-1 text-destructive text-xs">
                <AlertTriangle className="h-3 w-3" />
                Dưới mức tối thiểu
              </div>
            )}
            {isWarning && (
              <div className="flex items-center gap-1 text-yellow-600 text-xs">
                <TrendingDown className="h-3 w-3" />
                Sắp hết
              </div>
            )}
            {!isLow && !isWarning && (
              <div className="flex items-center gap-1 text-green-600 text-xs">
                <TrendingUp className="h-3 w-3" />
                Đủ dùng
              </div>
            )}
          </div>
        )
      },
    },
  ]

  return (
    <DashboardLayout role="requester" breadcrumbs={[{ label: "Xem tồn kho" }]}>
      <div className="space-y-6">
        <PageHeader title="Xem tồn kho hiện tại" description="Kiểm tra tồn kho trước khi tạo phiếu đề nghị" />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Tổng vật tư</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalMaterials}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Tồn kho thấp</CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{lowStockCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Nguyên liệu</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{materials.filter((m) => m.category === "Nguyên liệu").length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Bao bì</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{materials.filter((m) => m.category === "Bao bì").length}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Danh sách vật tư</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable data={materials} columns={columns} searchPlaceholder="Tìm kiếm vật tư..." />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
