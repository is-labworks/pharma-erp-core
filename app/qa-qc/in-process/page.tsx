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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { processQualityChecks } from "@/lib/quality-mock-data";
import type { ProcessQualityCheck, TestStatus } from "@/lib/quality-types";
import {
  Activity,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  TestTube2,
  FilePlus,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function InProcessQCPage() {
  const [selectedStage, setSelectedStage] = React.useState<string>("all");
  const [selectedStatus, setSelectedStatus] = React.useState<string>("all");
  const [selectedCheck, setSelectedCheck] =
    React.useState<ProcessQualityCheck | null>(null);
  const [testResultsOpen, setTestResultsOpen] = React.useState(false);

  // Get unique stages
  const stages = Array.from(
    new Set(processQualityChecks.map((p) => p.processStage)),
  );

  // Filter checks
  const filteredChecks = processQualityChecks.filter((check) => {
    if (selectedStage !== "all" && check.processStage !== selectedStage)
      return false;
    if (selectedStatus !== "all" && check.status !== selectedStatus)
      return false;
    return true;
  });

  const getStatusBadge = (status: TestStatus) => {
    switch (status) {
      case "passed":
        return <Badge className="bg-green-500">Đạt</Badge>;
      case "failed":
        return <Badge variant="destructive">Không đạt</Badge>;
      case "in_progress":
        return <Badge className="bg-blue-500">Đang kiểm</Badge>;
      case "pending":
        return <Badge variant="secondary">Chờ kiểm</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: TestStatus) => {
    switch (status) {
      case "passed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-destructive" />;
      case "in_progress":
        return <Clock className="h-4 w-4 text-blue-500" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <DashboardLayout
      role="qa_qc"
      breadcrumbs={[{ label: "Kiểm tra công đoạn" }]}
    >
      <div className="space-y-6">
        <PageHeader
          title="Kiểm tra chất lượng trong quá trình sản xuất"
          description="Kiểm tra và ghi nhận kết quả chất lượng từng công đoạn sản xuất"
        >
          <Button>
            <FilePlus className="mr-2 h-4 w-4" />
            Tạo phiếu kiểm tra mới
          </Button>
        </PageHeader>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-4">
              <div className="w-[200px]">
                <Label>Công đoạn</Label>
                <Select value={selectedStage} onValueChange={setSelectedStage}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn công đoạn" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả công đoạn</SelectItem>
                    {stages.map((stage) => (
                      <SelectItem key={stage} value={stage}>
                        {stage}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-[200px]">
                <Label>Trạng thái</Label>
                <Select
                  value={selectedStatus}
                  onValueChange={setSelectedStatus}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="pending">Chờ kiểm</SelectItem>
                    <SelectItem value="in_progress">Đang kiểm</SelectItem>
                    <SelectItem value="passed">Đạt</SelectItem>
                    <SelectItem value="failed">Không đạt</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Tổng kiểm tra
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {processQualityChecks.length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Đang kiểm</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {
                  processQualityChecks.filter((p) => p.status === "in_progress")
                    .length
                }
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Đạt</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {
                  processQualityChecks.filter((p) => p.status === "passed")
                    .length
                }
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Không đạt</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                {
                  processQualityChecks.filter((p) => p.status === "failed")
                    .length
                }
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Checks List */}
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">
              Tất cả ({filteredChecks.length})
            </TabsTrigger>
            {stages.map((stage) => (
              <TabsTrigger key={stage} value={stage}>
                {stage} (
                {
                  processQualityChecks.filter((p) => p.processStage === stage)
                    .length
                }
                )
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-2">
              {filteredChecks.map((check) => (
                <Card key={check.id} className="overflow-hidden">
                  <CardHeader className="bg-muted/30">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Activity className="h-5 w-5 text-blue-500" />
                          {check.code}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          Công đoạn:{" "}
                          <span className="font-medium">
                            {check.processStage}
                          </span>
                        </CardDescription>
                      </div>
                      {getStatusBadge(check.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-3">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-muted-foreground">
                          Kế hoạch SX:
                        </span>
                        <p className="font-medium text-primary">
                          {check.productionPlanCode}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Số lô:</span>
                        <p className="font-medium">{check.batchNumber}</p>
                      </div>
                    </div>

                    <div>
                      <span className="text-sm text-muted-foreground">
                        Người kiểm:
                      </span>
                      <p className="text-sm font-medium">{check.inspector}</p>
                    </div>

                    <div>
                      <span className="text-sm text-muted-foreground">
                        Các test ({check.tests.length}):
                      </span>
                      <div className="mt-2 space-y-2">
                        {check.tests.map((test) => (
                          <div
                            key={test.id}
                            className="flex items-center justify-between rounded border p-2 text-sm"
                          >
                            <div className="flex items-center gap-2">
                              {getStatusIcon(test.status)}
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

                    {check.notes && (
                      <div className="rounded bg-yellow-50 border-yellow-200 border p-2">
                        <p className="text-xs text-yellow-800">{check.notes}</p>
                      </div>
                    )}

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
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>
                              Chi tiết kiểm tra công đoạn
                            </DialogTitle>
                            <DialogDescription>
                              Mã: {check.code}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="text-muted-foreground">
                                  Kế hoạch sản xuất
                                </Label>
                                <p className="font-medium">
                                  {check.productionPlanCode}
                                </p>
                              </div>
                              <div>
                                <Label className="text-muted-foreground">
                                  Công đoạn
                                </Label>
                                <p className="font-medium">
                                  {check.processStage}
                                </p>
                              </div>
                              <div>
                                <Label className="text-muted-foreground">
                                  Số lô
                                </Label>
                                <p className="font-medium">
                                  {check.batchNumber}
                                </p>
                              </div>
                              <div>
                                <Label className="text-muted-foreground">
                                  Người kiểm
                                </Label>
                                <p className="font-medium">{check.inspector}</p>
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
                                    {check.tests.map((test) => (
                                      <tr key={test.id} className="border-t">
                                        <td className="px-4 py-2">
                                          {test.testName}
                                        </td>
                                        <td className="px-4 py-2 text-xs text-muted-foreground">
                                          {test.specification}
                                        </td>
                                        <td className="px-4 py-2 font-medium">
                                          {test.result || "-"}
                                        </td>
                                        <td className="px-4 py-2 text-center">
                                          {getStatusBadge(test.status)}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>

                            {check.notes && (
                              <div>
                                <Label className="text-muted-foreground">
                                  Ghi chú
                                </Label>
                                <p className="mt-1 text-sm">{check.notes}</p>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>

                      {(check.status === "pending" ||
                        check.status === "in_progress") && (
                        <Dialog
                          open={testResultsOpen}
                          onOpenChange={setTestResultsOpen}
                        >
                          <DialogTrigger asChild>
                            <Button
                              className="flex-1"
                              onClick={() => {
                                setSelectedCheck(check);
                                setTestResultsOpen(true);
                              }}
                            >
                              <TestTube2 className="mr-2 h-4 w-4" />
                              Nhập kết quả
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Nhập kết quả kiểm tra</DialogTitle>
                              <DialogDescription>
                                {selectedCheck?.processStage} -{" "}
                                {selectedCheck?.batchNumber}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              {selectedCheck?.tests.map((test) => (
                                <div key={test.id} className="space-y-2">
                                  <Label>{test.testName}</Label>
                                  <p className="text-xs text-muted-foreground">
                                    Tiêu chuẩn: {test.specification}
                                  </p>
                                  <Input
                                    placeholder="Nhập kết quả..."
                                    defaultValue={test.result}
                                  />
                                </div>
                              ))}
                              <div>
                                <Label>Ghi chú</Label>
                                <Textarea placeholder="Nhập ghi chú..." />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button
                                variant="outline"
                                onClick={() => setTestResultsOpen(false)}
                              >
                                Hủy
                              </Button>
                              <Button onClick={() => setTestResultsOpen(false)}>
                                Lưu kết quả
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
          </TabsContent>

          {stages.map((stage) => (
            <TabsContent key={stage} value={stage} className="space-y-4">
              <div className="grid gap-4 lg:grid-cols-2">
                {processQualityChecks
                  .filter((p) => p.processStage === stage)
                  .map((check) => (
                    <Card key={check.id} className="overflow-hidden">
                      <CardHeader className="bg-muted/30">
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-lg">
                            {check.code}
                          </CardTitle>
                          {getStatusBadge(check.status)}
                        </div>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <p className="text-sm">
                          Lô:{" "}
                          <span className="font-medium">
                            {check.batchNumber}
                          </span>
                        </p>
                        <p className="text-sm mt-1">
                          Kế hoạch:{" "}
                          <span className="font-medium">
                            {check.productionPlanCode}
                          </span>
                        </p>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
