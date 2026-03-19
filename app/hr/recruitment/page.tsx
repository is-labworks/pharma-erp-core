"use client";
import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { AlertCircle, FilePlus, CheckCircle2, Users } from "lucide-react";
import Link from "next/link";
import { yeuCauTuyenDung } from "@/lib/hr-mock-data";
import type { TrangThaiYeuCau } from "@/lib/hr-types";

const trangThaiConfig: Record<TrangThaiYeuCau, { label: string; color: string }> = {
  mo: { label: "Mở", color: "bg-slate-100 text-slate-700" },
  dang_tuyen: { label: "Đang tuyển", color: "bg-blue-100 text-blue-700" },
  dong: { label: "Đã đóng", color: "bg-gray-100 text-gray-600" },
};

const duyetConfig: Record<string, { label: string; color: string }> = {
  cho_duyet: { label: "Chờ duyệt", color: "bg-amber-100 text-amber-700" },
  duyet_truong_bp: { label: "Trưởng BP duyệt", color: "bg-indigo-100 text-indigo-700" },
  duyet_hr: { label: "HR duyệt", color: "bg-purple-100 text-purple-700" },
  da_duyet: { label: "Đã duyệt", color: "bg-green-100 text-green-700" },
  tu_choi: { label: "Từ chối", color: "bg-red-100 text-red-700" },
};

export default function RecruitmentPage() {
  const [filterTrangThai, setFilterTrangThai] = useState("all");
  const [filterPhong, setFilterPhong] = useState("all");

  const phongBans = Array.from(new Set(yeuCauTuyenDung.map((y) => y.maPhongBan))).map((ma) => ({
    ma, ten: yeuCauTuyenDung.find((y) => y.maPhongBan === ma)?.tenPhongBan ?? ma,
  }));

  const filtered = yeuCauTuyenDung.filter((y) => {
    if (filterTrangThai !== "all" && y.trangThai !== filterTrangThai) return false;
    if (filterPhong !== "all" && y.maPhongBan !== filterPhong) return false;
    return true;
  });

  const tongUngVien = yeuCauTuyenDung.reduce((s, y) => s + (y.tongUngVien ?? 0), 0);

  return (
    <DashboardLayout
      role="hr_manager"
      breadcrumbs={[{ label: "Quản lý Nhân sự", href: "/hr" }, { label: "Yêu cầu Tuyển dụng" }]}
    >
      <div className="space-y-6">
        <PageHeader
          title="Yêu cầu Tuyển dụng"
          description="Quản lý phiếu tuyển dụng với JD, tiêu chí bắt buộc và quy trình phê duyệt"
        />

        {/* Summary cards */}
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
          <Card className="p-4 flex items-center gap-4">
            <FilePlus className="h-9 w-9 text-blue-500 shrink-0" />
            <div>
              <div className="text-2xl font-bold">{yeuCauTuyenDung.length}</div>
              <div className="text-sm text-muted-foreground">Tổng phiếu tuyển</div>
            </div>
          </Card>
          <Card className="p-4 flex items-center gap-4">
            <Users className="h-9 w-9 text-purple-500 shrink-0" />
            <div>
              <div className="text-2xl font-bold">{tongUngVien}</div>
              <div className="text-sm text-muted-foreground">Tổng ứng viên</div>
            </div>
          </Card>
          <Card className="p-4 flex items-center gap-4">
            <CheckCircle2 className="h-9 w-9 text-green-500 shrink-0" />
            <div>
              <div className="text-2xl font-bold">
                {yeuCauTuyenDung.reduce((s, y) => s + (y.tongDatYeuCau ?? 0), 0)}
              </div>
              <div className="text-sm text-muted-foreground">Ứng viên đạt yêu cầu</div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-4">
          <div className="flex flex-wrap gap-3 items-center justify-between">
            <div className="flex gap-3">
              <Select value={filterTrangThai} onValueChange={setFilterTrangThai}>
                <SelectTrigger className="w-40"><SelectValue placeholder="Trạng thái" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="mo">Mở</SelectItem>
                  <SelectItem value="dang_tuyen">Đang tuyển</SelectItem>
                  <SelectItem value="dong">Đã đóng</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterPhong} onValueChange={setFilterPhong}>
                <SelectTrigger className="w-52"><SelectValue placeholder="Phòng ban" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả phòng ban</SelectItem>
                  {phongBans.map((pb) => (
                    <SelectItem key={pb.ma} value={pb.ma}>{pb.ten}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Link href="/hr/recruitment/create">
              <Button className="gap-2">
                <FilePlus className="h-4 w-4" />
                Tạo yêu cầu tuyển
              </Button>
            </Link>
          </div>
        </Card>

        {/* Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã YC</TableHead>
                <TableHead>Vị trí</TableHead>
                <TableHead>Phòng ban</TableHead>
                <TableHead className="text-center">SL cần</TableHead>
                <TableHead>Lương (triệu)</TableHead>
                <TableHead>Ngày cần NS</TableHead>
                <TableHead>Tiến độ duyệt</TableHead>
                <TableHead className="text-center">UV</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((y) => {
                const dcfg = duyetConfig[y.trangThaiDuyet] ?? { label: y.trangThaiDuyet, color: "bg-gray-100 text-gray-700" };
                const tcfg = trangThaiConfig[y.trangThai];
                return (
                  <TableRow key={y.maYeuCau}>
                    <TableCell className="font-mono text-xs font-medium">{y.maYeuCau}</TableCell>
                    <TableCell className="font-medium text-sm max-w-[160px]">
                      <div className="truncate">{y.tenViTri}</div>
                    </TableCell>
                    <TableCell className="text-sm max-w-[150px]">
                      <div className="truncate text-muted-foreground">{y.tenPhongBan}</div>
                    </TableCell>
                    <TableCell className="text-center font-bold text-primary">{y.soLuong}</TableCell>
                    <TableCell className="text-sm">
                      {(y.mucLuongMin / 1e6).toFixed(0)}–{(y.mucLuongMax / 1e6).toFixed(0)}tr
                    </TableCell>
                    <TableCell className="text-sm">
                      {new Date(y.ngayCanNhanSu).toLocaleDateString("vi-VN")}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1 items-center">
                        {y.lichSuDuyet.map((ld, i) => (
                          <div
                            key={i}
                            className={`h-2.5 w-2.5 rounded-full ${
                              ld.trangThai === "dong_y" ? "bg-green-500" :
                              ld.trangThai === "tu_choi" ? "bg-red-500" : "bg-gray-200"
                            }`}
                            title={`${ld.vaiTro}: ${ld.trangThai === "dong_y" ? "Đồng ý" : ld.trangThai === "tu_choi" ? "Từ chối" : "Chờ"}`}
                          />
                        ))}
                        <span className="text-xs text-muted-foreground ml-1">
                          {y.lichSuDuyet.filter((l) => l.trangThai === "dong_y").length}/{y.lichSuDuyet.length}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="font-medium">{y.tongUngVien ?? 0}</span>
                      {(y.tongDatYeuCau ?? 0) > 0 && (
                        <span className="text-xs text-green-600 ml-1">({y.tongDatYeuCau} đạt)</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`text-xs ${tcfg.color}`}>
                        {tcfg.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Link href={`/hr/recruitment/${y.maYeuCau}`}>
                        <Button size="sm" variant="outline" className="h-7 text-xs">Chi tiết</Button>
                      </Link>
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
