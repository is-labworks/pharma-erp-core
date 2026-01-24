"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { maintenanceSchedules } from "@/lib/maintenance-mock-data";
import { Calendar, Plus, Clock } from "lucide-react";

export default function MaintenanceSchedulesPage() {
  const activeSchedules = maintenanceSchedules.filter((s) => s.isActive);

  const getDaysUntilDue = (nextDue: string) => {
    const days = Math.floor(
      (new Date(nextDue).getTime() - new Date().getTime()) /
        (1000 * 60 * 60 * 24),
    );
    return days;
  };

  return (
    <DashboardLayout
      role="production_planner"
      breadcrumbs={[{ label: "Kế hoạch bảo trì" }]}
    >
      <div className="space-y-6">
        <PageHeader
          title="Kế hoạch Bảo trì Định kỳ"
          description="Quản lý lịch bảo trì định kỳ cho thiết bị"
        >
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Tạo lịch mới
          </Button>
        </PageHeader>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Tổng lịch trình
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {maintenanceSchedules.length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Đang hoạt động
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {activeSchedules.length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Sắp đến hạn</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {
                  activeSchedules.filter((s) => getDaysUntilDue(s.nextDue) <= 7)
                    .length
                }
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Schedules */}
        <div className="grid gap-4 lg:grid-cols-2">
          {maintenanceSchedules.map((schedule) => {
            const daysUntilDue = getDaysUntilDue(schedule.nextDue);
            const isDueSoon = daysUntilDue <= 7;

            return (
              <Card key={schedule.id} className="overflow-hidden">
                <CardHeader className="bg-muted/30">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base">
                        {schedule.equipmentName}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {schedule.code}
                      </p>
                    </div>
                    <Badge
                      variant={schedule.isActive ? "default" : "secondary"}
                    >
                      {schedule.isActive ? "Hoạt động" : "Tạm dừng"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">
                        Loại bảo trì:
                      </span>
                      <p className="font-medium capitalize">
                        {schedule.type === "preventive"
                          ? "Định kỳ"
                          : schedule.type === "calibration"
                            ? "Hiệu chuẩn"
                            : "Sửa chữa"}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Tần suất:</span>
                      <p className="font-medium">{schedule.frequency}</p>
                    </div>
                  </div>

                  {schedule.lastPerformed && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Lần cuối:</span>
                      <p className="font-medium">
                        {new Date(schedule.lastPerformed).toLocaleDateString(
                          "vi-VN",
                        )}
                      </p>
                    </div>
                  )}

                  <div
                    className={`rounded-lg border p-3 ${isDueSoon ? "bg-yellow-50 border-yellow-200" : "bg-muted/30"}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar
                          className={`h-4 w-4 ${isDueSoon ? "text-yellow-600" : "text-muted-foreground"}`}
                        />
                        <span className="text-sm font-medium">
                          Bảo trì tiếp theo
                        </span>
                      </div>
                      {isDueSoon && (
                        <Badge
                          variant="outline"
                          className="bg-yellow-100 text-yellow-800"
                        >
                          Sắp đến hạn
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {new Date(schedule.nextDue).toLocaleDateString("vi-VN")}
                      <span
                        className={
                          isDueSoon
                            ? "text-yellow-700 font-medium ml-2"
                            : "ml-2"
                        }
                      >
                        (Còn {daysUntilDue} ngày)
                      </span>
                    </p>
                  </div>

                  {schedule.estimatedDuration && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      Thời gian dự kiến: {schedule.estimatedDuration} giờ
                    </div>
                  )}

                  {schedule.assignedTo && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">
                        Người phụ trách:
                      </span>
                      <p className="font-medium">{schedule.assignedTo}</p>
                    </div>
                  )}

                  <div>
                    <span className="text-sm text-muted-foreground">
                      Checklist ({schedule.checklist.length} items):
                    </span>
                    <div className="mt-2 space-y-1">
                      {schedule.checklist.slice(0, 3).map((task) => (
                        <div key={task.id} className="text-sm pl-4">
                          • {task.description}
                        </div>
                      ))}
                      {schedule.checklist.length > 3 && (
                        <div className="text-sm text-muted-foreground pl-4">
                          ... và {schedule.checklist.length - 3} mục khác
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" className="flex-1 bg-transparent">
                      Chỉnh sửa
                    </Button>
                    <Button className="flex-1">Tạo lệnh bảo trì</Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
