"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  equipmentList,
  maintenanceSchedules,
} from "@/lib/maintenance-mock-data";
import { AlertTriangle, Calendar, Wrench, Bell } from "lucide-react";

export default function MaintenanceAlertsPage() {
  const today = new Date();

  // Equipment needing maintenance
  const overdueEquipment = equipmentList.filter((eq) => {
    if (!eq.nextMaintenanceDate) return false;
    return new Date(eq.nextMaintenanceDate) < today;
  });

  const dueSoon7Days = equipmentList.filter((eq) => {
    if (!eq.nextMaintenanceDate) return false;
    const days = Math.floor(
      (new Date(eq.nextMaintenanceDate).getTime() - today.getTime()) /
        (1000 * 60 * 60 * 24),
    );
    return days >= 0 && days <= 7;
  });

  const dueSoon14Days = equipmentList.filter((eq) => {
    if (!eq.nextMaintenanceDate) return false;
    const days = Math.floor(
      (new Date(eq.nextMaintenanceDate).getTime() - today.getTime()) /
        (1000 * 60 * 60 * 24),
    );
    return days > 7 && days <= 14;
  });

  const dueSoon30Days = equipmentList.filter((eq) => {
    if (!eq.nextMaintenanceDate) return false;
    const days = Math.floor(
      (new Date(eq.nextMaintenanceDate).getTime() - today.getTime()) /
        (1000 * 60 * 60 * 24),
    );
    return days > 14 && days <= 30;
  });

  const getDaysText = (date: string) => {
    const days = Math.floor(
      (new Date(date).getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );
    if (days < 0) return `Quá hạn ${Math.abs(days)} ngày`;
    if (days === 0) return "Hôm nay";
    if (days === 1) return "Ngày mai";
    return `Còn ${days} ngày`;
  };

  return (
    <DashboardLayout
      role="production_planner"
      breadcrumbs={[{ label: "Cảnh báo bảo dưỡng" }]}
    >
      <div className="space-y-6">
        <PageHeader
          title="Cảnh báo Bảo dưỡng Thiết bị"
          description="Theo dõi thiết bị cần bảo dưỡng và đến hạn"
        />

        {/* Alert Summary */}
        <div className="grid gap-4 sm:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Quá hạn</CardTitle>
                <AlertTriangle className="h-4 w-4 text-destructive" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                {overdueEquipment.length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">
                  Trong 7 ngày
                </CardTitle>
                <Bell className="h-4 w-4 text-orange-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {dueSoon7Days.length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">
                  Trong 14 ngày
                </CardTitle>
                <Calendar className="h-4 w-4 text-yellow-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {dueSoon14Days.length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">
                  Trong 30 ngày
                </CardTitle>
                <Calendar className="h-4 w-4 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {dueSoon30Days.length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Overdue Equipment */}
        {overdueEquipment.length > 0 && (
          <Card>
            <CardHeader className="bg-destructive/10">
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                Thiết bị quá hạn bảo dưỡng ({overdueEquipment.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3">
                {overdueEquipment.map((eq) => (
                  <div
                    key={eq.id}
                    className="flex items-center justify-between rounded-lg border border-destructive/20 bg-destructive/5 p-4"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{eq.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {eq.code} • {eq.location}
                      </p>
                      {eq.nextMaintenanceDate && (
                        <p className="text-sm text-destructive font-medium mt-1">
                          {getDaysText(eq.nextMaintenanceDate)}
                        </p>
                      )}
                    </div>
                    <Button variant="destructive">
                      <Wrench className="mr-2 h-4 w-4" />
                      Lập lịch ngay
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Due Soon - 7 Days */}
        {dueSoon7Days.length > 0 && (
          <Card>
            <CardHeader className="bg-orange-50">
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-orange-500" />
                Đến hạn trong 7 ngày ({dueSoon7Days.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3">
                {dueSoon7Days.map((eq) => (
                  <div
                    key={eq.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{eq.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {eq.code} • {eq.location}
                      </p>
                      {eq.nextMaintenanceDate && (
                        <p className="text-sm text-orange-600 font-medium mt-1">
                          {getDaysText(eq.nextMaintenanceDate)} •{" "}
                          {new Date(eq.nextMaintenanceDate).toLocaleDateString(
                            "vi-VN",
                          )}
                        </p>
                      )}
                    </div>
                    <Button variant="outline" className="bg-transparent">
                      <Wrench className="mr-2 h-4 w-4" />
                      Lập lịch
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Due Soon - 14 Days */}
        {dueSoon14Days.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-yellow-500" />
                Đến hạn trong 14 ngày ({dueSoon14Days.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dueSoon14Days.map((eq) => (
                  <div
                    key={eq.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{eq.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {eq.code} • {eq.location}
                      </p>
                      {eq.nextMaintenanceDate && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {getDaysText(eq.nextMaintenanceDate)} •{" "}
                          {new Date(eq.nextMaintenanceDate).toLocaleDateString(
                            "vi-VN",
                          )}
                        </p>
                      )}
                    </div>
                    <Button variant="outline" className="bg-transparent">
                      Xem chi tiết
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Due Soon - 30 Days */}
        {dueSoon30Days.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-500" />
                Đến hạn trong 30 ngày ({dueSoon30Days.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dueSoon30Days.map((eq) => (
                  <div
                    key={eq.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{eq.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {eq.code} • {eq.location}
                      </p>
                      {eq.nextMaintenanceDate && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {new Date(eq.nextMaintenanceDate).toLocaleDateString(
                            "vi-VN",
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {overdueEquipment.length === 0 &&
          dueSoon7Days.length === 0 &&
          dueSoon14Days.length === 0 &&
          dueSoon30Days.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Calendar className="h-12 w-12 text-green-500 mb-4" />
                <h3 className="text-lg font-medium text-green-600">
                  Không có cảnh báo
                </h3>
                <p className="text-muted-foreground">
                  Tất cả thiết bị đang được bảo dưỡng đúng hạn
                </p>
              </CardContent>
            </Card>
          )}
      </div>
    </DashboardLayout>
  );
}
