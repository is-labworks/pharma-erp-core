"use client";
import { DashboardLayout } from "@/components/dashboard-layout";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { productionLineSchedules, medicines } from "@/lib/mock-data";
import { Calendar, Download, Printer } from "lucide-react";
import { useState } from "react";

export default function ProductionSchedulePage() {
  const [view, setView] = useState<"day" | "week" | "month">("day");

  // Group schedules by date
  const schedulesByDate = productionLineSchedules.reduce(
    (acc, schedule) => {
      if (!acc[schedule.date]) {
        acc[schedule.date] = [];
      }
      acc[schedule.date].push(schedule);
      return acc;
    },
    {} as Record<string, typeof productionLineSchedules>,
  );

  const dates = Object.keys(schedulesByDate).sort();

  return (
    <DashboardLayout
      role="production_planner"
      breadcrumbs={[
        { label: "Tổng quan", href: "/production/overview" },
        { label: "Lịch sản xuất chi tiết" },
      ]}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <PageHeader
            title="Lịch Sản xuất Chi tiết"
            description="Xem và quản lý lịch sản xuất theo ngày, tuần, tháng"
          />
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Xuất Excel
            </Button>
            <Button variant="outline" size="sm">
              <Printer className="mr-2 h-4 w-4" />
              In lịch
            </Button>
          </div>
        </div>

        <Tabs
          value={view}
          onValueChange={(v) => setView(v as typeof view)}
          className="space-y-4"
        >
          <TabsList>
            <TabsTrigger value="day">Theo ngày</TabsTrigger>
            <TabsTrigger value="week">Theo tuần</TabsTrigger>
            <TabsTrigger value="month">Theo tháng</TabsTrigger>
          </TabsList>

          <TabsContent value="day" className="space-y-4">
            {dates.map((date) => {
              const daySchedules = schedulesByDate[date];
              const totalPlanned = daySchedules.reduce(
                (sum, s) => sum + s.quantity,
                0,
              );

              return (
                <Card key={date}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>
                        {new Date(date).toLocaleDateString("vi-VN", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </CardTitle>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">
                          Tổng sản lượng kế hoạch
                        </p>
                        <p className="text-lg font-bold">
                          {totalPlanned.toLocaleString("vi-VN")} viên
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {["morning", "afternoon", "night"].map((shift) => {
                        const shiftSchedules = daySchedules.filter(
                          (s) => s.shift === shift,
                        );
                        if (shiftSchedules.length === 0) return null;

                        return (
                          <div key={shift} className="space-y-2">
                            <h4 className="text-sm font-semibold text-muted-foreground">
                              {shift === "morning"
                                ? "☀️ Ca sáng (6h-14h)"
                                : shift === "afternoon"
                                  ? "🌤️ Ca chiều (14h-22h)"
                                  : "🌙 Ca đêm (22h-6h)"}
                            </h4>
                            <div className="space-y-2">
                              {shiftSchedules.map((schedule) => {
                                const medicine = medicines.find(
                                  (m) => m.id === schedule.medicineId,
                                );
                                return (
                                  <div
                                    key={schedule.id}
                                    className="flex items-center justify-between rounded-md border p-3"
                                  >
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2">
                                        <p className="font-medium">
                                          {schedule.medicineName}
                                        </p>
                                        <Badge variant="outline">
                                          {medicine?.type === "tablet"
                                            ? "Viên nén"
                                            : medicine?.type === "capsule"
                                              ? "Viên nang"
                                              : "Xi-rô"}
                                        </Badge>
                                        <Badge
                                          variant={
                                            schedule.status === "in_progress"
                                              ? "default"
                                              : schedule.status === "approved"
                                                ? "secondary"
                                                : schedule.status ===
                                                    "completed"
                                                  ? "default"
                                                  : "outline"
                                          }
                                        >
                                          {schedule.status === "in_progress"
                                            ? "Đang sản xuất"
                                            : schedule.status === "approved"
                                              ? "Đã lên lịch"
                                              : schedule.status === "completed"
                                                ? "Hoàn thành"
                                                : "Bản nháp"}
                                        </Badge>
                                      </div>
                                      <p className="mt-1 text-sm text-muted-foreground">
                                        {schedule.productionLineName} •{" "}
                                        {schedule.productionPlanCode}
                                      </p>
                                    </div>
                                    <div className="text-right">
                                      <p className="font-semibold">
                                        {schedule.quantity.toLocaleString(
                                          "vi-VN",
                                        )}{" "}
                                        viên
                                      </p>
                                      <p className="text-sm text-muted-foreground">
                                        {schedule.assignedWorkers} nhân công
                                      </p>
                                      {schedule.actualQuantity && (
                                        <p className="text-xs text-green-600">
                                          Thực tế:{" "}
                                          {schedule.actualQuantity.toLocaleString(
                                            "vi-VN",
                                          )}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

          <TabsContent value="week" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Tuần 4 - Tháng 1, 2026</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dates.map((date) => {
                    const daySchedules = schedulesByDate[date];
                    return (
                      <div key={date} className="rounded-md border p-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold">
                            {new Date(date).toLocaleDateString("vi-VN", {
                              weekday: "short",
                              day: "numeric",
                              month: "short",
                            })}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {daySchedules.length} ca sản xuất •{" "}
                            {daySchedules
                              .reduce((sum, s) => sum + s.quantity, 0)
                              .toLocaleString("vi-VN")}{" "}
                            viên
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="month" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Tháng 1, 2026</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2">
                  {["CN", "T2", "T3", "T4", "T5", "T6", "T7"].map((day) => (
                    <div
                      key={day}
                      className="p-2 text-center text-sm font-semibold text-muted-foreground"
                    >
                      {day}
                    </div>
                  ))}
                  {/* Calendar grid - simplified for demo */}
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                    const dateStr = `2026-01-${String(day).padStart(2, "0")}`;
                    const hasSchedule = schedulesByDate[dateStr];
                    return (
                      <div
                        key={day}
                        className={`min-h-20 rounded-md border p-2 ${
                          hasSchedule ? "border-primary bg-primary/5" : ""
                        }`}
                      >
                        <p className="text-sm font-medium">{day}</p>
                        {hasSchedule && (
                          <p className="mt-1 text-xs text-muted-foreground">
                            {hasSchedule.length} ca
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
