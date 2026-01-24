"use client"
import { DashboardLayout } from "@/components/dashboard-layout"
import { PageHeader } from "@/components/page-header"
import { KpiCard } from "@/components/kpi-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { purchaseRequisitions, purchaseOrders, suppliers, materials } from "@/lib/mock-data"
import { LayoutDashboard, Building2, ShoppingCart, AlertTriangle, CheckCircle, Clock, ArrowRight } from "lucide-react"

export default function DirectorOverviewPage() {
  const pendingApprovals = purchaseRequisitions.filter((pr) => pr.status === "pending").length
  const totalPOValue = purchaseOrders.reduce((sum, po) => sum + po.totalAmount, 0)
  const activeSuppliers = suppliers.filter((s) => s.status === "active").length
  const lowStockMaterials = materials.filter((m) => m.currentStock < m.minStock).length

  return (
    <DashboardLayout role="director" breadcrumbs={[{ label: "Tổng quan" }]}>
      <div className="space-y-6">
        <PageHeader
          title="Dashboard Ban Giám đốc"
          description="Tổng quan hoạt động mua sắm và các chỉ số quan trọng"
          icon={LayoutDashboard}
        />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            title="Chờ phê duyệt"
            value={pendingApprovals}
            icon={Clock}
            description="Phiếu đề nghị cần duyệt"
            trend={pendingApprovals > 2 ? "up" : "down"}
            trendValue={pendingApprovals > 2 ? "Cần xử lý" : "Bình thường"}
          />
          <KpiCard
            title="Giá trị PO tháng này"
            value={new Intl.NumberFormat("vi-VN", { notation: "compact" }).format(totalPOValue)}
            icon={ShoppingCart}
            description="Tổng giá trị đơn mua hàng"
            trend="up"
            trendValue="+12% so với tháng trước"
          />
          <KpiCard
            title="Nhà cung cấp"
            value={activeSuppliers}
            icon={Building2}
            description="NCC đang hoạt động"
            trend="neutral"
            trendValue="Ổn định"
          />
          <KpiCard
            title="Cảnh báo tồn kho"
            value={lowStockMaterials}
            icon={AlertTriangle}
            description="Vật tư dưới mức tối thiểu"
            trend={lowStockMaterials > 2 ? "up" : "down"}
            trendValue={lowStockMaterials > 2 ? "Cần bổ sung" : "Đủ hàng"}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Phiếu chờ phê duyệt giá trị cao</CardTitle>
              <CardDescription>Các yêu cầu mua hàng cần Ban Giám đốc duyệt</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {purchaseRequisitions
                  .filter((pr) => pr.status === "pending")
                  .map((pr) => (
                    <div key={pr.id} className="flex items-center justify-between rounded-lg border p-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{pr.code}</span>
                          <Badge variant="outline">{pr.department}</Badge>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">{pr.purpose}</p>
                        <p className="mt-1 text-xs text-muted-foreground">Người đề xuất: {pr.requesterName}</p>
                      </div>
                      <Button size="sm">
                        Xem chi tiết
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                {purchaseRequisitions.filter((pr) => pr.status === "pending").length === 0 && (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <CheckCircle className="h-12 w-12 text-green-500" />
                    <p className="mt-2 text-sm text-muted-foreground">Không có phiếu nào chờ duyệt</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Hiệu suất mua hàng</CardTitle>
              <CardDescription>Các chỉ số KPI quan trọng</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Tỷ lệ giao hàng đúng hạn</span>
                    <span className="text-sm font-bold text-green-600">94%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted">
                    <div className="h-2 w-[94%] rounded-full bg-green-500" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Tỷ lệ đạt chất lượng</span>
                    <span className="text-sm font-bold text-green-600">98%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted">
                    <div className="h-2 w-[98%] rounded-full bg-green-500" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Tiết kiệm chi phí</span>
                    <span className="text-sm font-bold text-blue-600">8.5%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted">
                    <div className="h-2 w-[85%] rounded-full bg-blue-500" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Thời gian xử lý trung bình</span>
                    <span className="text-sm font-bold">5.2 ngày</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted">
                    <div className="h-2 w-[65%] rounded-full bg-yellow-500" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Top Nhà cung cấp theo giá trị</CardTitle>
            <CardDescription>Nhà cung cấp có giá trị giao dịch cao nhất trong năm</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {suppliers
                .sort((a, b) => {
                  const aTotal = a.transactionHistory.reduce((sum, t) => sum + t.amount, 0)
                  const bTotal = b.transactionHistory.reduce((sum, t) => sum + t.amount, 0)
                  return bTotal - aTotal
                })
                .slice(0, 5)
                .map((supplier, index) => {
                  const totalValue = supplier.transactionHistory.reduce((sum, t) => sum + t.amount, 0)
                  return (
                    <div key={supplier.id} className="flex items-center gap-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{supplier.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {supplier.transactionHistory.length} giao dịch • Rating: {supplier.rating}/5
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                            notation: "compact",
                          }).format(totalValue)}
                        </p>
                        {supplier.gmpCertificate && (
                          <Badge variant="outline" className="mt-1 text-xs">
                            GMP
                          </Badge>
                        )}
                      </div>
                    </div>
                  )
                })}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
