"use client";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { resourceAllocations, productionLines } from "@/lib/mock-data";
import { Users, Wrench, TrendingUp, AlertCircle } from "lucide-react";

export default function ResourceAllocationPage() {
  const today = "2026-01-28";
  const todayAllocations = resourceAllocations.filter(
    (ra) => ra.date === today,
  );

  return (
    <DashboardLayout
      role="production_planner"
      breadcrumbs={[
        { label: "Tổng quan", href: "/production/overview" },
        { label: "Phân bổ nguồn lực" },
      ]}
    >
      <div className="space-y-6">
        <PageHeader
          title="Phân bổ Nguồn lực Sản xuất"
          description="Phân bổ máy móc và nhân công theo từng ca sản xuất"
        />

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Tổng nhân công
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {resourceAllocations.reduce(
                  (sum, ra) => sum + ra.assignedWorkers,
                  0,
                )}{" "}
                người
              </div>
              <p className="text-xs text-muted-foreground">
                Đã phân bổ hôm nay
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Tỷ lệ sử dụng trung bình
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(
                  resourceAllocations.reduce(
                    (sum, ra) => sum + ra.utilizationRate,
                    0,
                  ) / resourceAllocations.length
                ).toFixed(0)}
                %
              </div>
              <p className="text-xs text-muted-foreground">Công suất sử dụng</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Thiếu nhân công
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {
                  resourceAllocations.filter(
                    (ra) => ra.assignedWorkers < ra.requiredWorkers,
                  ).length
                }
              </div>
              <p className="text-xs text-muted-foreground">Ca sản xuất</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="morning" className="space-y-4">
          <TabsList>
            <TabsTrigger value="morning">Ca sáng (6h-14h)</TabsTrigger>
            <TabsTrigger value="afternoon">Ca chiều (14h-22h)</TabsTrigger>
            <TabsTrigger value="night">Ca đêm (22h-6h)</TabsTrigger>
          </TabsList>

          {["morning", "afternoon", "night"].map((shift) => (
            <TabsContent key={shift} value={shift} className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>
                    Phân bổ nguồn lực -{" "}
                    {shift === "morning"
                      ? "Ca sáng"
                      : shift === "afternoon"
                        ? "Ca chiều"
                        : "Ca đêm"}
                  </CardTitle>
                  <CardDescription>
                    Nhân công và máy móc cho ca sản xuất
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {resourceAllocations
                      .filter((ra) => ra.shift === shift)
                      .map((allocation) => {
                        const line = productionLines.find(
                          (l) => l.id === allocation.productionLineId,
                        );
                        const workerShortage =
                          allocation.requiredWorkers -
                          allocation.assignedWorkers;

                        return (
                          <div
                            key={allocation.id}
                            className={`rounded-lg border p-4 ${
                              workerShortage > 0
                                ? "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950"
                                : ""
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-semibold">
                                  {allocation.productionLineName}
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  {line?.code}
                                </p>
                              </div>
                              <Badge
                                variant={
                                  allocation.machineryStatus === "operational"
                                    ? "default"
                                    : allocation.machineryStatus ===
                                        "maintenance"
                                      ? "secondary"
                                      : "destructive"
                                }
                              >
                                {allocation.machineryStatus === "operational"
                                  ? "Hoạt động tốt"
                                  : allocation.machineryStatus === "maintenance"
                                    ? "Bảo trì"
                                    : "Hỏng hóc"}
                              </Badge>
                            </div>

                            <div className="mt-4 grid gap-4 md:grid-cols-3">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <Users className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm font-medium">
                                    Nhân công
                                  </span>
                                </div>
                                <p className="text-2xl font-bold">
                                  {allocation.assignedWorkers}/
                                  {allocation.requiredWorkers}
                                </p>
                                {workerShortage > 0 && (
                                  <p className="text-xs text-red-600">
                                    Thiếu {workerShortage} người
                                  </p>
                                )}
                              </div>

                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <Wrench className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm font-medium">
                                    Máy móc
                                  </span>
                                </div>
                                <p className="text-2xl font-bold">
                                  {allocation.machineryStatus === "operational"
                                    ? "✓"
                                    : "✗"}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {allocation.machineryStatus === "operational"
                                    ? "Sẵn sàng"
                                    : allocation.machineryStatus ===
                                        "maintenance"
                                      ? "Đang bảo trì"
                                      : "Cần sửa chữa"}
                                </p>
                              </div>

                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm font-medium">
                                    Sử dụng
                                  </span>
                                </div>
                                <p className="text-2xl font-bold">
                                  {allocation.utilizationRate}%
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Công suất
                                </p>
                              </div>
                            </div>

                            {allocation.notes && (
                              <div className="mt-3 rounded-md bg-yellow-100 p-2 dark:bg-yellow-900">
                                <p className="text-xs text-yellow-800 dark:text-yellow-200">
                                  <AlertCircle className="mr-1 inline h-3 w-3" />
                                  {allocation.notes}
                                </p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
