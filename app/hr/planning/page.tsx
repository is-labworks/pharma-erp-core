"use client";
import { DashboardLayout } from "@/components/dashboard-layout";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { FilePlus, CheckCircle2, Clock, XCircle, FileText } from "lucide-react";
import Link from "next/link";
import { keHoachNhanLuc } from "@/lib/hr-mock-data";
import { useState } from "react";
import type { TrangThaiKeHoach } from "@/lib/hr-types";

const trangThaiConfig: Record<TrangThaiKeHoach, { label: string; color: string; icon: React.ElementType }> = {
  nhap: { label: "Nháp", color: "bg-slate-100 text-slate-700 border-slate-200", icon: FileText },
  cho_duyet: { label: "Chờ duyệt", color: "bg-amber-100 text-amber-700 border-amber-200", icon: Clock },
  da_duyet: { label: "Đã duyệt", color: "bg-green-100 text-green-700 border-green-200", icon: CheckCircle2 },
  tu_choi: { label: "Từ chối", color: "bg-red-100 text-red-700 border-red-200", icon: XCircle },
};

export default function PlanningPage() {
  const [filterTrangThai, setFilterTrangThai] = useState<string>("all");
  const [filterNam, setFilterNam] = useState<string>("2026");
  const [filterPhong, setFilterPhong] = useState<string>("all");

  const filtered = keHoachNhanLuc.filter((k) => {
    if (filterTrangThai !== "all" && k.trangThai !== filterTrangThai) return false;
    if (filterNam !== "all" && k.nam !== parseInt(filterNam)) return false;
    if (filterPhong !== "all" && k.maPhongBan !== filterPhong) return false;
    return true;
  });

  const tongCanTuyen = filtered.reduce((s, k) => s + k.soLuongCanTuyen, 0);
  const phongBans = Array.from(new Set(keHoachNhanLuc.map((k) => k.maPhongBan))).map((ma) => ({
    ma, ten: keHoachNhanLuc.find((k) => k.maPhongBan === ma)?.tenPhongBan ?? ma,
  }));

  return (
    <DashboardLayout
      role="hr_manager"
      breadcrumbs={[{ label: "Quản lý Nhân sự", href: "/hr" }, { label: "Kế hoạch Nhân lực" }]}
    >
      <div className="space-y-6">
        <PageHeader
          title="Kế hoạch Nhân lực"
          description="Lập và theo dõi kế hoạch tuyển dụng theo phòng ban, vị trí, tháng/quý"
        />

        {/* Summary */}
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          {(["nhap", "cho_duyet", "da_duyet", "tu_choi"] as TrangThaiKeHoach[]).map((ts) => {
            const cfg = trangThaiConfig[ts];
            const count = keHoachNhanLuc.filter((k) => k.trangThai === ts).length;
            return (
              <Card key={ts} className="p-4 flex items-center gap-3">
                <cfg.icon className="h-8 w-8 text-muted-foreground shrink-0" />
                <div>
                  <div className="text-xl font-bold">{count}</div>
                  <div className="text-xs text-muted-foreground">{cfg.label}</div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Filters & Action */}
        <Card className="p-4">
          <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
            <div className="flex flex-wrap gap-3">
              <Select value={filterNam} onValueChange={setFilterNam}>
                <SelectTrigger className="w-28">
                  <SelectValue placeholder="Năm" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="2026">2026</SelectItem>
                  <SelectItem value="2025">2025</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterTrangThai} onValueChange={setFilterTrangThai}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="nhap">Nháp</SelectItem>
                  <SelectItem value="cho_duyet">Chờ duyệt</SelectItem>
                  <SelectItem value="da_duyet">Đã duyệt</SelectItem>
                  <SelectItem value="tu_choi">Từ chối</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterPhong} onValueChange={setFilterPhong}>
                <SelectTrigger className="w-52">
                  <SelectValue placeholder="Phòng ban" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả phòng ban</SelectItem>
                  {phongBans.map((pb) => (
                    <SelectItem key={pb.ma} value={pb.ma}>{pb.ten}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Link href="/hr/planning/create">
              <Button className="gap-2">
                <FilePlus className="h-4 w-4" />
                Lập kế hoạch mới
              </Button>
            </Link>
          </div>
        </Card>

        {/* Table */}
        <Card>
          <div className="p-4 border-b">
            <p className="text-sm text-muted-foreground">
              Tìm thấy <strong>{filtered.length}</strong> kế hoạch · Tổng cần tuyển:{" "}
              <strong className="text-primary">{tongCanTuyen} vị trí</strong>
            </p>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã KH</TableHead>
                <TableHead>Phòng ban</TableHead>
                <TableHead>Vị trí</TableHead>
                <TableHead className="text-center">Tháng</TableHead>
                <TableHead className="text-center">Định biên</TableHead>
                <TableHead className="text-center">Hiện có</TableHead>
                <TableHead className="text-center">Cần tuyển</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Người lập</TableHead>
                <TableHead>Ngày lập</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((k) => {
                const cfg = trangThaiConfig[k.trangThai];
                const CfgIcon = cfg.icon;
                return (
                  <TableRow key={k.maKeHoach}>
                    <TableCell className="font-mono text-xs font-medium">{k.maKeHoach}</TableCell>
                    <TableCell className="max-w-[160px]">
                      <div className="text-sm font-medium truncate">{k.tenPhongBan}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{k.tenViTri}</div>
                    </TableCell>
                    <TableCell className="text-center text-sm">
                      {k.thang}/{k.nam}
                    </TableCell>
                    <TableCell className="text-center font-medium">{k.dinhBien}</TableCell>
                    <TableCell className="text-center">{k.hienCo}</TableCell>
                    <TableCell className="text-center">
                      <span className="font-bold text-primary">{k.soLuongCanTuyen}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`gap-1 text-xs ${cfg.color}`}>
                        <CfgIcon className="h-3 w-3" />
                        {cfg.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{k.tenNguoiLap}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(k.ngayLap).toLocaleDateString("vi-VN")}
                    </TableCell>
                    <TableCell>
                      {k.trangThai === "cho_duyet" && (
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline" className="h-7 text-xs text-green-600 border-green-300">
                            Duyệt
                          </Button>
                          <Button size="sm" variant="outline" className="h-7 text-xs text-red-600 border-red-300">
                            Từ chối
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      </div>
    </DashboardLayout>
  );
}
