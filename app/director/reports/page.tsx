"use client"

import * as React from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart3, Download, FileText, TrendingUp, Calendar } from "lucide-react"

const reports = [
  {
    id: "1",
    name: "Báo cáo chi phí mua hàng",
    description: "Tổng hợp chi phí theo danh mục và nhà cung cấp",
    type: "monthly",
    lastGenerated: "2026-01-10",
  },
  {
    id: "2",
    name: "Báo cáo hiệu suất nhà cung cấp",
    description: "Đánh giá NCC theo thời gian giao hàng, chất lượng",
    type: "quarterly",
    lastGenerated: "2026-01-01",
  },
  {
    id: "3",
    name: "Báo cáo tồn kho",
    description: "Tình trạng tồn kho và cảnh báo hết hàng",
    type: "weekly",
    lastGenerated: "2026-01-12",
  },
  {
    id: "4",
    name: "Báo cáo tiết kiệm chi phí",
    description: "So sánh giá thực tế với giá thị trường",
    type: "monthly",
    lastGenerated: "2026-01-05",
  },
]

export default function DirectorReportsPage() {
  const [period, setPeriod] = React.useState("2026-Q1")

  return (
    <DashboardLayout role="director" breadcrumbs={[{ label: "Báo cáo" }]}>
      <div className="space-y-6">
        <PageHeader
          title="Báo cáo quản trị"
          description="Xem và tải các báo cáo tổng hợp về hoạt động mua sắm"
          icon={BarChart3}
          actions={
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2026-Q1">Q1 2026</SelectItem>
                <SelectItem value="2025-Q4">Q4 2025</SelectItem>
                <SelectItem value="2025-Q3">Q3 2025</SelectItem>
              </SelectContent>
            </Select>
          }
        />

        <div className="grid gap-4 md:grid-cols-2">
          {reports.map((report) => (
            <Card key={report.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{report.name}</CardTitle>
                      <CardDescription className="mt-1">{report.description}</CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {report.type === "weekly" ? "Hàng tuần" : report.type === "monthly" ? "Hàng tháng" : "Hàng quý"}
                    </span>
                    <span>Cập nhật: {report.lastGenerated}</span>
                  </div>
                  <Button size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Tải xuống
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Xu hướng mua sắm</CardTitle>
            <CardDescription>So sánh chi phí mua hàng qua các quý</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[
                { quarter: "Q1 2026", value: 1200000000, change: 12 },
                { quarter: "Q4 2025", value: 1070000000, change: -5 },
                { quarter: "Q3 2025", value: 1130000000, change: 8 },
                { quarter: "Q2 2025", value: 1050000000, change: 3 },
              ].map((item) => (
                <div key={item.quarter} className="flex items-center gap-4">
                  <div className="w-20 text-sm font-medium">{item.quarter}</div>
                  <div className="flex-1">
                    <div className="h-4 rounded-full bg-muted">
                      <div
                        className="h-4 rounded-full bg-primary"
                        style={{ width: `${(item.value / 1500000000) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="w-32 text-right text-sm">
                    {new Intl.NumberFormat("vi-VN", { notation: "compact" }).format(item.value)}
                  </div>
                  <div
                    className={`flex w-16 items-center justify-end gap-1 text-sm ${item.change >= 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    <TrendingUp className={`h-4 w-4 ${item.change < 0 ? "rotate-180" : ""}`} />
                    {Math.abs(item.change)}%
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
