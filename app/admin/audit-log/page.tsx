"use client"

import * as React from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { PageHeader } from "@/components/page-header"
import { DataTable } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Database, Search, Download, Filter } from "lucide-react"

const auditLogs = [
  {
    id: "log-1",
    timestamp: "2026-01-13 09:30:15",
    user: "Nguyễn Văn An",
    action: "CREATE",
    module: "Phiếu đề nghị",
    details: "Tạo phiếu PR-2026-0001",
    ipAddress: "192.168.1.100",
  },
  {
    id: "log-2",
    timestamp: "2026-01-13 09:45:22",
    user: "Trần Thị Bình",
    action: "APPROVE",
    module: "Phê duyệt",
    details: "Phê duyệt phiếu PR-2026-0001",
    ipAddress: "192.168.1.101",
  },
  {
    id: "log-3",
    timestamp: "2026-01-13 10:00:00",
    user: "Lê Văn Cường",
    action: "CREATE",
    module: "RFQ",
    details: "Tạo RFQ-2026-0001 từ PR-2026-0001",
    ipAddress: "192.168.1.102",
  },
  {
    id: "log-4",
    timestamp: "2026-01-13 10:30:45",
    user: "Lê Văn Cường",
    action: "UPDATE",
    module: "Nhà cung cấp",
    details: "Cập nhật thông tin NCC-001",
    ipAddress: "192.168.1.102",
  },
  {
    id: "log-5",
    timestamp: "2026-01-13 11:00:00",
    user: "Bùi Văn Inh",
    action: "CREATE",
    module: "Người dùng",
    details: "Tạo tài khoản user-10",
    ipAddress: "192.168.1.200",
  },
  {
    id: "log-6",
    timestamp: "2026-01-13 11:15:30",
    user: "Hoàng Văn Em",
    action: "UPDATE",
    module: "Kiểm nghiệm",
    details: "Nhập kết quả QI-2026-0001",
    ipAddress: "192.168.1.103",
  },
  {
    id: "log-7",
    timestamp: "2026-01-13 11:30:00",
    user: "Đặng Văn Giang",
    action: "CREATE",
    module: "Thanh toán",
    details: "Xác nhận thanh toán PO-2026-0001",
    ipAddress: "192.168.1.104",
  },
  {
    id: "log-8",
    timestamp: "2026-01-13 14:00:00",
    user: "Bùi Văn Inh",
    action: "DELETE",
    module: "Người dùng",
    details: "Xóa tài khoản user-05 (test)",
    ipAddress: "192.168.1.200",
  },
]

const actionColors: Record<string, string> = {
  CREATE: "bg-green-500/10 text-green-700 border-green-200",
  UPDATE: "bg-blue-500/10 text-blue-700 border-blue-200",
  DELETE: "bg-red-500/10 text-red-700 border-red-200",
  APPROVE: "bg-purple-500/10 text-purple-700 border-purple-200",
  REJECT: "bg-orange-500/10 text-orange-700 border-orange-200",
  LOGIN: "bg-gray-500/10 text-gray-700 border-gray-200",
}

export default function AuditLogPage() {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [actionFilter, setActionFilter] = React.useState("all")

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.module.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesAction = actionFilter === "all" || log.action === actionFilter
    return matchesSearch && matchesAction
  })

  const columns = [
    { key: "timestamp", label: "Thời gian", sortable: true },
    { key: "user", label: "Người dùng", sortable: true },
    {
      key: "action",
      label: "Hành động",
      render: (value: string) => (
        <Badge variant="outline" className={actionColors[value] || ""}>
          {value}
        </Badge>
      ),
    },
    { key: "module", label: "Module", sortable: true },
    { key: "details", label: "Chi tiết" },
    { key: "ipAddress", label: "IP Address" },
  ]

  return (
    <DashboardLayout role="admin" breadcrumbs={[{ label: "Nhật ký hệ thống" }]}>
      <div className="space-y-6">
        <PageHeader
          title="Nhật ký hệ thống"
          description="Theo dõi tất cả hoạt động trong hệ thống"
          icon={Database}
          actions={
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Xuất log
            </Button>
          }
        />

        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle>Lịch sử hoạt động</CardTitle>
              <div className="flex items-center gap-2">
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Tìm kiếm..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={actionFilter} onValueChange={setActionFilter}>
                  <SelectTrigger className="w-40">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Lọc hành động" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="CREATE">Tạo mới</SelectItem>
                    <SelectItem value="UPDATE">Cập nhật</SelectItem>
                    <SelectItem value="DELETE">Xóa</SelectItem>
                    <SelectItem value="APPROVE">Phê duyệt</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <DataTable columns={columns} data={filteredLogs} />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
