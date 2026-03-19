"use client";
import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { CalendarDays, MapPin, CheckCircle2, XCircle, Clock, Plus } from "lucide-react";
import { lichPhongVan, ungVien, yeuCauTuyenDung } from "@/lib/hr-mock-data";

const ketQuaConfig = {
  dat: { label: "Đạt", color: "bg-green-100 text-green-700", icon: CheckCircle2 },
  khong_dat: { label: "Không đạt", color: "bg-red-100 text-red-700", icon: XCircle },
  cho_ket_qua: { label: "Chờ kết quả", color: "bg-amber-100 text-amber-700", icon: Clock },
};

export default function InterviewsPage() {
  const [filterKetQua, setFilterKetQua] = useState("all");
  const [showForm, setShowForm] = useState(false);

  const filtered = lichPhongVan.filter((l) => {
    if (filterKetQua !== "all" && l.ketQua !== filterKetQua) return false;
    return true;
  });

  const sorted = [...filtered].sort((a, b) =>
    new Date(b.thoiGian).getTime() - new Date(a.thoiGian).getTime()
  );

  return (
    <DashboardLayout
      role="hr_manager"
      breadcrumbs={[{ label: "Quản lý Nhân sự", href: "/hr" }, { label: "Lịch Phỏng vấn" }]}
    >
      <div className="space-y-6">
        <PageHeader
          title="Lịch Phỏng vấn"
          description="Quản lý lịch phỏng vấn và ghi nhận kết quả đánh giá"
        />

        {/* Summary */}
        <div className="grid gap-4 grid-cols-3">
          {(["dat", "khong_dat", "cho_ket_qua"] as const).map((kq) => {
            const cfg = ketQuaConfig[kq];
            const count = lichPhongVan.filter((l) => l.ketQua === kq).length;
            const Icon = cfg.icon;
            return (
              <Card key={kq} className="p-4 flex items-center gap-3">
                <Icon className="h-8 w-8 text-muted-foreground" />
                <div>
                  <div className="text-2xl font-bold">{count}</div>
                  <div className="text-sm text-muted-foreground">{cfg.label}</div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Filters + action */}
        <Card className="p-4">
          <div className="flex items-center gap-3 justify-between">
            <Select value={filterKetQua} onValueChange={setFilterKetQua}>
              <SelectTrigger className="w-44"><SelectValue placeholder="Kết quả" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="dat">Đạt</SelectItem>
                <SelectItem value="khong_dat">Không đạt</SelectItem>
                <SelectItem value="cho_ket_qua">Chờ kết quả</SelectItem>
              </SelectContent>
            </Select>
            <Button className="gap-2" onClick={() => setShowForm(!showForm)}>
              <Plus className="h-4 w-4" />
              Thêm lịch phỏng vấn
            </Button>
          </div>
        </Card>

        {/* Quick schedule form */}
        {showForm && (
          <Card className="p-5 space-y-4 border-blue-200">
            <h3 className="font-semibold text-blue-800">Tạo Lịch Phỏng vấn Mới</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Ứng viên</label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Chọn ứng viên" /></SelectTrigger>
                  <SelectContent>
                    {ungVien.map((uv) => (
                      <SelectItem key={uv.maUngVien} value={uv.maUngVien}>{uv.hoTen}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Vòng phỏng vấn</label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Chọn vòng" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="v1">Vòng 1 – HR</SelectItem>
                    <SelectItem value="v2">Vòng 2 – Chuyên môn</SelectItem>
                    <SelectItem value="v3">Vòng 3 – BGĐ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Thời gian</label>
                <Input type="datetime-local" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Địa điểm</label>
                <Input placeholder="Phòng họp A201 / Zoom..." />
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm">Tạo lịch</Button>
              <Button size="sm" variant="outline" onClick={() => setShowForm(false)}>Hủy</Button>
            </div>
          </Card>
        )}

        {/* Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ứng viên</TableHead>
                <TableHead>Vị trí</TableHead>
                <TableHead>Vòng PV</TableHead>
                <TableHead>Thời gian</TableHead>
                <TableHead>Địa điểm</TableHead>
                <TableHead>Người PV</TableHead>
                <TableHead className="text-center">Điểm</TableHead>
                <TableHead>Kết quả</TableHead>
                <TableHead>Nhận xét</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map((lp) => {
                const uv = ungVien.find((u) => u.maUngVien === lp.maUngVien);
                const yc = yeuCauTuyenDung.find((y) => y.maYeuCau === lp.maYeuCau);
                const cfg = ketQuaConfig[lp.ketQua];
                const CfgIcon = cfg.icon;
                return (
                  <TableRow key={lp.maLich}>
                    <TableCell className="font-medium">{lp.tenUngVien}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{uv?.tenViTri}</TableCell>
                    <TableCell className="text-sm">{lp.vongPV}</TableCell>
                    <TableCell className="text-sm">
                      <div>{new Date(lp.thoiGian).toLocaleDateString("vi-VN")}</div>
                      <div className="text-xs text-muted-foreground">{new Date(lp.thoiGian).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}</div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{lp.diaDiem}</TableCell>
                    <TableCell className="text-sm">
                      <div className="space-y-0.5">
                        {lp.tenNguoiPV.map((n, i) => <div key={i}>{n}</div>)}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {lp.diemDanh ? (
                        <span className={`font-bold ${lp.diemDanh >= 70 ? "text-green-600" : "text-red-600"}`}>{lp.diemDanh}</span>
                      ) : "–"}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`gap-1 ${cfg.color}`}>
                        <CfgIcon className="h-3 w-3" />{cfg.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-[180px]">
                      {lp.nhanXet ? (
                        <span className="line-clamp-2 italic">"{lp.nhanXet}"</span>
                      ) : (
                        lp.ketQua === "cho_ket_qua" && (
                          <Button size="sm" variant="outline" className="h-7 text-xs">Ghi kết quả</Button>
                        )
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
