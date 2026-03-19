"use client";
import { DashboardLayout } from "@/components/dashboard-layout";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users, ClipboardList, CalendarDays, UserCheck,
  TrendingUp, AlertCircle, FileText, FilePlus,
  BarChart3, CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import {
  keHoachNhanLuc, yeuCauTuyenDung, ungVien, offers, lichPhongVan, hopDongThuViec,
} from "@/lib/hr-mock-data";

export default function HRPage() {
  const totalKeHoach = keHoachNhanLuc.length;
  const keHoachCho = keHoachNhanLuc.filter((k) => k.trangThai === "cho_duyet").length;
  const keHoachDuyet = keHoachNhanLuc.filter((k) => k.trangThai === "da_duyet").length;

  const totalYeuCau = yeuCauTuyenDung.length;
  const yeuCauDangTuyen = yeuCauTuyenDung.filter((y) => y.trangThai === "dang_tuyen").length;
  const tongUngVien = ungVien.length;
  const dangTrongPipeline = ungVien.filter((u) =>
    u.trangThaiPipeline !== "loai" && u.trangThaiPipeline !== "nhan_viec"
  ).length;

  const offerCho = offers.filter((o) => o.trangThai === "gui").length;
  const offerDongY = offers.filter((o) => o.trangThai === "dong_y").length;
  const offerTuChoi = offers.filter((o) => o.trangThai === "tu_choi").length;

  const pvHomNay = lichPhongVan.filter((l) => {
    const d = new Date(l.thoiGian);
    const today = new Date("2026-03-19");
    return d.toDateString() === today.toDateString() || l.ketQua === "cho_ket_qua";
  }).length;

  const hdDangThuViec = hopDongThuViec.filter((h) => h.trangThai === "dang_thu_viec").length;

  // Pipeline distribution
  const pipelineCounts = {
    ho_so: ungVien.filter((u) => u.trangThaiPipeline === "ho_so").length,
    sang_loc: ungVien.filter((u) => u.trangThaiPipeline === "sang_loc").length,
    test: ungVien.filter((u) => u.trangThaiPipeline === "test").length,
    pv_hr: ungVien.filter((u) => u.trangThaiPipeline === "pv_hr").length,
    pv_chuyen_mon: ungVien.filter((u) => u.trangThaiPipeline === "pv_chuyen_mon").length,
    tham_dinh: ungVien.filter((u) => u.trangThaiPipeline === "tham_dinh").length,
    offer: ungVien.filter((u) => u.trangThaiPipeline === "offer").length,
    nhan_viec: ungVien.filter((u) => u.trangThaiPipeline === "nhan_viec").length,
  };

  return (
    <DashboardLayout role="hr_manager" breadcrumbs={[{ label: "Tổng quan Nhân sự" }]}>
      <div className="space-y-6">
        <PageHeader
          title="Quản lý Nhân sự"
          description="Hệ thống lập kế hoạch nhân lực và tuyển dụng dược phẩm"
        />

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="p-6 border-l-4 border-l-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Kế hoạch nhân lực</p>
                <h3 className="text-2xl font-bold">{totalKeHoach}</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-600 font-medium">{keHoachDuyet} đã duyệt</span>
                  {" · "}
                  <span className="text-orange-500">{keHoachCho} chờ duyệt</span>
                </p>
              </div>
              <ClipboardList className="h-9 w-9 text-blue-500" />
            </div>
          </Card>
          <Card className="p-6 border-l-4 border-l-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Yêu cầu tuyển dụng</p>
                <h3 className="text-2xl font-bold">{totalYeuCau}</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-purple-600 font-medium">{yeuCauDangTuyen} đang tuyển</span>
                </p>
              </div>
              <FilePlus className="h-9 w-9 text-purple-500" />
            </div>
          </Card>
          <Card className="p-6 border-l-4 border-l-amber-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ứng viên trong pipeline</p>
                <h3 className="text-2xl font-bold">{tongUngVien}</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-amber-600 font-medium">{dangTrongPipeline} đang xử lý</span>
                </p>
              </div>
              <Users className="h-9 w-9 text-amber-500" />
            </div>
          </Card>
          <Card className="p-6 border-l-4 border-l-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Offer đã gửi</p>
                <h3 className="text-2xl font-bold">{offers.length}</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-600 font-medium">{offerDongY} đồng ý</span>
                  {" · "}
                  <span className="text-red-500">{offerTuChoi} từ chối</span>
                </p>
              </div>
              <UserCheck className="h-9 w-9 text-green-500" />
            </div>
          </Card>
        </div>

        {/* Alerts */}
        {keHoachCho > 0 && (
          <Card className="p-4 border-orange-200 bg-orange-50 dark:bg-orange-950">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-orange-600 shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-orange-900 dark:text-orange-100">
                  Có {keHoachCho} kế hoạch nhân lực đang chờ phê duyệt từ Ban Giám đốc
                </p>
              </div>
              <Link href="/hr/planning">
                <Button size="sm" variant="outline" className="border-orange-400 text-orange-700">
                  Xem ngay
                </Button>
              </Link>
            </div>
          </Card>
        )}

        {offerCho > 0 && (
          <Card className="p-4 border-blue-200 bg-blue-50 dark:bg-blue-950">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  Có {offerCho} offer đang chờ phản hồi từ ứng viên
                </p>
              </div>
              <Link href="/hr/offers">
                <Button size="sm" variant="outline" className="border-blue-400 text-blue-700">
                  Xem offer
                </Button>
              </Link>
            </div>
          </Card>
        )}

        {/* Pipeline Funnel */}
        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-purple-600" />
            Phễu Tuyển dụng (Pipeline)
          </h3>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
            {[
              { label: "Nhận hồ sơ", count: pipelineCounts.ho_so + tongUngVien, color: "bg-slate-100 text-slate-700" },
              { label: "Sàng lọc", count: pipelineCounts.sang_loc + pipelineCounts.test + pipelineCounts.pv_hr + pipelineCounts.pv_chuyen_mon + pipelineCounts.tham_dinh + pipelineCounts.offer + pipelineCounts.nhan_viec, color: "bg-blue-100 text-blue-700" },
              { label: "Test", count: pipelineCounts.test + pipelineCounts.pv_hr + pipelineCounts.pv_chuyen_mon + pipelineCounts.tham_dinh + pipelineCounts.offer + pipelineCounts.nhan_viec, color: "bg-indigo-100 text-indigo-700" },
              { label: "PV HR", count: pipelineCounts.pv_hr + pipelineCounts.pv_chuyen_mon + pipelineCounts.tham_dinh + pipelineCounts.offer + pipelineCounts.nhan_viec, color: "bg-violet-100 text-violet-700" },
              { label: "PV CM", count: pipelineCounts.pv_chuyen_mon + pipelineCounts.tham_dinh + pipelineCounts.offer + pipelineCounts.nhan_viec, color: "bg-purple-100 text-purple-700" },
              { label: "Thẩm định", count: pipelineCounts.tham_dinh + pipelineCounts.offer + pipelineCounts.nhan_viec, color: "bg-pink-100 text-pink-700" },
              { label: "Offer", count: pipelineCounts.offer + pipelineCounts.nhan_viec, color: "bg-orange-100 text-orange-700" },
              { label: "Nhận việc", count: pipelineCounts.nhan_viec, color: "bg-green-100 text-green-700" },
            ].map((stage) => (
              <div key={stage.label} className={`rounded-lg p-3 text-center ${stage.color}`}>
                <div className="text-2xl font-bold">{stage.count}</div>
                <div className="text-xs mt-1 leading-tight">{stage.label}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Link href="/hr/planning">
            <Card className="p-5 hover:shadow-lg transition-shadow cursor-pointer group">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900 group-hover:bg-blue-200 transition-colors">
                  <ClipboardList className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                </div>
                <div>
                  <h3 className="font-semibold">Kế hoạch Nhân lực</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">Lập và theo dõi kế hoạch tuyển dụng theo phòng ban</p>
                </div>
              </div>
            </Card>
          </Link>
          <Link href="/hr/recruitment">
            <Card className="p-5 hover:shadow-lg transition-shadow cursor-pointer group">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900 group-hover:bg-purple-200 transition-colors">
                  <FilePlus className="h-5 w-5 text-purple-600 dark:text-purple-300" />
                </div>
                <div>
                  <h3 className="font-semibold">Yêu cầu Tuyển dụng</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">Quản lý phiếu tuyển với JD và tiêu chí bắt buộc</p>
                </div>
              </div>
            </Card>
          </Link>
          <Link href="/hr/candidates">
            <Card className="p-5 hover:shadow-lg transition-shadow cursor-pointer group">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-amber-100 dark:bg-amber-900 group-hover:bg-amber-200 transition-colors">
                  <Users className="h-5 w-5 text-amber-600 dark:text-amber-300" />
                </div>
                <div>
                  <h3 className="font-semibold">Pipeline Ứng viên</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">Theo dõi ứng viên từ sàng lọc đến nhận việc</p>
                </div>
              </div>
            </Card>
          </Link>
          <Link href="/hr/interviews">
            <Card className="p-5 hover:shadow-lg transition-shadow cursor-pointer group">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-cyan-100 dark:bg-cyan-900 group-hover:bg-cyan-200 transition-colors">
                  <CalendarDays className="h-5 w-5 text-cyan-600 dark:text-cyan-300" />
                </div>
                <div>
                  <h3 className="font-semibold">Lịch Phỏng vấn</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {pvHomNay > 0 ? (
                      <span className="text-cyan-600 font-medium">{pvHomNay} buổi đang chờ kết quả</span>
                    ) : "Xem lịch và ghi nhận kết quả PV"}
                  </p>
                </div>
              </div>
            </Card>
          </Link>
          <Link href="/hr/offers">
            <Card className="p-5 hover:shadow-lg transition-shadow cursor-pointer group">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900 group-hover:bg-green-200 transition-colors">
                  <UserCheck className="h-5 w-5 text-green-600 dark:text-green-300" />
                </div>
                <div>
                  <h3 className="font-semibold">Offer & Nhận việc</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">Gửi offer và kiểm soát hồ sơ trước nhận việc</p>
                </div>
              </div>
            </Card>
          </Link>
          <Link href="/hr/contracts">
            <Card className="p-5 hover:shadow-lg transition-shadow cursor-pointer group">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-rose-100 dark:bg-rose-900 group-hover:bg-rose-200 transition-colors">
                  <FileText className="h-5 w-5 text-rose-600 dark:text-rose-300" />
                </div>
                <div>
                  <h3 className="font-semibold">Hợp đồng Thử việc</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    <span className="text-rose-600 font-medium">{hdDangThuViec} đang thử việc</span>
                    {" · "}checklist onboarding
                  </p>
                </div>
              </div>
            </Card>
          </Link>
          <Link href="/hr/reports">
            <Card className="p-5 hover:shadow-lg transition-shadow cursor-pointer group">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-indigo-100 dark:bg-indigo-900 group-hover:bg-indigo-200 transition-colors">
                  <TrendingUp className="h-5 w-5 text-indigo-600 dark:text-indigo-300" />
                </div>
                <div>
                  <h3 className="font-semibold">Báo cáo Tuyển dụng</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">Funnel, SLA theo phòng ban, nguồn ứng viên</p>
                </div>
              </div>
            </Card>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
