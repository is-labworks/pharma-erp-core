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
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { finalInspections } from "@/lib/quality-mock-data";
import type { FinalInspection } from "@/lib/quality-types";
import {
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  TestTube2,
  Upload,
  FileCheck,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";

export default function FinalInspectionPage() {
  const [selectedInspection, setSelectedInspection] =
    React.useState<FinalInspection | null>(null);
  const [testDialogOpen, setTestDialogOpen] = React.useState(false);
  const [approvalDialogOpen, setApprovalDialogOpen] = React.useState(false);

  const pendingInspections = finalInspections.filter((f) => !f.releaseApproved);
  const approvedInspections = finalInspections.filter((f) => f.releaseApproved);

  const getProgressPercent = (inspection: FinalInspection) => {
    const total = inspection.tests.length;
    const completed = inspection.tests.filter(
      (t) => t.status === "passed" || t.status === "failed",
    ).length;
    return Math.round((completed / total) * 100);
  };

  return (
    <DashboardLayout
      role="qa_qc"
      breadcrumbs={[{ label: "Kiểm nghiệm thành phẩm" }]}
    >
      <div className="space-y-6">
        <PageHeader
          title="Kiểm nghiệm thành phẩm"
          description="Kiểm nghiệm thành phẩm trước khi phê duyệt nhập kho"
        />

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Tổng lô hàng
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {finalInspections.length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Chờ kiểm nghiệm
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {
                  finalInspections.filter(
                    (f) =>
                      f.overallStatus === "pending" ||
                      f.overallStatus === "in_progress",
                  ).length
                }
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Đã kiểm - Chờ duyệt
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {
                  finalInspections.filter(
                    (f) => f.overallStatus === "passed" && !f.releaseApproved,
                  ).length
                }
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Đã phê duyệt
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {approvedInspections.length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Inspections */}
        <Card>
          <CardHeader>
            <CardTitle>Lô hàng chờ kiểm nghiệm & phê duyệt</CardTitle>
            <CardDescription>
              {pendingInspections.length} lô hàng cần xử lý
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingInspections.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Shield className="h-12 w-12 text-green-500 mb-4" />
                  <h3 className="text-lg font-medium">
                    Không có lô hàng chờ kiểm nghiệm
                  </h3>
                  <p className="text-muted-foreground">
                    Tất cả lô hàng đã được kiểm nghiệm và phê duyệt
                  </p>
                </div>
              ) : (
                <div className="grid gap-4 lg:grid-cols-2">
                  {pendingInspections.map((inspection) => (
                    <Card key={inspection.id} className="overflow-hidden">
                      <CardHeader className="bg-purple-50 border-b">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg flex items-center gap-2">
                              <Shield className="h-5 w-5 text-purple-500" />
                              {inspection.code}
                            </CardTitle>
                            <CardDescription className="mt-1">
                              {inspection.medicineName}
                            </CardDescription>
                          </div>
                          <Badge
                            variant={
                              inspection.overallStatus === "passed"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {inspection.overallStatus === "pending" &&
                              "Chờ kiểm"}
                            {inspection.overallStatus === "in_progress" &&
                              "Đang kiểm"}
                            {inspection.overallStatus === "passed" &&
                              "Chờ phê duyệt"}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-4 space-y-4">
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="text-muted-foreground">
                              Số lô:
                            </span>
                            <p className="font-medium">
                              {inspection.batchNumber}
                            </p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              Số lượng:
                            </span>
                            <p className="font-medium">
                              {inspection.quantity.toLocaleString()}{" "}
                              {inspection.unit}
                            </p>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-muted-foreground">
                              Tiến độ kiểm nghiệm
                            </span>
                            <span className="font-medium">
                              {getProgressPercent(inspection)}%
                            </span>
                          </div>
                          <Progress
                            value={getProgressPercent(inspection)}
                            className="h-2"
                          />
                        </div>

                        <div>
                          <span className="text-sm text-muted-foreground">
                            Các test ({inspection.tests.length}):
                          </span>
                          <div className="mt-2 space-y-2">
                            {inspection.tests.map((test) => (
                              <div
                                key={test.id}
                                className="flex items-center justify-between rounded border p-2 text-sm"
                              >
                                <div className="flex items-center gap-2">
                                  {test.status === "passed" && (
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                  )}
                                  {test.status === "failed" && (
                                    <XCircle className="h-4 w-4 text-destructive" />
                                  )}
                                  {test.status === "in_progress" && (
                                    <Clock className="h-4 w-4 text-blue-500" />
                                  )}
                                  {test.status === "pending" && (
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                  )}
                                  <span>{test.testName}</span>
                                </div>
                                {test.result && (
                                  <Badge variant="outline" className="text-xs">
                                    {test.result}
                                  </Badge>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                className="flex-1 bg-transparent"
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                Chi tiết
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl">
                              <DialogHeader>
                                <DialogTitle>
                                  Chi tiết kiểm nghiệm thành phẩm
                                </DialogTitle>
                                <DialogDescription>
                                  Mã: {inspection.code}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label className="text-muted-foreground">
                                      Sản phẩm
                                    </Label>
                                    <p className="font-medium">
                                      {inspection.medicineName}
                                    </p>
                                  </div>
                                  <div>
                                    <Label className="text-muted-foreground">
                                      Mã sản phẩm
                                    </Label>
                                    <p className="font-medium">
                                      {inspection.medicineCode}
                                    </p>
                                  </div>
                                  <div>
                                    <Label className="text-muted-foreground">
                                      Số lô
                                    </Label>
                                    <p className="font-medium">
                                      {inspection.batchNumber}
                                    </p>
                                  </div>
                                  <div>
                                    <Label className="text-muted-foreground">
                                      Số lượng
                                    </Label>
                                    <p className="font-medium">
                                      {inspection.quantity.toLocaleString()}{" "}
                                      {inspection.unit}
                                    </p>
                                  </div>
                                </div>

                                <div>
                                  <Label className="text-muted-foreground">
                                    Kết quả các test
                                  </Label>
                                  <div className="mt-2 rounded-lg border">
                                    <table className="w-full text-sm">
                                      <thead className="bg-muted/50">
                                        <tr>
                                          <th className="px-4 py-2 text-left">
                                            Test
                                          </th>
                                          <th className="px-4 py-2 text-left">
                                            Phương pháp
                                          </th>
                                          <th className="px-4 py-2 text-left">
                                            Tiêu chuẩn
                                          </th>
                                          <th className="px-4 py-2 text-left">
                                            Kết quả
                                          </th>
                                          <th className="px-4 py-2 text-center">
                                            Trạng thái
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {inspection.tests.map((test) => (
                                          <tr
                                            key={test.id}
                                            className="border-t"
                                          >
                                            <td className="px-4 py-2">
                                              {test.testName}
                                            </td>
                                            <td className="px-4 py-2 text-xs text-muted-foreground">
                                              {test.testMethod}
                                            </td>
                                            <td className="px-4 py-2 text-xs">
                                              {test.specification}
                                            </td>
                                            <td className="px-4 py-2 font-medium">
                                              {test.result || "-"}
                                            </td>
                                            <td className="px-4 py-2 text-center">
                                              <Badge
                                                variant={
                                                  test.status === "passed"
                                                    ? "default"
                                                    : "secondary"
                                                }
                                              >
                                                {test.status === "passed" &&
                                                  "Đạt"}
                                                {test.status === "failed" &&
                                                  "Không đạt"}
                                                {test.status ===
                                                  "in_progress" && "Đang kiểm"}
                                                {test.status === "pending" &&
                                                  "Chờ kiểm"}
                                              </Badge>
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>

                                {inspection.documents.length > 0 && (
                                  <div>
                                    <Label className="text-muted-foreground">
                                      Tài liệu
                                    </Label>
                                    <div className="mt-2 space-y-2">
                                      {inspection.documents.map((doc) => (
                                        <div
                                          key={doc.id}
                                          className="flex items-center justify-between rounded border p-2 text-sm"
                                        >
                                          <span>{doc.name}</span>
                                          <Button variant="ghost" size="sm">
                                            Xem
                                          </Button>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>

                          {inspection.overallStatus !== "passed" && (
                            <Dialog
                              open={testDialogOpen}
                              onOpenChange={setTestDialogOpen}
                            >
                              <DialogTrigger asChild>
                                <Button
                                  className="flex-1"
                                  onClick={() => {
                                    setSelectedInspection(inspection);
                                    setTestDialogOpen(true);
                                  }}
                                >
                                  <TestTube2 className="mr-2 h-4 w-4" />
                                  Nhập kết quả
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>
                                    Nhập kết quả kiểm nghiệm
                                  </DialogTitle>
                                  <DialogDescription>
                                    {selectedInspection?.medicineName} - Lô{" "}
                                    {selectedInspection?.batchNumber}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 max-h-[400px] overflow-y-auto">
                                  {selectedInspection?.tests.map((test) => (
                                    <div
                                      key={test.id}
                                      className="space-y-2 p-4 rounded-lg border"
                                    >
                                      <div className="flex items-start justify-between">
                                        <div>
                                          <Label className="text-base">
                                            {test.testName}
                                          </Label>
                                          <p className="text-xs text-muted-foreground mt-1">
                                            Phương pháp: {test.testMethod}
                                          </p>
                                          <p className="text-xs text-muted-foreground">
                                            Tiêu chuẩn: {test.specification}
                                          </p>
                                        </div>
                                        <Badge
                                          variant={
                                            test.status === "passed"
                                              ? "default"
                                              : "secondary"
                                          }
                                        >
                                          {test.status}
                                        </Badge>
                                      </div>
                                      <Input
                                        placeholder="Nhập kết quả..."
                                        defaultValue={test.result}
                                      />
                                    </div>
                                  ))}
                                  <div>
                                    <Label>
                                      Upload Certificate of Analysis (CoA)
                                    </Label>
                                    <div className="mt-2 rounded-lg border-2 border-dashed p-6 text-center">
                                      <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                                      <p className="text-sm text-muted-foreground">
                                        Kéo thả file hoặc click để tải lên
                                      </p>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="mt-2 bg-transparent"
                                      >
                                        Chọn file
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button
                                    variant="outline"
                                    onClick={() => setTestDialogOpen(false)}
                                  >
                                    Hủy
                                  </Button>
                                  <Button
                                    onClick={() => setTestDialogOpen(false)}
                                  >
                                    Lưu kết quả
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          )}

                          {inspection.overallStatus === "passed" && (
                            <Dialog
                              open={approvalDialogOpen}
                              onOpenChange={setApprovalDialogOpen}
                            >
                              <DialogTrigger asChild>
                                <Button
                                  className="flex-1 bg-green-600 hover:bg-green-700"
                                  onClick={() => {
                                    setSelectedInspection(inspection);
                                    setApprovalDialogOpen(true);
                                  }}
                                >
                                  <FileCheck className="mr-2 h-4 w-4" />
                                  Phê duyệt nhập kho
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>
                                    Phê duyệt lô hàng nhập kho
                                  </DialogTitle>
                                  <DialogDescription>
                                    Xác nhận phê duyệt lô{" "}
                                    {selectedInspection?.batchNumber} để nhập
                                    kho
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="rounded-lg bg-green-50 border-green-200 border p-4">
                                    <div className="flex items-start gap-3">
                                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                                      <div>
                                        <p className="font-medium text-green-900">
                                          Tất cả test đã đạt yêu cầu
                                        </p>
                                        <p className="text-sm text-green-700 mt-1">
                                          Lô hàng đủ điều kiện để phê duyệt nhập
                                          kho thành phẩm
                                        </p>
                                      </div>
                                    </div>
                                  </div>

                                  <div>
                                    <Label>Ghi chú phê duyệt</Label>
                                    <Textarea
                                      placeholder="Nhập ghi chú (nếu có)..."
                                      className="mt-2"
                                    />
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button
                                    variant="outline"
                                    onClick={() => setApprovalDialogOpen(false)}
                                  >
                                    Hủy
                                  </Button>
                                  <Button
                                    className="bg-green-600 hover:bg-green-700"
                                    onClick={() => setApprovalDialogOpen(false)}
                                  >
                                    Xác nhận phê duyệt
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Approved Batches */}
        {approvedInspections.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Lô hàng đã phê duyệt</CardTitle>
              <CardDescription>
                {approvedInspections.length} lô đã được phê duyệt nhập kho
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {approvedInspections.map((inspection) => (
                  <div
                    key={inspection.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                        <Shield className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">{inspection.medicineName}</p>
                        <p className="text-sm text-muted-foreground">
                          Lô {inspection.batchNumber} •{" "}
                          {inspection.quantity.toLocaleString()}{" "}
                          {inspection.unit}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-green-500">Đã phê duyệt</Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        {inspection.approvedAt &&
                          new Date(inspection.approvedAt).toLocaleDateString(
                            "vi-VN",
                          )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
