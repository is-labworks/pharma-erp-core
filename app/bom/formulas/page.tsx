"use client";
import { DashboardLayout } from "@/components/dashboard-layout";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { bomFormulas } from "@/lib/mock-data";
import { Search, Plus, Eye, Edit, History, Package2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function BOMFormulasPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFormulas = bomFormulas.filter(
    (f) =>
      f.medicineName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.code.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const statusColors = {
    active: "bg-green-500/10 text-green-600 border-green-200",
    draft: "bg-yellow-500/10 text-yellow-600 border-yellow-200",
    inactive: "bg-gray-500/10 text-gray-600 border-gray-200",
    obsolete: "bg-red-500/10 text-red-600 border-red-200",
  };

  const statusLabels = {
    active: "Đang áp dụng",
    draft: "Bản nháp",
    inactive: "Ngừng sử dụng",
    obsolete: "Lỗi thời",
  };

  const categoryLabels = {
    raw_material: "Nguyên liệu",
    excipient: "Tá dược",
    packaging: "Bao bì",
  };

  const renderFormulaCard = (formula: (typeof bomFormulas)[0]) => {
    const rawMaterials = formula.bomItems.filter(
      (item) => item.category === "raw_material",
    );
    const excipients = formula.bomItems.filter(
      (item) => item.category === "excipient",
    );
    const packaging = formula.bomItems.filter(
      (item) => item.category === "packaging",
    );

    return (
      <Card key={formula.id} className="transition-shadow hover:shadow-md">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">
                  {formula.medicineName}
                </h3>
                <Badge
                  variant="outline"
                  className={statusColors[formula.status]}
                >
                  {statusLabels[formula.status]}
                </Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {formula.code} • Phiên bản {formula.version}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/bom/formulas/${formula.id}`}>
                  <Eye className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/bom/versions?formulaId=${formula.id}`}>
                  <History className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="mt-4 grid gap-3 border-t pt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Quy mô mẻ sản xuất:</span>
              <span className="font-medium">
                {formula.batchSize.toLocaleString("vi-VN")} {formula.batchUnit}
              </span>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">
                Thành phần ({formula.bomItems.length}):
              </p>
              <div className="flex flex-wrap gap-2">
                {rawMaterials.length > 0 && (
                  <Badge
                    variant="secondary"
                    className="bg-blue-500/10 text-blue-600"
                  >
                    {rawMaterials.length} Nguyên liệu
                  </Badge>
                )}
                {excipients.length > 0 && (
                  <Badge
                    variant="secondary"
                    className="bg-purple-500/10 text-purple-600"
                  >
                    {excipients.length} Tá dược
                  </Badge>
                )}
                {packaging.length > 0 && (
                  <Badge
                    variant="secondary"
                    className="bg-orange-500/10 text-orange-600"
                  >
                    {packaging.length} Bao bì
                  </Badge>
                )}
              </div>
            </div>

            {formula.changeReason && (
              <div className="rounded-md bg-muted/50 p-3 text-xs">
                <p className="font-medium">Lý do thay đổi:</p>
                <p className="mt-1 text-muted-foreground">
                  {formula.changeReason}
                </p>
              </div>
            )}

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                Hiệu lực từ:{" "}
                {new Date(formula.effectiveDate).toLocaleDateString("vi-VN")}
              </span>
              {formula.approvedBy && <span>✓ Đã phê duyệt</span>}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <DashboardLayout
      role="production_planner"
      breadcrumbs={[
        { label: "Quản lý BOM", href: "/bom/overview" },
        { label: "Công thức sản xuất" },
      ]}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <PageHeader
            title="Công thức Sản xuất"
            description="Quản lý định mức nguyên vật liệu cho từng loại thuốc"
          />
          <Button asChild>
            <Link href="/bom/formulas/new">
              <Plus className="mr-2 h-4 w-4" />
              Tạo công thức mới
            </Link>
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm theo tên thuốc hoặc mã công thức..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Formulas by Status */}
        <Tabs defaultValue="active" className="space-y-4">
          <TabsList>
            <TabsTrigger value="active">
              Đang áp dụng (
              {bomFormulas.filter((f) => f.status === "active").length})
            </TabsTrigger>
            <TabsTrigger value="draft">
              Bản nháp ({bomFormulas.filter((f) => f.status === "draft").length}
              )
            </TabsTrigger>
            <TabsTrigger value="inactive">
              Ngừng sử dụng (
              {bomFormulas.filter((f) => f.status === "inactive").length})
            </TabsTrigger>
            <TabsTrigger value="all">Tất cả ({bomFormulas.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {filteredFormulas
                .filter((f) => f.status === "active")
                .map(renderFormulaCard)}
            </div>
          </TabsContent>

          <TabsContent value="draft" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {filteredFormulas
                .filter((f) => f.status === "draft")
                .map(renderFormulaCard)}
            </div>
          </TabsContent>

          <TabsContent value="inactive" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {filteredFormulas
                .filter((f) => f.status === "inactive")
                .map(renderFormulaCard)}
            </div>
          </TabsContent>

          <TabsContent value="all" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {filteredFormulas.map(renderFormulaCard)}
            </div>
          </TabsContent>
        </Tabs>

        {filteredFormulas.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center">
            <Package2 className="h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">
              Không tìm thấy công thức
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Thử tìm kiếm với từ khóa khác hoặc tạo công thức mới
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
