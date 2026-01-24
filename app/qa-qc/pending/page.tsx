"use client"

import * as React from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { qualityInspections } from "@/lib/mock-data"
import type { QualityInspection } from "@/lib/types"
import { TestTube, CheckCircle, XCircle, Clock, Eye, FlaskConical, Building2, FileText, Upload } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import { StatusBadge } from "@/components/status-badge"

export default function QAQCPendingPage() {
  const [selectedInspection, setSelectedInspection] = React.useState<QualityInspection | null>(null)
  const [resultDialogOpen, setResultDialogOpen] = React.useState(false)
  const [inspectionResult, setInspectionResult] = React.useState<"passed" | "failed">("passed")
  const [notes, setNotes] = React.useState("")

  const pendingInspections = qualityInspections.filter((q) => q.status === "waiting")

  const handleSubmitResult = () => {
    // Submit inspection result logic
    setResultDialogOpen(false)
    setSelectedInspection(null)
    setNotes("")
  }

  return (
    <DashboardLayout role="qa_qc" breadcrumbs={[{ label: "Lô hàng chờ kiểm" }]}>
      <div className="space-y-6">
        <PageHeader
          title="Lô hàng chờ kiểm nghiệm"
          description={`Có ${pendingInspections.length} lô hàng đang chờ kiểm tra chất lượng`}
        />

        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Chờ kiểm nghiệm</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingInspections.length}</div>
              <p className="text-xs text-muted-foreground">lô hàng cần xử lý</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Đạt trong tháng</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">15</div>
              <p className="text-xs text-muted-foreground">lô hàng</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Không đạt</CardTitle>
              <XCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">2</div>
              <p className="text-xs text-muted-foreground">lô hàng trong tháng</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {pendingInspections.length === 0 ? (
            <Card className="lg:col-span-2">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <TestTube className="h-12 w-12 text-green-500 mb-4" />
                <h3 className="text-lg font-medium">Không có lô hàng chờ kiểm</h3>
                <p className="text-muted-foreground">Tất cả lô hàng đã được kiểm nghiệm</p>
              </CardContent>
            </Card>
          ) : (
            pendingInspections.map((inspection) => (
              <Card key={inspection.id} className="overflow-hidden">
                <CardHeader className="bg-muted/30">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <FlaskConical className="h-5 w-5 text-primary" />
                        {inspection.code}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-3 w-3" />
                          {inspection.supplierName}
                        </div>
                      </CardDescription>
                    </div>
                    <StatusBadge status={inspection.status} />
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Mã PO:</span>
                      <p className="font-medium text-primary">{inspection.poCode}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Số lô:</span>
                      <p className="font-medium">{inspection.batchNumber}</p>
                    </div>
                  </div>

                  <div>
                    <span className="text-sm text-muted-foreground">Vật tư cần kiểm:</span>
                    <div className="mt-2 space-y-2">
                      {inspection.items.map((item, index) => (
                        <div key={index} className="flex items-center justify-between rounded-lg border p-3 text-sm">
                          <div>
                            <span className="font-medium">{item.materialName}</span>
                          </div>
                          <Badge variant="outline">
                            {item.quantity} {inspection.items.length > 0 ? "đơn vị" : ""}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="flex-1 bg-transparent">
                          <Eye className="mr-2 h-4 w-4" />
                          Chi tiết
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Chi tiết lô hàng kiểm nghiệm</DialogTitle>
                          <DialogDescription>Mã kiểm nghiệm: {inspection.code}</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-muted-foreground">Mã PO</Label>
                              <p className="font-medium">{inspection.poCode}</p>
                            </div>
                            <div>
                              <Label className="text-muted-foreground">Số lô</Label>
                              <p className="font-medium">{inspection.batchNumber}</p>
                            </div>
                            <div className="col-span-2">
                              <Label className="text-muted-foreground">Nhà cung cấp</Label>
                              <p className="font-medium">{inspection.supplierName}</p>
                            </div>
                          </div>

                          <div>
                            <Label className="text-muted-foreground">Danh sách vật tư</Label>
                            <div className="mt-2 rounded-lg border">
                              <table className="w-full text-sm">
                                <thead className="bg-muted/50">
                                  <tr>
                                    <th className="px-4 py-2 text-left font-medium">Vật tư</th>
                                    <th className="px-4 py-2 text-right font-medium">Số lượng</th>
                                    <th className="px-4 py-2 text-center font-medium">Trạng thái</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {inspection.items.map((item, index) => (
                                    <tr key={index} className="border-t">
                                      <td className="px-4 py-2">{item.materialName}</td>
                                      <td className="px-4 py-2 text-right">{item.quantity}</td>
                                      <td className="px-4 py-2 text-center">
                                        <Badge variant="secondary">Chờ kiểm</Badge>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>

                          {inspection.documents.length > 0 && (
                            <div>
                              <Label className="text-muted-foreground">Tài liệu đính kèm</Label>
                              <div className="mt-2 space-y-2">
                                {inspection.documents.map((doc) => (
                                  <div key={doc.id} className="flex items-center gap-2 text-sm">
                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                    <span>{doc.name}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Dialog open={resultDialogOpen} onOpenChange={setResultDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          className="flex-1"
                          onClick={() => {
                            setSelectedInspection(inspection)
                            setResultDialogOpen(true)
                          }}
                        >
                          <TestTube className="mr-2 h-4 w-4" />
                          Nhập kết quả
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Nhập kết quả kiểm nghiệm</DialogTitle>
                          <DialogDescription>Lô hàng: {selectedInspection?.batchNumber}</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label>Kết quả kiểm nghiệm</Label>
                            <RadioGroup
                              value={inspectionResult}
                              onValueChange={(v) => setInspectionResult(v as "passed" | "failed")}
                              className="mt-2"
                            >
                              <div className="flex items-center space-x-2 rounded-lg border p-3">
                                <RadioGroupItem value="passed" id="passed" />
                                <Label htmlFor="passed" className="flex items-center gap-2 cursor-pointer">
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                  Đạt yêu cầu
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2 rounded-lg border p-3">
                                <RadioGroupItem value="failed" id="failed" />
                                <Label htmlFor="failed" className="flex items-center gap-2 cursor-pointer">
                                  <XCircle className="h-4 w-4 text-destructive" />
                                  Không đạt
                                </Label>
                              </div>
                            </RadioGroup>
                          </div>

                          <div>
                            <Label>Ghi chú / Nhận xét</Label>
                            <Textarea
                              placeholder="Nhập nhận xét về kết quả kiểm nghiệm..."
                              className="mt-2"
                              value={notes}
                              onChange={(e) => setNotes(e.target.value)}
                            />
                          </div>

                          <div>
                            <Label>Đính kèm tài liệu</Label>
                            <div className="mt-2 rounded-lg border-2 border-dashed p-6 text-center">
                              <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                              <p className="text-sm text-muted-foreground">Kéo thả file hoặc click để tải lên</p>
                              <Input type="file" className="hidden" />
                              <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                                Chọn file
                              </Button>
                            </div>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setResultDialogOpen(false)}>
                            Hủy
                          </Button>
                          <Button onClick={handleSubmitResult}>Lưu kết quả</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
