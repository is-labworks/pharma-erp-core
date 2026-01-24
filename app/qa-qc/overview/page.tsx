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
import { Badge } from "@/components/ui/badge";
import { qualityInspections } from "@/lib/mock-data";
import {
  processQualityChecks,
  finalInspections,
} from "@/lib/quality-mock-data";
import {
  LayoutDashboard,
  TestTube,
  Activity,
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function QAQCOverviewPage() {
  // Calculate statistics
  const totalIncoming = qualityInspections.length;
  const incomingPending = qualityInspections.filter(
    (q) => q.status === "waiting",
  ).length;
  const incomingPassed = qualityInspections.filter(
    (q) => q.status === "passed",
  ).length;
  const incomingFailed = qualityInspections.filter(
    (q) => q.status === "failed",
  ).length;

  const totalInProcess = processQualityChecks.length;
  const inProcessPending = processQualityChecks.filter(
    (p) => p.status === "pending",
  ).length;
  const inProcessProgress = processQualityChecks.filter(
    (p) => p.status === "in_progress",
  ).length;
  const inProcessPassed = processQualityChecks.filter(
    (p) => p.status === "passed",
  ).length;
  const inProcessFailed = processQualityChecks.filter(
    (p) => p.status === "failed",
  ).length;

  const totalFinal = finalInspections.length;
  const finalPending = finalInspections.filter(
    (f) => f.overallStatus === "pending",
  ).length;
  const finalProgress = finalInspections.filter(
    (f) => f.overallStatus === "in_progress",
  ).length;
  const finalPassed = finalInspections.filter(
    (f) => f.overallStatus === "passed",
  ).length;
  const finalApproved = finalInspections.filter(
    (f) => f.releaseApproved,
  ).length;

  const totalTests = totalIncoming + totalInProcess + totalFinal;
  const totalPending =
    incomingPending +
    inProcessPending +
    inProcessProgress +
    finalPending +
    finalProgress;
  const totalPassed = incomingPassed + inProcessPassed + finalPassed;
  const totalFailed = incomingFailed + inProcessFailed;
  const passRate =
    totalTests > 0 ? Math.round((totalPassed / totalTests) * 100) : 0;

  // Recent activities
  const recentActivities = [
    ...qualityInspections
      .slice(0, 2)
      .map((q) => ({
        type: "incoming",
        data: q,
        time: q.inspectedAt || new Date().toISOString(),
      })),
    ...processQualityChecks
      .slice(0, 2)
      .map((p) => ({ type: "in_process", data: p, time: p.checkDate })),
    ...finalInspections
      .slice(0, 2)
      .map((f) => ({ type: "final", data: f, time: f.inspectionDate })),
  ]
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, 5);

  return (
    <DashboardLayout role="qa_qc" breadcrumbs={[{ label: "Tổng quan QA/QC" }]}>
      <div className="space-y-6">
        <PageHeader
          title="Tổng quan Quản lý Chất lượng"
          description="Theo dõi toàn bộ hoạt động kiểm tra chất lượng và kiểm nghiệm"
        />

        {/* Overall KPIs */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Tổng kiểm tra
              </CardTitle>
              <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTests}</div>
              <p className="text-xs text-muted-foreground">trong tháng này</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Tỷ lệ đạt</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {passRate}%
              </div>
              <p className="text-xs text-muted-foreground">
                {totalPassed}/{totalTests} lô đạt
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Đang xử lý</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {totalPending}
              </div>
              <p className="text-xs text-muted-foreground">cần kiểm tra</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Không đạt</CardTitle>
              <XCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                {totalFailed}
              </div>
              <p className="text-xs text-muted-foreground">lô bị từ chối</p>
            </CardContent>
          </Card>
        </div>

        {/* By Category */}
        <div className="grid gap-4 lg:grid-cols-3">
          <Card>
            <CardHeader className="bg-muted/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TestTube className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base">
                    Nguyên liệu đầu vào
                  </CardTitle>
                </div>
                <Badge variant="outline">{totalIncoming}</Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Chờ kiểm</span>
                <Badge variant="secondary">{incomingPending}</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Đạt</span>
                <Badge className="bg-green-500">{incomingPassed}</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Không đạt</span>
                <Badge variant="destructive">{incomingFailed}</Badge>
              </div>
              <Link href="/qa-qc/pending">
                <Button
                  variant="outline"
                  className="w-full mt-2 bg-transparent"
                >
                  Xem chi tiết
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="bg-muted/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-blue-500" />
                  <CardTitle className="text-base">
                    Kiểm tra công đoạn
                  </CardTitle>
                </div>
                <Badge variant="outline">{totalInProcess}</Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Đang kiểm</span>
                <Badge variant="secondary">{inProcessProgress}</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Đạt</span>
                <Badge className="bg-green-500">{inProcessPassed}</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Không đạt</span>
                <Badge variant="destructive">{inProcessFailed}</Badge>
              </div>
              <Link href="/qa-qc/in-process">
                <Button
                  variant="outline"
                  className="w-full mt-2 bg-transparent"
                >
                  Xem chi tiết
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="bg-muted/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-purple-500" />
                  <CardTitle className="text-base">
                    Kiểm nghiệm thành phẩm
                  </CardTitle>
                </div>
                <Badge variant="outline">{totalFinal}</Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Chờ kiểm</span>
                <Badge variant="secondary">
                  {finalPending + finalProgress}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Đạt</span>
                <Badge className="bg-green-500">{finalPassed}</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Đã phê duyệt</span>
                <Badge className="bg-purple-500">{finalApproved}</Badge>
              </div>
              <Link href="/qa-qc/final-inspection">
                <Button
                  variant="outline"
                  className="w-full mt-2 bg-transparent"
                >
                  Xem chi tiết
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Hoạt động gần đây</CardTitle>
            <CardDescription>
              Các kiểm tra và kiểm nghiệm mới nhất
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivities.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 rounded-lg border p-3"
                >
                  {activity.type === "incoming" && (
                    <TestTube className="h-4 w-4 text-primary" />
                  )}
                  {activity.type === "in_process" && (
                    <Activity className="h-4 w-4 text-blue-500" />
                  )}
                  {activity.type === "final" && (
                    <Shield className="h-4 w-4 text-purple-500" />
                  )}

                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {activity.type === "incoming" &&
                        `Kiểm tra nguyên liệu - ${activity.data.code}`}
                      {activity.type === "in_process" &&
                        `Kiểm tra công đoạn ${activity.data.processStage} - ${activity.data.code}`}
                      {activity.type === "final" &&
                        `Kiểm nghiệm thành phẩm ${activity.data.medicineName} - ${activity.data.code}`}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(activity.time).toLocaleString("vi-VN")}
                    </p>
                  </div>

                  {activity.type === "incoming" && (
                    <Badge
                      variant={
                        activity.data.status === "passed"
                          ? "default"
                          : activity.data.status === "failed"
                            ? "destructive"
                            : "secondary"
                      }
                    >
                      {activity.data.status === "waiting"
                        ? "Chờ kiểm"
                        : activity.data.status === "passed"
                          ? "Đạt"
                          : "Không đạt"}
                    </Badge>
                  )}
                  {activity.type === "in_process" && (
                    <Badge
                      variant={
                        activity.data.status === "passed"
                          ? "default"
                          : activity.data.status === "failed"
                            ? "destructive"
                            : "secondary"
                      }
                    >
                      {activity.data.status === "in_progress"
                        ? "Đang kiểm"
                        : activity.data.status === "passed"
                          ? "Đạt"
                          : "Không đạt"}
                    </Badge>
                  )}
                  {activity.type === "final" && (
                    <Badge
                      variant={
                        activity.data.overallStatus === "passed"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {activity.data.releaseApproved
                        ? "Đã phê duyệt"
                        : activity.data.overallStatus === "passed"
                          ? "Đạt"
                          : "Đang kiểm"}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link href="/qa-qc/pending">
            <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <TestTube className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base">
                    Nguyên liệu chờ kiểm
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Kiểm tra chất lượng nguyên liệu đầu vào
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/qa-qc/in-process">
            <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-blue-500" />
                  <CardTitle className="text-base">
                    Kiểm tra công đoạn
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Kiểm tra chất lượng từng bước sản xuất
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/qa-qc/final-inspection">
            <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-purple-500" />
                  <CardTitle className="text-base">Kiểm nghiệm TP</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Kiểm nghiệm thành phẩm trước nhập kho
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/qa-qc/batch-records">
            <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  <CardTitle className="text-base">Hồ sơ lô hàng</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Xem hồ sơ kiểm nghiệm theo lô
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
