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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { equipmentList } from "@/lib/maintenance-mock-data";
import type { EquipmentStatus } from "@/lib/maintenance-types";
import {
  Cog,
  Calendar,
  Clock,
  MapPin,
  Plus,
  Wrench,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";

export default function EquipmentPage() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");
  const [selectedStatus, setSelectedStatus] = React.useState<string>("all");

  // Get unique categories
  const categories = Array.from(new Set(equipmentList.map((e) => e.category)));

  // Filter equipment
  const filteredEquipment = equipmentList.filter((eq) => {
    if (
      searchTerm &&
      !eq.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !eq.code.toLowerCase().includes(searchTerm.toLowerCase())
    )
      return false;
    if (selectedCategory !== "all" && eq.category !== selectedCategory)
      return false;
    if (selectedStatus !== "all" && eq.status !== selectedStatus) return false;
    return true;
  });

  const getStatusBadge = (status: EquipmentStatus) => {
    switch (status) {
      case "operational":
        return <Badge className="bg-green-500">Hoạt động</Badge>;
      case "maintenance":
        return <Badge className="bg-yellow-500">Bảo trì</Badge>;
      case "breakdown":
        return <Badge variant="destructive">Hỏng hóc</Badge>;
      case "idle":
        return <Badge variant="secondary">Không hoạt động</Badge>;
    }
  };

  const getDaysUntilMaintenance = (nextDate?: string) => {
    if (!nextDate) return null;
    const days = Math.floor(
      (new Date(nextDate).getTime() - new Date().getTime()) /
        (1000 * 60 * 60 * 24),
    );
    return days;
  };

  return (
    <DashboardLayout
      role="production_planner"
      breadcrumbs={[{ label: "Danh sách thiết bị" }]}
    >
      <div className="space-y-6">
        <PageHeader
          title="Quản lý Thiết bị Sản xuất"
          description="Theo dõi tình trạng và bảo trì thiết bị"
        >
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Thêm thiết bị
          </Button>
        </PageHeader>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Tổng thiết bị
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{equipmentList.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Hoạt động</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {equipmentList.filter((e) => e.status === "operational").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Đang bảo trì
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {equipmentList.filter((e) => e.status === "maintenance").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Hỏng hóc</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                {equipmentList.filter((e) => e.status === "breakdown").length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[250px]">
                <Label>Tìm kiếm</Label>
                <Input
                  placeholder="Tìm theo tên hoặc mã thiết bị..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="w-[200px]">
                <Label>Danh mục</Label>
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
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
                    <SelectItem value="operational">Hoạt động</SelectItem>
                    <SelectItem value="maintenance">Bảo trì</SelectItem>
                    <SelectItem value="breakdown">Hỏng hóc</SelectItem>
                    <SelectItem value="idle">Không hoạt động</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Equipment Grid */}
        <div className="grid gap-4 lg:grid-cols-2">
          {filteredEquipment.map((equipment) => {
            const daysUntilMaintenance = getDaysUntilMaintenance(
              equipment.nextMaintenanceDate,
            );
            const isMaintenanceSoon =
              daysUntilMaintenance !== null && daysUntilMaintenance <= 7;

            return (
              <Card key={equipment.id} className="overflow-hidden">
                <CardHeader className="bg-muted/30">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Cog className="h-5 w-5 text-primary" />
                        {equipment.code}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {equipment.name}
                      </CardDescription>
                    </div>
                    {getStatusBadge(equipment.status)}
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">Danh mục:</span>
                      <p className="font-medium">{equipment.category}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        Nhà sản xuất:
                      </span>
                      <p className="font-medium">{equipment.manufacturer}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Model:</span>
                      <p className="font-medium">{equipment.model}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        Giờ vận hành:
                      </span>
                      <p className="font-medium">
                        {equipment.operatingHours.toLocaleString()}h
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {equipment.location}
                  </div>

                  {equipment.nextMaintenanceDate && (
                    <div
                      className={`rounded-lg border p-3 ${isMaintenanceSoon ? "bg-yellow-50 border-yellow-200" : "bg-muted/30"}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Calendar
                            className={`h-4 w-4 ${isMaintenanceSoon ? "text-yellow-600" : "text-muted-foreground"}`}
                          />
                          <span className="text-sm font-medium">
                            Bảo trì tiếp theo
                          </span>
                        </div>
                        {isMaintenanceSoon && (
                          <Badge
                            variant="outline"
                            className="bg-yellow-100 text-yellow-800 border-yellow-300"
                          >
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Sắp đến hạn
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {new Date(
                          equipment.nextMaintenanceDate,
                        ).toLocaleDateString("vi-VN")}
                        {daysUntilMaintenance !== null && (
                          <span
                            className={
                              isMaintenanceSoon
                                ? "text-yellow-700 font-medium ml-2"
                                : "ml-2"
                            }
                          >
                            (Còn {daysUntilMaintenance} ngày)
                          </span>
                        )}
                      </p>
                    </div>
                  )}

                  {equipment.lastMaintenanceDate && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      Bảo trì lần cuối:{" "}
                      {new Date(
                        equipment.lastMaintenanceDate,
                      ).toLocaleDateString("vi-VN")}
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" className="flex-1 bg-transparent">
                      Chi tiết
                    </Button>
                    <Button className="flex-1">
                      <Wrench className="mr-2 h-4 w-4" />
                      Lập lịch bảo trì
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredEquipment.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Cog className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">Không tìm thấy thiết bị</h3>
              <p className="text-muted-foreground">
                Thử thay đổi bộ lọc tìm kiếm
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
