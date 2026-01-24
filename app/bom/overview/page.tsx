"use client";
import { DashboardLayout } from "@/components/dashboard-layout";
import { PageHeader } from "@/components/page-header";
import { KpiCard } from "@/components/kpi-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { bomFormulas, medicines } from "@/lib/mock-data";
import {
  FileText,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Plus,
  Eye,
  History,
} from "lucide-react";
import Link from "next/link";

export default function BOMOverviewPage() {
  const totalFormulas = bomFormulas.length;
  const activeFormulas = bomFormulas.filter(
    (f) => f.status === "active",
  ).length;
  const draftFormulas = bomFormulas.filter((f) => f.status === "draft").length;
  const uniqueMedicines = new Set(bomFormulas.map((f) => f.medicineId)).size;

  const recentFormulas = bomFormulas
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 6);

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

  return (
    <DashboardLayout
      role="production_planner"
      breadcrumbs={[
        { label: "Quản lý BOM", href: "/bom/overview" },
        { label: "Tổng quan" },
      ]}
    >
      <div className="space-y-6">
        <PageHeader
          title="Quản lý Định mức Nguyên vật liệu (BOM)"
          description="Quản lý công thức sản xuất, phiên bản và tính toán nhu cầu nguyên liệu"
        />

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            title="Tổng số công thức"
            value={totalFormulas}
            icon={FileText}
            trend={{ value: 0, isPositive: true }}
          />
          <KpiCard
            title="Công thức đang dùng"
            value={activeFormulas}
            icon={CheckCircle2}
            iconClassName="text-green-600"
          />
          <KpiCard
            title="Bản nháp"
            value={draftFormulas}
            icon={Clock}
            iconClassName="text-yellow-600"
          />
          <KpiCard
            title="Thuốc có công thức"
            value={uniqueMedicines}
            icon={FileText}
            iconClassName="text-blue-600"
          />
        </div>

        {/* Recent Formulas */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Công thức sản xuất</CardTitle>
                <CardDescription>
                  Danh sách các công thức đã khai báo
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/bom/formulas">
                    <Eye className="mr-2 h-4 w-4" />
                    Xem tất cả
                  </Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/bom/formulas/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Tạo công thức mới
                  </Link>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentFormulas.map((formula) => (
                <div
                  key={formula.id}
                  className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{formula.medicineName}</h4>
                      <Badge
                        variant="outline"
                        className={statusColors[formula.status]}
                      >
                        {statusLabels[formula.status]}
                      </Badge>
                      <Badge variant="secondary">v{formula.version}</Badge>
                    </div>
                    <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Mã: {formula.code}</span>
                      <span>•</span>
                      <span>{formula.bomItems.length} nguyên liệu</span>
                      <span>•</span>
                      <span>
                        Mẻ SX: {formula.batchSize.toLocaleString("vi-VN")}{" "}
                        {formula.batchUnit}
                      </span>
                    </div>
                    {formula.changeReason && (
                      <p className="mt-2 text-xs text-muted-foreground">
                        📝 {formula.changeReason}
                      </p>
                    )}
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
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="transition-shadow hover:shadow-md">
            <CardHeader>
              <FileText className="h-8 w-8 text-primary" />
              <CardTitle className="mt-4">Danh sách công thức</CardTitle>
              <CardDescription>
                Xem và quản lý tất cả công thức sản xuất
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline" asChild>
                <Link href="/bom/formulas">Xem danh sách</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="transition-shadow hover:shadow-md">
            <CardHeader>
              <History className="h-8 w-8 text-primary" />
              <CardTitle className="mt-4">Quản lý phiên bản</CardTitle>
              <CardDescription>
                Theo dõi lịch sử thay đổi công thức
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline" asChild>
                <Link href="/bom/versions">Xem lịch sử</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="transition-shadow hover:shadow-md">
            <CardHeader>
              <AlertTriangle className="h-8 w-8 text-primary" />
              <CardTitle className="mt-4">Tính nhu cầu NVL</CardTitle>
              <CardDescription>
                Tự động tính toán nhu cầu nguyên vật liệu
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline" asChild>
                <Link href="/bom/requirements">Tính toán</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
