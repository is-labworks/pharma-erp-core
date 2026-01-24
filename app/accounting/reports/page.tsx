"use client"

import * as React from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Receipt, Download, TrendingUp, TrendingDown, BarChart3, PieChart } from "lucide-react"

const monthlyData = [
  { month: "T1", expense: 450000000, budget: 500000000 },
  { month: "T2", expense: 380000000, budget: 500000000 },
  { month: "T3", expense: 520000000, budget: 500000000 },
  { month: "T4", expense: 410000000, budget: 500000000 },
  { month: "T5", expense: 490000000, budget: 500000000 },
  { month: "T6", expense: 460000000, budget: 500000000 },
]

const categoryData = [
  { category: "Nguyên liệu", amount: 1200000000, percentage: 45 },
  { category: "Tá dược", amount: 650000000, percentage: 25 },
  { category: "Bao bì", amount: 400000000, percentage: 15 },
  { category: "Thiết bị", amount: 250000000, percentage: 10 },
  { category: "Khác", amount: 100000000, percentage: 5 },
]

export default function AccountingReportsPage() {
  const [period, setPeriod] = React.useState("2026")

  const totalExpense = monthlyData.reduce((sum, d) => sum + d.expense, 0)
  const totalBudget = monthlyData.reduce((sum, d) => sum + d.budget, 0)
  const variance = totalBudget - totalExpense

  return (
    <DashboardLayout role="accounting" breadcrumbs={[{ label: "Báo cáo chi phí" }]}>
      <div className="space-y-6">
        <PageHeader
          title="Báo cáo chi phí"
          description="Phân tích chi phí mua hàng theo thời gian và danh mục"
          icon={Receipt}
          actions={
            <div className="flex items-center gap-2">
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2026">2026</SelectItem>
                  <SelectItem value="2025">2025</SelectItem>
                  <SelectItem value="2024">2024</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Xuất báo cáo
              </Button>
            </div>
          }
        />

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng chi phí</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", notation: "compact" }).format(
                  totalExpense,
                )}
              </div>
              <p className="text-xs text-muted-foreground">6 tháng đầu năm {period}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ngân sách</CardTitle>
              <PieChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", notation: "compact" }).format(
                  totalBudget,
                )}
              </div>
              <p className="text-xs text-muted-foreground">Sử dụng {Math.round((totalExpense / totalBudget) * 100)}%</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Chênh lệch</CardTitle>
              {variance >= 0 ? (
                <TrendingDown className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingUp className="h-4 w-4 text-red-500" />
              )}
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${variance >= 0 ? "text-green-600" : "text-red-600"}`}>
                {variance >= 0 ? "+" : ""}
                {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", notation: "compact" }).format(
                  variance,
                )}
              </div>
              <p className="text-xs text-muted-foreground">{variance >= 0 ? "Tiết kiệm" : "Vượt ngân sách"}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Chi phí theo tháng</CardTitle>
              <CardDescription>So sánh chi phí thực tế với ngân sách</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {monthlyData.map((d) => (
                  <div key={d.month} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{d.month}</span>
                      <span className="text-muted-foreground">
                        {new Intl.NumberFormat("vi-VN", { notation: "compact" }).format(d.expense)} /{" "}
                        {new Intl.NumberFormat("vi-VN", { notation: "compact" }).format(d.budget)}
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-muted">
                      <div
                        className={`h-2 rounded-full ${d.expense > d.budget ? "bg-red-500" : "bg-primary"}`}
                        style={{ width: `${Math.min((d.expense / d.budget) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Chi phí theo danh mục</CardTitle>
              <CardDescription>Phân bổ chi phí theo loại vật tư</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categoryData.map((d, index) => {
                  const colors = ["bg-blue-500", "bg-green-500", "bg-yellow-500", "bg-purple-500", "bg-gray-500"]
                  return (
                    <div key={d.category} className="flex items-center gap-4">
                      <div className={`h-3 w-3 rounded-full ${colors[index]}`} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{d.category}</span>
                          <span className="text-sm text-muted-foreground">{d.percentage}%</span>
                        </div>
                        <div className="mt-1 h-2 rounded-full bg-muted">
                          <div className={`h-2 rounded-full ${colors[index]}`} style={{ width: `${d.percentage}%` }} />
                        </div>
                      </div>
                      <span className="w-24 text-right text-sm">
                        {new Intl.NumberFormat("vi-VN", { notation: "compact" }).format(d.amount)}
                      </span>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
