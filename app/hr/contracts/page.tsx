"use client";
import { DashboardLayout } from "@/components/dashboard-layout";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { CheckCircle2, XCircle, Clock, AlertCircle } from "lucide-react";
import { hopDongThuViec } from "@/lib/hr-mock-data";

const trangThaiHD: Record<string, { label: string; color: string }> = {
  dang_thu_viec: { label: "Đang thử việc", color: "bg-blue-100 text-blue-700" },
  dat: { label: "Đạt – Nhận chính thức", color: "bg-green-100 text-green-700" },
  khong_dat: { label: "Không đạt", color: "bg-red-100 text-red-700" },
  nghi_giua_chung: { label: "Nghỉ giữa chừng", color: "bg-gray-100 text-gray-600" },
};

const checklistItems = [
  { key: "daotaoGMP", label: "Đào tạo GMP", required: true },
  { key: "daotaoATVSLD", label: "Đào tạo ATVSLĐ", required: true },
  { key: "daotaoPCCC", label: "Đào tạo PCCC", required: true },
  { key: "daotaoNhanVien", label: "Đào tạo nội bộ NV", required: true },
  { key: "hopDongKy", label: "Hợp đồng đã ký", required: true },
  { key: "theNhanVien", label: "Thẻ nhân viên", required: false },
  { key: "taiKhoanHeThong", label: "Tài khoản hệ thống", required: false },
];

export default function ContractsPage() {
  return (
    <DashboardLayout
      role="hr_manager"
      breadcrumbs={[{ label: "Quản lý Nhân sự", href: "/hr" }, { label: "Hợp đồng Thử việc" }]}
    >
      <div className="space-y-6">
        <PageHeader
          title="Hợp đồng Thử việc"
          description="Theo dõi thử việc và checklist onboarding bắt buộc theo chuẩn GMP"
        />

        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          {Object.entries(trangThaiHD).map(([key, cfg]) => (
            <Card key={key} className="p-4">
              <div className="text-2xl font-bold">{hopDongThuViec.filter((h) => h.trangThai === key).length}</div>
              <div className="text-sm text-muted-foreground mt-0.5">{cfg.label.split("–")[0].trim()}</div>
            </Card>
          ))}
        </div>

        {/* HD list with expanded checklist */}
        <div className="space-y-4">
          {hopDongThuViec.map((hd) => {
            const cfg = trangThaiHD[hd.trangThai];
            const checklist = hd.checklistOnboarding;
            const completed = Object.values(checklist).filter(Boolean).length;
            const total = Object.values(checklist).length;
            const progressPct = Math.round((completed / total) * 100);

            const tuNgay = new Date(hd.tuNgay);
            const denNgay = new Date(hd.denNgay);
            const today = new Date("2026-03-19");
            const daysLeft = Math.max(0, Math.round((denNgay.getTime() - today.getTime()) / 86400000));
            const daysTotal = Math.round((denNgay.getTime() - tuNgay.getTime()) / 86400000);
            const daysDone = Math.round((today.getTime() - tuNgay.getTime()) / 86400000);
            const timePct = Math.min(100, Math.round((daysDone / daysTotal) * 100));

            return (
              <Card key={hd.maHD} className="p-5 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-base">{hd.tenNhanVien}</h3>
                      <Badge variant="outline" className={`text-xs ${cfg.color}`}>{cfg.label}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">{hd.tenViTri} · {hd.tenPhongBan}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {hd.maHD} · {new Date(hd.tuNgay).toLocaleDateString("vi-VN")} → {new Date(hd.denNgay).toLocaleDateString("vi-VN")}
                      {hd.trangThai === "dang_thu_viec" && ` · Còn ${daysLeft} ngày`}
                    </p>
                    <p className="text-sm mt-1">
                      Lương thử việc: <strong>{hd.luong.toLocaleString("vi-VN")}đ/tháng</strong>
                    </p>
                  </div>
                  {hd.trangThai === "dang_thu_viec" && (
                    <div className="text-right">
                      <Button size="sm" className="bg-green-600 hover:bg-green-700 text-xs h-8">Đánh giá kết thúc TV</Button>
                    </div>
                  )}
                </div>

                {/* Time progress */}
                {hd.trangThai === "dang_thu_viec" && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Tiến độ thời gian thử việc</span>
                      <span>{timePct}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all"
                        style={{ width: `${timePct}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Checklist Onboarding */}
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <h4 className="text-sm font-medium flex items-center gap-1.5">
                      Checklist Onboarding bắt buộc
                      <span className={`text-xs font-normal px-1.5 py-0.5 rounded ${progressPct === 100 ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                        {completed}/{total} hoàn thành
                      </span>
                    </h4>
                    <div className="h-1.5 w-24 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${progressPct === 100 ? "bg-green-500" : "bg-amber-500"}`}
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {checklistItems.map(({ key, label, required }) => {
                      const done = checklist[key as keyof typeof checklist] ?? false;
                      return (
                        <div
                          key={key}
                          className={`flex items-center gap-1.5 p-2 rounded text-xs border ${done ? "border-green-200 bg-green-50" : required ? "border-red-200 bg-red-50" : "border-muted bg-muted/30"}`}
                        >
                          {done ? (
                            <CheckCircle2 className="h-3.5 w-3.5 text-green-600 shrink-0" />
                          ) : (
                            <XCircle className={`h-3.5 w-3.5 shrink-0 ${required ? "text-red-500" : "text-muted-foreground"}`} />
                          )}
                          <span className={done ? "text-green-700" : required ? "text-red-700 font-medium" : "text-muted-foreground"}>
                            {label}
                            {required && !done && " *"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="text-xs text-muted-foreground italic border-l-2 pl-3">
                  "{hd.dieuKhoan.slice(0, 120)}..."
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
