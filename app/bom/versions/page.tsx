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
import { formulaVersions, bomFormulas } from "@/lib/mock-data";
import { History, GitBranch, Check, X, Plus, Minus, Edit2 } from "lucide-react";

export default function BOMVersionsPage() {
  // Group versions by medicine
  const versionsByMedicine = formulaVersions.reduce(
    (acc, version) => {
      const formula = bomFormulas.find((f) => f.id === version.formulaId);
      if (!formula) return acc;

      if (!acc[formula.medicineId]) {
        acc[formula.medicineId] = {
          medicineName: formula.medicineName,
          versions: [],
        };
      }
      acc[formula.medicineId].versions.push({
        ...version,
        formula,
      });
      return acc;
    },
    {} as Record<string, { medicineName: string; versions: any[] }>,
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

  const changeTypeIcons = {
    added: Plus,
    removed: Minus,
    modified: Edit2,
  };

  const changeTypeColors = {
    added: "text-green-600",
    removed: "text-red-600",
    modified: "text-blue-600",
  };

  const changeTypeLabels = {
    added: "Thêm mới",
    removed: "Loại bỏ",
    modified: "Thay đổi",
  };

  return (
    <DashboardLayout
      role="production_planner"
      breadcrumbs={[
        { label: "Quản lý BOM", href: "/bom/overview" },
        { label: "Quản lý phiên bản" },
      ]}
    >
      <div className="space-y-6">
        <PageHeader
          title="Quản lý Phiên bản Công thức"
          description="Theo dõi lịch sử thay đổi và so sánh các phiên bản công thức sản xuất"
        />

        {/* Timeline by Medicine */}
        {Object.entries(versionsByMedicine).map(
          ([medicineId, { medicineName, versions }]) => (
            <Card key={medicineId}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{medicineName}</CardTitle>
                    <CardDescription>
                      {versions.length} phiên bản công thức
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    So sánh phiên bản
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="relative space-y-6">
                  {/* Timeline line */}
                  <div className="absolute left-[15px] top-0 h-full w-0.5 bg-border" />

                  {versions
                    .sort((a, b) => b.versionNumber - a.versionNumber)
                    .map((version, index) => {
                      const Icon = version.status === "active" ? Check : X;
                      return (
                        <div key={version.id} className="relative pl-10">
                          {/* Timeline dot */}
                          <div
                            className={`absolute left-0 flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                              version.status === "active"
                                ? "border-green-500 bg-green-50"
                                : "border-gray-300 bg-gray-50"
                            }`}
                          >
                            <Icon
                              className={`h-4 w-4 ${
                                version.status === "active"
                                  ? "text-green-600"
                                  : "text-gray-400"
                              }`}
                            />
                          </div>

                          <div className="rounded-lg border bg-card p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-semibold">
                                    Phiên bản {version.version}
                                  </h4>
                                  <Badge
                                    variant="outline"
                                    className={statusColors[version.status]}
                                  >
                                    {statusLabels[version.status]}
                                  </Badge>
                                  {index === 0 && (
                                    <Badge
                                      variant="secondary"
                                      className="gap-1"
                                    >
                                      <GitBranch className="h-3 w-3" />
                                      Mới nhất
                                    </Badge>
                                  )}
                                </div>
                                <p className="mt-1 text-sm text-muted-foreground">
                                  {new Date(
                                    version.changeDate,
                                  ).toLocaleDateString("vi-VN")}{" "}
                                  • Bởi {version.changedBy}
                                </p>
                              </div>
                              <Button variant="ghost" size="sm">
                                <History className="mr-2 h-4 w-4" />
                                Xem chi tiết
                              </Button>
                            </div>

                            {version.changeReason && (
                              <div className="mt-3 rounded-md bg-muted/50 p-3">
                                <p className="text-sm font-medium">
                                  Lý do thay đổi:
                                </p>
                                <p className="mt-1 text-sm text-muted-foreground">
                                  {version.changeReason}
                                </p>
                              </div>
                            )}

                            {version.changes && version.changes.length > 0 && (
                              <div className="mt-3 space-y-2">
                                <p className="text-sm font-medium">
                                  Thay đổi ({version.changes.length}):
                                </p>
                                {version.changes.map(
                                  (change: any, idx: number) => {
                                    const ChangeIcon =
                                      changeTypeIcons[change.type];
                                    return (
                                      <div
                                        key={idx}
                                        className="flex items-start gap-3 rounded-md border bg-background p-3 text-sm"
                                      >
                                        <ChangeIcon
                                          className={`mt-0.5 h-4 w-4 ${changeTypeColors[change.type]}`}
                                        />
                                        <div className="flex-1">
                                          <p className="font-medium">
                                            <span
                                              className={
                                                changeTypeColors[change.type]
                                              }
                                            >
                                              {changeTypeLabels[change.type]}:
                                            </span>{" "}
                                            {change.materialName}
                                          </p>
                                          {change.oldValue &&
                                            change.newValue && (
                                              <p className="mt-1 text-xs text-muted-foreground">
                                                {change.oldValue} →{" "}
                                                {change.newValue}
                                              </p>
                                            )}
                                          {change.newValue &&
                                            !change.oldValue && (
                                              <p className="mt-1 text-xs text-muted-foreground">
                                                {change.newValue}
                                              </p>
                                            )}
                                          {change.description && (
                                            <p className="mt-2 text-xs text-muted-foreground">
                                              {change.description}
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  },
                                )}
                              </div>
                            )}

                            {version.formula && (
                              <div className="mt-3 border-t pt-3">
                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                  <span>
                                    {version.formula.bomItems.length} nguyên
                                    liệu
                                  </span>
                                  <span>
                                    Mẻ SX:{" "}
                                    {version.formula.batchSize.toLocaleString(
                                      "vi-VN",
                                    )}{" "}
                                    {version.formula.batchUnit}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>
          ),
        )}

        {Object.keys(versionsByMedicine).length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-12 text-center">
              <History className="h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">
                Chưa có lịch sử phiên bản
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Các thay đổi công thức sẽ được ghi nhận tại đây
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
