"use client"
import { DashboardLayout } from "@/components/dashboard-layout"
import { PageHeader } from "@/components/page-header"
import { DataTable } from "@/components/data-table"
import { StatusBadge } from "@/components/status-badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { qualityInspections, suppliers } from "@/lib/mock-data"
import { History, CheckCircle, XCircle, Eye, TestTube } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { QualityInspection } from "@/lib/types"

// Add some mock completed inspections
const completedInspections: QualityInspection[] = [
  {
    id: "qi-2",
    code: "QI-2025-0150",
    poId: "po-old-1",
    poCode: "PO-2025-0150",
    supplierId: "sup-1",
    supplierName: "Công ty TNHH Nguyên liệu Dược phẩm Á Châu",
    batchNumber: "LOT-2025-150",
    items: [{ materialId: "mat-1", materialName: "Paracetamol", quantity: 150, result: "passed" }],
    status: "passed",
    inspectedBy: "Hoàng Văn Em",
    inspectedAt: "2025-12-05T10:30:00Z",
    documents: [{ id: "doc-1", name: "Biên bản kiểm nghiệm.pdf", type: "pdf", url: "#", uploadedAt: "2025-12-05" }],
  },
  {
    id: "qi-3",
    code: "QI-2025-0148",
    poId: "po-old-2",
    poCode: "PO-2025-0148",
    supplierId: "sup-2",
    supplierName: "Công ty CP Hóa Dược Việt Nam",
    batchNumber: "LOT-2025-148",
    items: [{ materialId: "mat-2", materialName: "Amoxicillin Trihydrate", quantity: 30, result: "passed" }],
    status: "passed",
    inspectedBy: "Hoàng Văn Em",
    inspectedAt: "2025-11-22T14:00:00Z",
    documents: [],
  },
  {
    id: "qi-4",
    code: "QI-2025-0145",
    poId: "po-old-3",
    poCode: "PO-2025-0145",
    supplierId: "sup-3",
    supplierName: "Công ty TNHH Bao bì Y tế Sài Gòn",
    batchNumber: "LOT-2025-145",
    items: [{ materialId: "mat-5", materialName: "Chai nhựa HDPE 100ml", quantity: 5000, result: "failed" }],
    status: "failed",
    inspectedBy: "Hoàng Văn Em",
    inspectedAt: "2025-11-15T09:00:00Z",
    documents: [],
  },
]

export default function QAQCHistoryPage() {
  const allInspections = [...qualityInspections, ...completedInspections].filter((q) => q.status !== "waiting")

  const passedCount = allInspections.filter((q) => q.status === "passed").length
  const failedCount = allInspections.filter((q) => q.status === "failed").length

  const columns = [
    {
      key: "code",
      header: "Mã kiểm nghiệm",
      cell: (item: QualityInspection) => <span className="font-medium text-primary">{item.code}</span>,
      searchable: true,
    },
    {
      key: "batchNumber",
      header: "Số lô",
      cell: (item: QualityInspection) => item.batchNumber,
      searchable: true,
    },
    {
      key: "supplierName",
      header: "Nhà cung cấp",
      cell: (item: QualityInspection) => <div className="max-w-[200px] truncate">{item.supplierName}</div>,
      searchable: true,
    },
    {
      key: "items",
      header: "Vật tư",
      cell: (item: QualityInspection) => item.items[0]?.materialName,
    },
    {
      key: "status",
      header: "Kết quả",
      cell: (item: QualityInspection) => <StatusBadge status={item.status} />,
    },
    {
      key: "inspectedAt",
      header: "Ngày kiểm",
      cell: (item: QualityInspection) =>
        item.inspectedAt ? new Date(item.inspectedAt).toLocaleDateString("vi-VN") : "-",
    },
    {
      key: "actions",
      header: "Thao tác",
      cell: (item: QualityInspection) => (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon">
              <Eye className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Chi tiết kết quả kiểm nghiệm</DialogTitle>
              <DialogDescription>Mã: {item.code}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <TestTube className="h-8 w-8 text-primary" />
                  <div>
                    <p className="font-medium">{item.batchNumber}</p>
                    <p className="text-sm text-muted-foreground">{item.poCode}</p>
                  </div>
                </div>
                <StatusBadge status={item.status} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Nhà cung cấp</Label>
                  <p className="font-medium">{item.supplierName}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Người kiểm</Label>
                  <p className="font-medium">{item.inspectedBy || "-"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Ngày kiểm</Label>
                  <p className="font-medium">
                    {item.inspectedAt ? new Date(item.inspectedAt).toLocaleString("vi-VN") : "-"}
                  </p>
                </div>
              </div>

              <div>
                <Label className="text-muted-foreground">Kết quả chi tiết</Label>
                <div className="mt-2 rounded-lg border">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="px-4 py-2 text-left font-medium">Vật tư</th>
                        <th className="px-4 py-2 text-right font-medium">Số lượng</th>
                        <th className="px-4 py-2 text-center font-medium">Kết quả</th>
                      </tr>
                    </thead>
                    <tbody>
                      {item.items.map((i, index) => (
                        <tr key={index} className="border-t">
                          <td className="px-4 py-2">{i.materialName}</td>
                          <td className="px-4 py-2 text-right">{i.quantity}</td>
                          <td className="px-4 py-2 text-center">
                            <StatusBadge status={i.result || item.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      ),
    },
  ]

  return (
    <DashboardLayout role="qa_qc" breadcrumbs={[{ label: "Lịch sử kiểm tra" }]}>
      <div className="space-y-6">
        <PageHeader
          title="Lịch sử kiểm tra chất lượng"
          description="Xem lại kết quả kiểm nghiệm theo lô và nhà cung cấp"
        >
          <div className="flex items-center gap-2">
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Lọc theo NCC" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả NCC</SelectItem>
                {suppliers.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name.slice(0, 30)}...
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </PageHeader>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Tổng kiểm tra</CardTitle>
              <History className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{allInspections.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Đạt yêu cầu</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{passedCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Không đạt</CardTitle>
              <XCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{failedCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Tỷ lệ đạt</CardTitle>
              <TestTube className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {allInspections.length > 0 ? Math.round((passedCount / allInspections.length) * 100) : 0}%
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Danh sách kết quả kiểm nghiệm</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable data={allInspections} columns={columns} searchPlaceholder="Tìm kiếm theo mã, số lô..." />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
