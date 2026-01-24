"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { PageHeader } from "@/components/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { productionBatches } from "@/lib/warehouse-mock-data";
import { qualityInspections } from "@/lib/mock-data";
import {
  processQualityChecks,
  finalInspections,
} from "@/lib/quality-mock-data";
import {
  FileText,
  TestTube,
  Activity,
  Shield,
  Download,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";

export default function BatchRecordsPage() {
  const [selectedBatchId, setSelectedBatchId] = React.useState<string>(
    productionBatches[0]?.id || "",
  );

  const selectedBatch = productionBatches.find((b) => b.id === selectedBatchId);

  // Find all quality records for this batch
  const incomingRecords = qualityInspections.filter(
    (q) => q.batchNumber === selectedBatch?.batchNumber,
  );
  const inProcessRecords = processQualityChecks.filter(
    (p) => p.batchNumber === selectedBatch?.batchNumber,
  );
  const finalRecords = finalInspections.filter(
    (f) => f.batchNumber === selectedBatch?.batchNumber,
  );

  const allRecords = [
    ...incomingRecords.map((r) => ({
      type: "incoming",
      time: r.inspectedAt || r.poCode,
      data: r,
    })),
    ...inProcessRecords.map((r) => ({
      type: "in_process",
      time: r.checkDate,
      data: r,
    })),
    ...finalRecords.map((r) => ({
      type: "final",
      time: r.inspectionDate,
      data: r,
    })),
  ].sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());

  return (
    <DashboardLayout role="qa_qc" breadcrumbs={[{ label: "Hồ sơ lô hàng" }]}>
      <div className="space-y-6">
        <PageHeader
          title="Hồ sơ kiểm nghiệm theo lô sản xuất"
          description="Xem toàn bộ lịch sử kiểm nghiệm và tài liệu của lô hàng"
        >
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Xuất PDF
          </Button>
        </PageHeader>

        {/* Batch Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Chọn lô sản xuất</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <Label>Số lô</Label>
                <Select
                  value={selectedBatchId}
                  onValueChange={setSelectedBatchId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn lô sản xuất" />
                  </SelectTrigger>
                  <SelectContent>
                    {productionBatches.map((batch) => (
                      <SelectItem key={batch.id} value={batch.id}>
                        {batch.batchNumber} - {batch.productName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {selectedBatch && (
          <>
            {/* Batch Info */}
            <Card>
              <CardHeader>
                <CardTitle>Thông tin lô sản xuất</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <Label className="text-muted-foreground">Số lô</Label>
                    <p className="font-medium">{selectedBatch.batchNumber}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Sản phẩm</Label>
                    <p className="font-medium">{selectedBatch.productName}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Số lượng</Label>
                    <p className="font-medium">
                      {selectedBatch.initialQuantity.toLocaleString()}{" "}
                      {selectedBatch.unit}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">
                      Ngày sản xuất
                    </Label>
                    <p className="font-medium">
                      {new Date(
                        selectedBatch.manufactureDate,
                      ).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Hạn sử dụng</Label>
                    <p className="font-medium">
                      {new Date(selectedBatch.expiryDate).toLocaleDateString(
                        "vi-VN",
                      )}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Vị trí</Label>
                    <p className="font-medium">{selectedBatch.location}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">
                      Trạng thái chất lượng
                    </Label>
                    <Badge
                      variant={
                        selectedBatch.qualityStatus === "released"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {selectedBatch.qualityStatus === "released"
                        ? "Đã phê duyệt"
                        : selectedBatch.qualityStatus === "quarantine"
                          ? "Cách ly"
                          : "Đang kiểm"}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">
                      Trạng thái lô
                    </Label>
                    <Badge
                      variant={
                        selectedBatch.status === "available"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {selectedBatch.status === "available"
                        ? "Sẵn sàng"
                        : selectedBatch.status === "allocated"
                          ? "Đã phân bổ"
                          : "Đã dùng hết"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quality Records Summary */}
            <div className="grid gap-4 sm:grid-cols-3">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">
                      Kiểm tra nguyên liệu
                    </CardTitle>
                    <TestTube className="h-4 w-4 text-primary" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {incomingRecords.length}
                  </div>
                  <p className="text-xs text-muted-foreground">lần kiểm tra</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">
                      Kiểm tra công đoạn
                    </CardTitle>
                    <Activity className="h-4 w-4 text-blue-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {inProcessRecords.length}
                  </div>
                  <p className="text-xs text-muted-foreground">lần kiểm tra</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">
                      Kiểm nghiệm thành phẩm
                    </CardTitle>
                    <Shield className="h-4 w-4 text-purple-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {finalRecords.length}
                  </div>
                  <p className="text-xs text-muted-foreground">lần kiểm tra</p>
                </CardContent>
              </Card>
            </div>

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Timeline kiểm nghiệm</CardTitle>
                <CardDescription>
                  Lịch sử tất cả các hoạt động kiểm tra chất lượng
                </CardDescription>
              </CardHeader>
              <CardContent>
                {allRecords.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Chưa có hồ sơ kiểm nghiệm cho lô này</p>
                  </div>
                ) : (
                  <div className="space-y-4 relative before:absolute before:left-[15px] before:top-2 before:h-[calc(100%-16px)] before:w-[2px] before:bg-border">
                    {allRecords.map((record, index) => (
                      <div key={index} className="relative pl-10">
                        <div className="absolute left-0 top-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-white">
                          {record.type === "incoming" && (
                            <TestTube className="h-4 w-4 text-primary" />
                          )}
                          {record.type === "in_process" && (
                            <Activity className="h-4 w-4 text-blue-500" />
                          )}
                          {record.type === "final" && (
                            <Shield className="h-4 w-4 text-purple-500" />
                          )}
                        </div>
                        <Card>
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <div>
                                <CardTitle className="text-base">
                                  {record.type === "incoming" &&
                                    `Kiểm tra nguyên liệu - ${record.data.code}`}
                                  {record.type === "in_process" &&
                                    `Kiểm tra công đoạn ${record.data.processStage} - ${record.data.code}`}
                                  {record.type === "final" &&
                                    `Kiểm nghiệm thành phẩm - ${record.data.code}`}
                                </CardTitle>
                                <CardDescription>
                                  {new Date(record.time).toLocaleString(
                                    "vi-VN",
                                  )}
                                </CardDescription>
                              </div>
                              <div className="flex items-center gap-2">
                                {record.type === "incoming" && (
                                  <>
                                    {record.data.status === "passed" && (
                                      <CheckCircle className="h-4 w-4 text-green-500" />
                                    )}
                                    {record.data.status === "failed" && (
                                      <XCircle className="h-4 w-4 text-destructive" />
                                    )}
                                    {record.data.status === "waiting" && (
                                      <Clock className="h-4 w-4 text-yellow-500" />
                                    )}
                                    <Badge
                                      variant={
                                        record.data.status === "passed"
                                          ? "default"
                                          : record.data.status === "failed"
                                            ? "destructive"
                                            : "secondary"
                                      }
                                    >
                                      {record.data.status === "passed"
                                        ? "Đạt"
                                        : record.data.status === "failed"
                                          ? "Không đạt"
                                          : "Chờ kiểm"}
                                    </Badge>
                                  </>
                                )}
                                {record.type === "in_process" && (
                                  <>
                                    {record.data.status === "passed" && (
                                      <CheckCircle className="h-4 w-4 text-green-500" />
                                    )}
                                    {record.data.status === "failed" && (
                                      <XCircle className="h-4 w-4 text-destructive" />
                                    )}
                                    <Badge
                                      variant={
                                        record.data.status === "passed"
                                          ? "default"
                                          : record.data.status === "failed"
                                            ? "destructive"
                                            : "secondary"
                                      }
                                    >
                                      {record.data.status === "passed"
                                        ? "Đạt"
                                        : record.data.status === "failed"
                                          ? "Không đạt"
                                          : "Đang kiểm"}
                                    </Badge>
                                  </>
                                )}
                                {record.type === "final" && (
                                  <>
                                    {record.data.overallStatus === "passed" && (
                                      <CheckCircle className="h-4 w-4 text-green-500" />
                                    )}
                                    <Badge
                                      variant={
                                        record.data.overallStatus === "passed"
                                          ? "default"
                                          : "secondary"
                                      }
                                    >
                                      {record.data.releaseApproved
                                        ? "Đã phê duyệt"
                                        : record.data.overallStatus === "passed"
                                          ? "Đạt"
                                          : "Đang kiểm"}
                                    </Badge>
                                  </>
                                )}
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              {record.type === "incoming" && (
                                <>
                                  <p className="text-sm">
                                    <span className="text-muted-foreground">
                                      Nhà cung cấp:
                                    </span>{" "}
                                    <span className="font-medium">
                                      {record.data.supplierName}
                                    </span>
                                  </p>
                                  <p className="text-sm">
                                    <span className="text-muted-foreground">
                                      Người kiểm:
                                    </span>{" "}
                                    <span className="font-medium">
                                      {record.data.inspectedBy || "-"}
                                    </span>
                                  </p>
                                  <div className="text-sm">
                                    <span className="text-muted-foreground">
                                      Vật tư:
                                    </span>
                                    <div className="mt-1 space-y-1">
                                      {record.data.items.map((item, i) => (
                                        <div key={i} className="ml-4">
                                          • {item.materialName} ({item.quantity}
                                          )
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </>
                              )}
                              {record.type === "in_process" && (
                                <>
                                  <p className="text-sm">
                                    <span className="text-muted-foreground">
                                      Kế hoạch SX:
                                    </span>{" "}
                                    <span className="font-medium">
                                      {record.data.productionPlanCode}
                                    </span>
                                  </p>
                                  <p className="text-sm">
                                    <span className="text-muted-foreground">
                                      Người kiểm:
                                    </span>{" "}
                                    <span className="font-medium">
                                      {record.data.inspector}
                                    </span>
                                  </p>
                                  <div className="text-sm">
                                    <span className="text-muted-foreground">
                                      Các test ({record.data.tests.length}):
                                    </span>
                                    <div className="mt-1 space-y-1">
                                      {record.data.tests.map((test, i) => (
                                        <div
                                          key={i}
                                          className="ml-4 flex items-center justify-between"
                                        >
                                          <span>• {test.testName}</span>
                                          {test.result && (
                                            <Badge
                                              variant="outline"
                                              className="text-xs"
                                            >
                                              {test.result}
                                            </Badge>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                  {record.data.notes && (
                                    <p className="text-sm rounded bg-yellow-50 border p-2 text-yellow-800">
                                      {record.data.notes}
                                    </p>
                                  )}
                                </>
                              )}
                              {record.type === "final" && (
                                <>
                                  <p className="text-sm">
                                    <span className="text-muted-foreground">
                                      Sản phẩm:
                                    </span>{" "}
                                    <span className="font-medium">
                                      {record.data.medicineName}
                                    </span>
                                  </p>
                                  <p className="text-sm">
                                    <span className="text-muted-foreground">
                                      Số lượng:
                                    </span>{" "}
                                    <span className="font-medium">
                                      {record.data.quantity.toLocaleString()}{" "}
                                      {record.data.unit}
                                    </span>
                                  </p>
                                  <p className="text-sm">
                                    <span className="text-muted-foreground">
                                      Người kiểm:
                                    </span>{" "}
                                    <span className="font-medium">
                                      {record.data.inspector}
                                    </span>
                                  </p>
                                  {record.data.releaseApproved && (
                                    <p className="text-sm">
                                      <span className="text-muted-foreground">
                                        Người phê duyệt:
                                      </span>{" "}
                                      <span className="font-medium">
                                        {record.data.approvedBy}
                                      </span>
                                    </p>
                                  )}
                                  <div className="text-sm">
                                    <span className="text-muted-foreground">
                                      Các test ({record.data.tests.length}):
                                    </span>
                                    <div className="mt-1 space-y-1">
                                      {record.data.tests.map((test, i) => (
                                        <div
                                          key={i}
                                          className="ml-4 flex items-center justify-between"
                                        >
                                          <span>• {test.testName}</span>
                                          {test.result && (
                                            <Badge
                                              variant="outline"
                                              className="text-xs"
                                            >
                                              {test.result}
                                            </Badge>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                  {record.data.documents.length > 0 && (
                                    <div className="text-sm">
                                      <span className="text-muted-foreground">
                                        Tài liệu ({record.data.documents.length}
                                        ):
                                      </span>
                                      <div className="mt-1 space-y-1">
                                        {record.data.documents.map((doc, i) => (
                                          <div key={i} className="ml-4">
                                            • {doc.name}
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
