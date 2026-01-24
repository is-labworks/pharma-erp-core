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
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  materialRequirements,
  bomFormulas,
  productionPlans,
} from "@/lib/mock-data";
import {
  Calculator,
  AlertTriangle,
  CheckCircle2,
  Package,
  FileText,
} from "lucide-react";
import { useState } from "react";

export default function MaterialRequirementsPage() {
  const [selectedPlan, setSelectedPlan] = useState(
    productionPlans[0]?.id || "",
  );
  const [customQuantity, setCustomQuantity] = useState("");

  const plan = productionPlans.find((p) => p.id === selectedPlan);
  const requirement = materialRequirements.find(
    (r) => r.productionPlanId === selectedPlan,
  );

  const categoryLabels = {
    raw_material: "Nguyên liệu chính",
    excipient: "Tá dược",
    packaging: "Bao bì",
  };

  const categoryColors = {
    raw_material: "bg-blue-500/10 text-blue-600 border-blue-200",
    excipient: "bg-purple-500/10 text-purple-600 border-purple-200",
    packaging: "bg-orange-500/10 text-orange-600 border-orange-200",
  };

  return (
    <DashboardLayout
      role="production_planner"
      breadcrumbs={[
        { label: "Quản lý BOM", href: "/bom/overview" },
        { label: "Tính nhu cầu nguyên liệu" },
      ]}
    >
      <div className="space-y-6">
        <PageHeader
          title="Tính Nhu cầu Nguyên vật liệu"
          description="Tự động tính toán nhu cầu nguyên liệu dựa trên kế hoạch sản xuất và công thức BOM"
        />

        {/* Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Chọn kế hoạch sản xuất</CardTitle>
            <CardDescription>
              Hệ thống sẽ tự động tính toán dựa trên công thức hiện tại
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Kế hoạch sản xuất</Label>
                <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn kế hoạch sản xuất" />
                  </SelectTrigger>
                  <SelectContent>
                    {productionPlans.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.code} -{" "}
                        {p.items.length > 0 ? p.items[0].medicineName : "N/A"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {plan && (
                <div className="space-y-2">
                  <Label>Số lượng kế hoạch</Label>
                  <Input
                    value={
                      plan.items.length > 0
                        ? `${plan.items[0].plannedQuantity.toLocaleString("vi-VN")} ${plan.items[0].unit}`
                        : "N/A"
                    }
                    disabled
                  />
                </div>
              )}
            </div>

            {plan && (
              <div className="rounded-lg border bg-muted/50 p-4">
                <div className="grid gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Thuốc:</span>
                    <span className="font-medium">
                      {plan.items.length > 0
                        ? plan.items[0].medicineName
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Thời gian:</span>
                    <span className="font-medium">
                      {new Date(plan.startDate).toLocaleDateString("vi-VN")} -{" "}
                      {new Date(plan.endDate).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Trạng thái:</span>
                    <Badge
                      variant={
                        plan.status === "approved" ? "default" : "secondary"
                      }
                    >
                      {plan.status === "approved" ? "Đã duyệt" : "Bản nháp"}
                    </Badge>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Material Requirements */}
        {requirement && (
          <>
            {/* Summary */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <CardDescription>Công thức sử dụng</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">
                    v{requirement.formulaVersion}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {requirement.requirements.length} nguyên liệu
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <CardDescription>Nguyên liệu đủ</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-green-600">
                    {
                      requirement.requirements.filter((r) => r.shortage <= 0)
                        .length
                    }
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Tồn kho đáp ứng nhu cầu
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <CardDescription>Nguyên liệu thiếu</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-red-600">
                    {
                      requirement.requirements.filter((r) => r.shortage > 0)
                        .length
                    }
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Cần mua bổ sung
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Material Details by Category */}
            <Tabs defaultValue="raw_material" className="space-y-4">
              <TabsList>
                <TabsTrigger value="raw_material">
                  Nguyên liệu (
                  {
                    requirement.requirements.filter(
                      (r) => r.category === "raw_material",
                    ).length
                  }
                  )
                </TabsTrigger>
                <TabsTrigger value="excipient">
                  Tá dược (
                  {
                    requirement.requirements.filter(
                      (r) => r.category === "excipient",
                    ).length
                  }
                  )
                </TabsTrigger>
                <TabsTrigger value="packaging">
                  Bao bì (
                  {
                    requirement.requirements.filter(
                      (r) => r.category === "packaging",
                    ).length
                  }
                  )
                </TabsTrigger>
                <TabsTrigger value="all">
                  Tất cả ({requirement.requirements.length})
                </TabsTrigger>
              </TabsList>

              {["raw_material", "excipient", "packaging", "all"].map(
                (category) => (
                  <TabsContent
                    key={category}
                    value={category}
                    className="space-y-3"
                  >
                    {requirement.requirements
                      .filter(
                        (r) => category === "all" || r.category === category,
                      )
                      .map((item) => {
                        const isShortage = item.shortage > 0;
                        return (
                          <Card
                            key={item.materialId}
                            className={
                              isShortage
                                ? "border-red-200 bg-red-50/50"
                                : "border-green-200"
                            }
                          >
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-semibold">
                                      {item.materialName}
                                    </h4>
                                    <Badge
                                      variant="outline"
                                      className={categoryColors[item.category]}
                                    >
                                      {categoryLabels[item.category]}
                                    </Badge>
                                    {isShortage ? (
                                      <Badge
                                        variant="destructive"
                                        className="gap-1"
                                      >
                                        <AlertTriangle className="h-3 w-3" />
                                        Thiếu
                                      </Badge>
                                    ) : (
                                      <Badge
                                        variant="outline"
                                        className="border-green-200 bg-green-50 text-green-600"
                                      >
                                        <CheckCircle2 className="mr-1 h-3 w-3" />
                                        Đủ
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="mt-1 text-sm text-muted-foreground">
                                    Mã: {item.materialCode}
                                  </p>
                                </div>
                              </div>

                              <div className="mt-4 grid gap-3 border-t pt-3 md:grid-cols-3">
                                <div>
                                  <p className="text-xs text-muted-foreground">
                                    Nhu cầu
                                  </p>
                                  <p className="mt-1 text-lg font-semibold">
                                    {item.requiredQuantity.toLocaleString(
                                      "vi-VN",
                                    )}{" "}
                                    {item.unit}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">
                                    Tồn kho hiện tại
                                  </p>
                                  <p className="mt-1 text-lg font-semibold">
                                    {item.currentStock.toLocaleString("vi-VN")}{" "}
                                    {item.unit}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">
                                    {isShortage ? "Thiếu" : "Dư"}
                                  </p>
                                  <p
                                    className={`mt-1 text-lg font-semibold ${
                                      isShortage
                                        ? "text-red-600"
                                        : "text-green-600"
                                    }`}
                                  >
                                    {Math.abs(item.shortage).toLocaleString(
                                      "vi-VN",
                                    )}{" "}
                                    {item.unit}
                                  </p>
                                </div>
                              </div>

                              {isShortage &&
                                item.suggestedPurchaseQuantity > 0 && (
                                  <div className="mt-3 rounded-md bg-yellow-50 p-3">
                                    <p className="text-sm font-medium text-yellow-800">
                                      💡 Đề xuất mua:{" "}
                                      {item.suggestedPurchaseQuantity.toLocaleString(
                                        "vi-VN",
                                      )}{" "}
                                      {item.unit}
                                    </p>
                                  </div>
                                )}
                            </CardContent>
                          </Card>
                        );
                      })}
                  </TabsContent>
                ),
              )}
            </Tabs>

            {/* Actions */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Tính toán hoàn tất</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Cập nhật lần cuối:{" "}
                      {new Date(requirement.calculatedAt).toLocaleString(
                        "vi-VN",
                      )}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline">Xuất báo cáo</Button>
                    <Button>Tạo phiếu đề xuất mua hàng</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {!requirement && selectedPlan && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-12 text-center">
              <Calculator className="h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">Chưa có tính toán</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Kế hoạch này chưa được tính toán nhu cầu nguyên liệu
              </p>
              <Button className="mt-4">Tính toán ngay</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
