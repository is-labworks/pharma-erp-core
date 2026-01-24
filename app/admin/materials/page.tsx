"use client"

import * as React from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { PageHeader } from "@/components/page-header"
import { DataTable } from "@/components/data-table"
import { StatusBadge } from "@/components/status-badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { materials } from "@/lib/mock-data"
import { Package, Search, Plus, Edit, AlertTriangle, CheckCircle } from "lucide-react"

export default function AdminMaterialsPage() {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)

  const filteredMaterials = materials.filter(
    (m) =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.code.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const columns = [
    { key: "code", label: "Mã vật tư", sortable: true },
    { key: "name", label: "Tên vật tư", sortable: true },
    { key: "category", label: "Danh mục", sortable: true },
    { key: "unit", label: "Đơn vị" },
    { key: "minStock", label: "Tồn tối thiểu", sortable: true },
    { key: "currentStock", label: "Tồn hiện tại", sortable: true },
    {
      key: "status",
      label: "Trạng thái",
      render: (_: unknown, row: (typeof materials)[0]) => {
        const isLow = row.currentStock < row.minStock
        return <StatusBadge status={isLow ? "rejected" : "completed"}>{isLow ? "Cần bổ sung" : "Đủ hàng"}</StatusBadge>
      },
    },
    {
      key: "actions",
      label: "Thao tác",
      render: () => (
        <Button variant="ghost" size="sm">
          <Edit className="h-4 w-4" />
        </Button>
      ),
    },
  ]

  const lowStockCount = materials.filter((m) => m.currentStock < m.minStock).length
  const categories = [...new Set(materials.map((m) => m.category))]

  return (
    <DashboardLayout role="admin" breadcrumbs={[{ label: "Danh mục vật tư" }]}>
      <div className="space-y-6">
        <PageHeader
          title="Danh mục vật tư"
          description="Quản lý danh mục nguyên liệu, tá dược và bao bì"
          icon={Package}
          actions={
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Thêm vật tư
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Thêm vật tư mới</DialogTitle>
                  <DialogDescription>Nhập thông tin vật tư cần quản lý</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>Mã vật tư</Label>
                      <Input placeholder="VD: NL-007" />
                    </div>
                    <div className="grid gap-2">
                      <Label>Danh mục</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn danh mục" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="nguyen-lieu">Nguyên liệu</SelectItem>
                          <SelectItem value="ta-duoc">Tá dược</SelectItem>
                          <SelectItem value="bao-bi">Bao bì</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label>Tên vật tư</Label>
                    <Input placeholder="Tên đầy đủ của vật tư" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>Đơn vị tính</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn đơn vị" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="kg">kg</SelectItem>
                          <SelectItem value="g">g</SelectItem>
                          <SelectItem value="cai">cái</SelectItem>
                          <SelectItem value="cuon">cuộn</SelectItem>
                          <SelectItem value="hop">hộp</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label>Tồn tối thiểu</Label>
                      <Input type="number" placeholder="0" />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Hủy
                  </Button>
                  <Button onClick={() => setIsDialogOpen(false)}>Thêm vật tư</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          }
        />

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng vật tư</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{materials.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Danh mục</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{categories.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Đủ hàng</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{materials.length - lowStockCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cần bổ sung</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{lowStockCount}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Danh sách vật tư</CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Tìm theo mã, tên..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <DataTable columns={columns} data={filteredMaterials} />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
