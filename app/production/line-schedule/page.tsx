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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  productionLines,
  productionLineSchedules,
  productionCapacities,
  productionPlans,
} from "@/lib/mock-data";
import { Factory, Activity, AlertTriangle, Clock } from "lucide-react";

export default function LineSchedulePage() {
  const lineTypes = Array.from(
    new Set(productionLines.map((line) => line.type)),
  );

  return (
    <DashboardLayout
      role="production_planner"
      breadcrumbs={[
        { label: "Tổng quan", href: "/production/overview" },
        { label: "Lịch dây chuyền" },
      ]}
    >
      <div className="space-y-6">
        <PageHeader
          title="Lịch Dây chuyền Sản xuất"
          description="Lập kế hoạch sản xuất theo từng dây chuyền"
        />

        <Tabs defaultValue="tablet" className="space-y-4">
          <TabsList>
            <TabsTrigger value="tablet">Viên nén</TabsTrigger>
            <TabsTrigger value="capsule">Viên nang</TabsTrigger>
            <TabsTrigger value="syrup">Xi-rô</TabsTrigger>
            <TabsTrigger value="all">Tất cả</TabsTrigger>
          </TabsList>

          {[...lineTypes, "all" as const].map((type) => (
            <TabsContent
              key={type}
              value={type === "all" ? "all" : type}
              className="space-y-4"
            >
              {productionLines
                .filter((line) => type === "all" || line.type === type)
                .map((line) => {
                  const capacity = productionCapacities.find(
                    (c) => c.productionLineId === line.id,
                  );
                  const schedules = productionLineSchedules.filter(
                    (s) => s.productionLineId === line.id,
                  );

                  return (
                    <Card key={line.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="flex items-center gap-2">
                              {line.name}
                              <Badge
                                variant={
                                  line.status === "active"
                                    ? "default"
                                    : line.status === "maintenance"
                                      ? "secondary"
                                      : "outline"
                                }
                              >
                                {line.status === "active"
                                  ? "Hoạt động"
                                  : line.status === "maintenance"
                                    ? "Bảo trì"
                                    : "Không hoạt động"}
                              </Badge>
                            </CardTitle>
                            <CardDescription>
                              {line.code} •{" "}
                              {line.type === "tablet"
                                ? "Viên nén"
                                : line.type === "capsule"
                                  ? "Viên nang"
                                  : "Xi-rô"}
                            </CardDescription>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">
                              Công suất mỗi ca
                            </p>
                            <p className="text-lg font-bold">
                              {line.capacityPerShift.toLocaleString("vi-VN")}{" "}
                              {line.capacityUnit}
                            </p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {line.description && (
                          <p className="text-sm text-muted-foreground">
                            {line.description}
                          </p>
                        )}

                        {capacity && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="flex items-center gap-2">
                                <Activity className="h-4 w-4" />
                                Tỷ lệ sử dụng công suất
                              </span>
                              <span className="font-bold">
                                {capacity.currentUtilization}%
                              </span>
                            </div>
                            <Progress
                              value={capacity.currentUtilization}
                              className="h-2"
                            />
                            <div className="grid grid-cols-3 gap-4 text-center text-xs text-muted-foreground">
                              <div>
                                <p>Ngày</p>
                                <p className="font-semibold text-foreground">
                                  {capacity.dailyCapacity.toLocaleString(
                                    "vi-VN",
                                  )}
                                </p>
                              </div>
                              <div>
                                <p>Tuần</p>
                                <p className="font-semibold text-foreground">
                                  {capacity.weeklyCapacity.toLocaleString(
                                    "vi-VN",
                                  )}
                                </p>
                              </div>
                              <div>
                                <p>Tháng</p>
                                <p className="font-semibold text-foreground">
                                  {capacity.monthlyCapacity.toLocaleString(
                                    "vi-VN",
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="space-y-2">
                          <h4 className="flex items-center gap-2 text-sm font-semibold">
                            <Clock className="h-4 w-4" />
                            Lịch sản xuất
                          </h4>
                          {schedules.length > 0 ? (
                            <div className="space-y-2">
                              {schedules.map((schedule) => {
                                const plan = productionPlans.find(
                                  (p) => p.id === schedule.productionPlanId,
                                );
                                return (
                                  <div
                                    key={schedule.id}
                                    className="flex items-center justify-between rounded-md border p-3"
                                  >
                                    <div className="flex-1">
                                      <p className="font-medium">
                                        {schedule.medicineName}
                                      </p>
                                      <p className="text-sm text-muted-foreground">
                                        {schedule.productionPlanCode} •{" "}
                                        {new Date(
                                          schedule.date,
                                        ).toLocaleDateString("vi-VN")}{" "}
                                        •{" "}
                                        {schedule.shift === "morning"
                                          ? "Ca sáng"
                                          : schedule.shift === "afternoon"
                                            ? "Ca chiều"
                                            : "Ca đêm"}
                                      </p>
                                    </div>
                                    <div className="text-right">
                                      <Badge
                                        variant={
                                          schedule.status === "in_progress"
                                            ? "default"
                                            : schedule.status === "approved"
                                              ? "secondary"
                                              : "outline"
                                        }
                                      >
                                        {schedule.status === "in_progress"
                                          ? "Đang sản xuất"
                                          : schedule.status === "approved"
                                            ? "Đã lên lịch"
                                            : "Bản nháp"}
                                      </Badge>
                                      <p className="mt-1 text-sm text-muted-foreground">
                                        {schedule.quantity.toLocaleString(
                                          "vi-VN",
                                        )}{" "}
                                        viên
                                      </p>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="rounded-md border border-dashed p-8 text-center">
                              <p className="text-sm text-muted-foreground">
                                Chưa có lịch sản xuất nào được lên kế hoạch
                              </p>
                            </div>
                          )}
                        </div>

                        {line.status === "maintenance" && (
                          <div className="flex items-center gap-2 rounded-md bg-yellow-50 p-3 dark:bg-yellow-950">
                            <AlertTriangle className="h-4 w-4 text-yellow-600" />
                            <p className="text-sm text-yellow-800 dark:text-yellow-200">
                              Dây chuyền đang trong quá trình bảo trì định kỳ
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
