"use client"

import * as React from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { PageHeader } from "@/components/page-header"
import { DataTable } from "@/components/data-table"
import { StatusBadge } from "@/components/status-badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { users, roleLabels } from "@/lib/mock-data"
import type { UserRole } from "@/lib/types"
import { Users, Search, Plus, Edit, Trash2, Shield, UserCheck } from "lucide-react"

const extendedUsers = users.map((u) => ({
  ...u,
  status: "active" as const,
  lastLogin: "2026-01-13 08:30",
}))

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)

  const filteredUsers = extendedUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.department.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const columns = [
    {
      key: "name",
      label: "Họ tên",
      sortable: true,
      render: (value: string, row: (typeof extendedUsers)[0]) => (
        <div>
          <p className="font-medium">{value}</p>
          <p className="text-xs text-muted-foreground">{row.email}</p>
        </div>
      ),
    },
    { key: "department", label: "Phòng ban", sortable: true },
    {
      key: "role",
      label: "Vai trò",
      sortable: true,
      render: (value: UserRole) => <Badge variant="outline">{roleLabels[value]}</Badge>,
    },
    {
      key: "status",
      label: "Trạng thái",
      render: (value: string) => (
        <StatusBadge status={value === "active" ? "completed" : "rejected"}>
          {value === "active" ? "Hoạt động" : "Khóa"}
        </StatusBadge>
      ),
    },
    { key: "lastLogin", label: "Đăng nhập cuối" },
    {
      key: "actions",
      label: "Thao tác",
      render: () => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-destructive">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  const activeUsers = extendedUsers.filter((u) => u.status === "active").length

  return (
    <DashboardLayout role="admin" breadcrumbs={[{ label: "Người dùng & Phân quyền" }]}>
      <div className="space-y-6">
        <PageHeader
          title="Quản lý người dùng"
          description="Quản lý tài khoản và phân quyền người dùng trong hệ thống"
          icon={Users}
          actions={
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Thêm người dùng
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Thêm người dùng mới</DialogTitle>
                  <DialogDescription>Nhập thông tin người dùng và phân quyền</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label>Họ và tên</Label>
                    <Input placeholder="Nguyễn Văn A" />
                  </div>
                  <div className="grid gap-2">
                    <Label>Email</Label>
                    <Input type="email" placeholder="email@pharma.vn" />
                  </div>
                  <div className="grid gap-2">
                    <Label>Phòng ban</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn phòng ban" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sanxuat">Sản xuất</SelectItem>
                        <SelectItem value="muahang">Mua hàng</SelectItem>
                        <SelectItem value="qaqc">QA/QC</SelectItem>
                        <SelectItem value="kho">Kho</SelectItem>
                        <SelectItem value="ketoan">Kế toán</SelectItem>
                        <SelectItem value="it">IT</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Vai trò</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn vai trò" />
                      </SelectTrigger>
                      <SelectContent>
                        {(Object.keys(roleLabels) as UserRole[]).map((role) => (
                          <SelectItem key={role} value={role}>
                            {roleLabels[role]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Hủy
                  </Button>
                  <Button onClick={() => setIsDialogOpen(false)}>Tạo người dùng</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          }
        />

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng người dùng</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{extendedUsers.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Đang hoạt động</CardTitle>
              <UserCheck className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{activeUsers}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vai trò</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Object.keys(roleLabels).length}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Danh sách người dùng</CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <DataTable columns={columns} data={filteredUsers} />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
