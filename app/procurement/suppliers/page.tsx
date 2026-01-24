"use client"

import * as React from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { PageHeader } from "@/components/page-header"
import { DataTable } from "@/components/data-table"
import { StatusBadge } from "@/components/status-badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { suppliers } from "@/lib/mock-data"
import type { Supplier } from "@/lib/types"
import { Building2, Plus, Eye, Pencil, Star, Phone, Mail, MapPin, Shield, History } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

export default function SuppliersPage() {
  const [addDialogOpen, setAddDialogOpen] = React.useState(false)

  const activeSuppliers = suppliers.filter((s) => s.status === "active").length

  const columns = [
    {
      key: "code",
      header: "Mã NCC",
      cell: (item: Supplier) => <span className="font-medium">{item.code}</span>,
      searchable: true,
    },
    {
      key: "name",
      header: "Tên nhà cung cấp",
      cell: (item: Supplier) => (
        <div>
          <div className="font-medium">{item.name}</div>
          <div className="text-sm text-muted-foreground">{item.address}</div>
        </div>
      ),
      searchable: true,
    },
    {
      key: "contact",
      header: "Liên hệ",
      cell: (item: Supplier) => (
        <div className="text-sm">
          <div className="flex items-center gap-1">
            <Phone className="h-3 w-3 text-muted-foreground" />
            {item.phone}
          </div>
          <div className="flex items-center gap-1">
            <Mail className="h-3 w-3 text-muted-foreground" />
            {item.email}
          </div>
        </div>
      ),
    },
    {
      key: "gmp",
      header: "GMP",
      cell: (item: Supplier) =>
        item.gmpCertificate ? (
          <div>
            <Badge variant="outline" className="text-green-600 border-green-600">
              <Shield className="mr-1 h-3 w-3" />
              GMP
            </Badge>
            <div className="text-xs text-muted-foreground mt-1">
              HSD: {item.gmpExpiry ? new Date(item.gmpExpiry).toLocaleDateString("vi-VN") : "N/A"}
            </div>
          </div>
        ) : (
          <span className="text-muted-foreground text-sm">Chưa có</span>
        ),
    },
    {
      key: "rating",
      header: "Đánh giá",
      cell: (item: Supplier) => (
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="font-medium">{item.rating.toFixed(1)}</span>
        </div>
      ),
    },
    {
      key: "status",
      header: "Trạng thái",
      cell: (item: Supplier) => <StatusBadge status={item.status} />,
    },
    {
      key: "actions",
      header: "Thao tác",
      cell: (item: Supplier) => (
        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Eye className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh]">
              <DialogHeader>
                <DialogTitle>Hồ sơ nhà cung cấp</DialogTitle>
                <DialogDescription>{item.name}</DialogDescription>
              </DialogHeader>
              <Tabs defaultValue="info" className="mt-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="info">Thông tin chung</TabsTrigger>
                  <TabsTrigger value="documents">Hồ sơ pháp lý</TabsTrigger>
                  <TabsTrigger value="history">Lịch sử giao dịch</TabsTrigger>
                </TabsList>
                <ScrollArea className="h-[400px] mt-4">
                  <TabsContent value="info" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-muted-foreground">Mã nhà cung cấp</Label>
                        <p className="font-medium">{item.code}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Mã số thuế</Label>
                        <p className="font-medium">{item.taxCode}</p>
                      </div>
                      <div className="col-span-2">
                        <Label className="text-muted-foreground">Địa chỉ</Label>
                        <p className="font-medium flex items-start gap-2">
                          <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                          {item.address}
                        </p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Điện thoại</Label>
                        <p className="font-medium flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          {item.phone}
                        </p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Email</Label>
                        <p className="font-medium flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          {item.email}
                        </p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Đánh giá</Label>
                        <div className="flex items-center gap-1 mt-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-5 w-5 ${star <= item.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
                            />
                          ))}
                          <span className="ml-2 font-medium">{item.rating.toFixed(1)}/5</span>
                        </div>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Trạng thái</Label>
                        <div className="mt-1">
                          <StatusBadge status={item.status} />
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="documents" className="space-y-4">
                    <div className="grid gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-sm">Chứng nhận GMP</CardTitle>
                            {item.gmpCertificate && (
                              <Badge variant="outline" className="text-green-600">
                                Có hiệu lực
                              </Badge>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent>
                          {item.gmpCertificate ? (
                            <div className="space-y-2 text-sm">
                              <p>
                                <span className="text-muted-foreground">Số chứng nhận:</span>{" "}
                                <span className="font-medium">{item.gmpCertificate}</span>
                              </p>
                              <p>
                                <span className="text-muted-foreground">Ngày hết hạn:</span>{" "}
                                <span className="font-medium">
                                  {item.gmpExpiry ? new Date(item.gmpExpiry).toLocaleDateString("vi-VN") : "N/A"}
                                </span>
                              </p>
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground">Chưa có chứng nhận GMP</p>
                          )}
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-sm">Chứng nhận CO (Certificate of Origin)</CardTitle>
                            {item.coCertificate && (
                              <Badge variant="outline" className="text-green-600">
                                Có
                              </Badge>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent>
                          {item.coCertificate ? (
                            <p className="text-sm">
                              <span className="text-muted-foreground">Số chứng nhận:</span>{" "}
                              <span className="font-medium">{item.coCertificate}</span>
                            </p>
                          ) : (
                            <p className="text-sm text-muted-foreground">Chưa có</p>
                          )}
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-sm">Chứng nhận CQ (Certificate of Quality)</CardTitle>
                            {item.cqCertificate && (
                              <Badge variant="outline" className="text-green-600">
                                Có
                              </Badge>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent>
                          {item.cqCertificate ? (
                            <p className="text-sm">
                              <span className="text-muted-foreground">Số chứng nhận:</span>{" "}
                              <span className="font-medium">{item.cqCertificate}</span>
                            </p>
                          ) : (
                            <p className="text-sm text-muted-foreground">Chưa có</p>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                  <TabsContent value="history" className="space-y-4">
                    {item.transactionHistory.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Chưa có lịch sử giao dịch</p>
                      </div>
                    ) : (
                      <div className="rounded-lg border">
                        <table className="w-full text-sm">
                          <thead className="bg-muted/50">
                            <tr>
                              <th className="px-4 py-2 text-left font-medium">Mã PO</th>
                              <th className="px-4 py-2 text-left font-medium">Ngày</th>
                              <th className="px-4 py-2 text-right font-medium">Giá trị</th>
                              <th className="px-4 py-2 text-center font-medium">Trạng thái</th>
                            </tr>
                          </thead>
                          <tbody>
                            {item.transactionHistory.map((tx) => (
                              <tr key={tx.id} className="border-t">
                                <td className="px-4 py-2 font-medium text-primary">{tx.poCode}</td>
                                <td className="px-4 py-2">{new Date(tx.date).toLocaleDateString("vi-VN")}</td>
                                <td className="px-4 py-2 text-right">{tx.amount.toLocaleString("vi-VN")} VNĐ</td>
                                <td className="px-4 py-2 text-center">
                                  <StatusBadge status={tx.status} />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </TabsContent>
                </ScrollArea>
              </Tabs>
            </DialogContent>
          </Dialog>
          <Button variant="ghost" size="icon">
            <Pencil className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <DashboardLayout role="procurement" breadcrumbs={[{ label: "Nhà cung cấp" }]}>
      <div className="space-y-6">
        <PageHeader title="Quản lý nhà cung cấp" description="Quản lý hồ sơ và thông tin nhà cung cấp">
          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Thêm NCC mới
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Thêm nhà cung cấp mới</DialogTitle>
                <DialogDescription>Nhập thông tin nhà cung cấp để thêm vào hệ thống</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="code">Mã NCC</Label>
                    <Input id="code" placeholder="VD: NCC-004" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="taxCode">Mã số thuế</Label>
                    <Input id="taxCode" placeholder="VD: 0312345678" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Tên nhà cung cấp</Label>
                  <Input id="name" placeholder="Nhập tên đầy đủ của nhà cung cấp" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Địa chỉ</Label>
                  <Textarea id="address" placeholder="Nhập địa chỉ đầy đủ" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Điện thoại</Label>
                    <Input id="phone" placeholder="VD: 028-3771-0001" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="contact@example.com" />
                  </div>
                </div>
                <Separator />
                <h4 className="font-medium">Hồ sơ pháp lý (tùy chọn)</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="gmp">Số chứng nhận GMP</Label>
                    <Input id="gmp" placeholder="VD: GMP-2024-001" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gmpExpiry">Ngày hết hạn GMP</Label>
                    <Input id="gmpExpiry" type="date" />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
                  Hủy
                </Button>
                <Button onClick={() => setAddDialogOpen(false)}>Thêm nhà cung cấp</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </PageHeader>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Tổng NCC</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{suppliers.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Đang hoạt động</CardTitle>
              <Building2 className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{activeSuppliers}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Có GMP</CardTitle>
              <Shield className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{suppliers.filter((s) => s.gmpCertificate).length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Đánh giá TB</CardTitle>
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(suppliers.reduce((acc, s) => acc + s.rating, 0) / suppliers.length).toFixed(1)}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Danh sách nhà cung cấp</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable data={suppliers} columns={columns} searchPlaceholder="Tìm kiếm nhà cung cấp..." />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
