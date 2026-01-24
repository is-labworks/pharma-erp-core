"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { costAllocationRules } from "@/lib/costing-mock-data";
import { Settings, Plus, Save } from "lucide-react";

export default function CostingSettingsPage() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <DashboardLayout
      role="accounting"
      breadcrumbs={[{ label: "Cài đặt phân bổ" }]}
    >
      <div className="space-y-6">
        <PageHeader
          title="Cài đặt Phân bổ Chi phí"
          description="Quản lý quy tắc phân bổ chi phí sản xuất chung"
        >
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Thêm quy tắc
          </Button>
        </PageHeader>

        {/* Allocation Rules */}
        <Card>
          <CardHeader>
            <CardTitle>Quy tắc Phân bổ Chi phí Overhead</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {costAllocationRules.map((rule) => (
                <Card key={rule.id} className="overflow-hidden">
                  <CardHeader className="bg-muted/30">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">
                        {rule.overheadCategory}
                      </CardTitle>
                      <Badge variant={rule.isActive ? "default" : "secondary"}>
                        {rule.isActive ? "Đang dùng" : "Tạm dừng"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div>
                        <Label>Cơ sở phân bổ</Label>
                        <Select defaultValue={rule.allocationBase}>
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="machine_hours">
                              Giờ máy
                            </SelectItem>
                            <SelectItem value="direct_labor_hours">
                              Giờ công trực tiếp
                            </SelectItem>
                            <SelectItem value="units_produced">
                              Số lượng sản xuất
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Tỷ lệ phân bổ</Label>
                        <Input
                          type="number"
                          defaultValue={rule.rate}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Đơn vị</Label>
                        <Input
                          disabled
                          value={
                            rule.allocationBase === "units_produced"
                              ? "VND/đơn vị"
                              : "VND/giờ"
                          }
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button
                        variant="outline"
                        className="flex-1 bg-transparent"
                      >
                        <Save className="mr-2 h-4 w-4" />
                        Lưu thay đổi
                      </Button>
                      <Button variant="outline" className="bg-transparent">
                        {rule.isActive ? "Tạm dừng" : "Kích hoạt"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Labor Rates */}
        <Card>
          <CardHeader>
            <CardTitle>Đơn giá Nhân công</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { position: "Công nhân vận hành", rate: 50000 },
                { position: "Kỹ thuật viên", rate: 80000 },
                { position: "Trưởng ca", rate: 100000 },
              ].map((item, index) => (
                <div
                  key={index}
                  className="grid gap-4 sm:grid-cols-2 items-end"
                >
                  <div>
                    <Label>Vị trí công việc</Label>
                    <Input defaultValue={item.position} className="mt-1" />
                  </div>
                  <div>
                    <Label>Đơn giá/giờ</Label>
                    <Input
                      type="number"
                      defaultValue={item.rate}
                      className="mt-1"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatCurrency(item.rate)}/giờ
                    </p>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full bg-transparent">
                <Plus className="mr-2 h-4 w-4" />
                Thêm vị trí công việc
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Save All Button */}
        <div className="flex justify-end gap-2">
          <Button variant="outline" className="bg-transparent">
            Hủy thay đổi
          </Button>
          <Button>
            <Save className="mr-2 h-4 w-4" />
            Lưu tất cả cài đặt
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
