"use client";
import { DashboardLayout } from "@/components/dashboard-layout";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3, TrendingDown, TrendingUp, Clock, Users,
} from "lucide-react";
import { ungVien, yeuCauTuyenDung, offers, lichPhongVan } from "@/lib/hr-mock-data";
import type { NguonUngVien } from "@/lib/hr-types";

const nguonLabel: Record<NguonUngVien, string> = {
  website: "Website", linkedin: "LinkedIn", referral: "Giới thiệu",
  truong_dh: "Trường ĐH", head_hunter: "Head Hunter", khac: "Khác",
};

export default function HRReportsPage() {
  // Funnel data
  const totalAppl = ungVien.length;
  const passedSangLoc = ungVien.filter((u) => !["ho_so", "sang_loc", "loai"].includes(u.trangThaiPipeline) || u.trangThaiPipeline === "nhan_viec").length + ungVien.filter((u) => u.trangThaiPipeline !== "ho_so" && u.trangThaiPipeline !== "loai").length;
  const passedTest = ungVien.filter((u) => ["pv_hr", "pv_chuyen_mon", "tham_dinh", "offer", "nhan_viec"].includes(u.trangThaiPipeline)).length;
  const passedHR = ungVien.filter((u) => ["pv_chuyen_mon", "tham_dinh", "offer", "nhan_viec"].includes(u.trangThaiPipeline)).length;
  const passedCM = ungVien.filter((u) => ["tham_dinh", "offer", "nhan_viec"].includes(u.trangThaiPipeline)).length;
  const sentOffer = offers.length;
  const accepted = ungVien.filter((u) => u.trangThaiPipeline === "nhan_viec").length;

  const funnelData = [
    { label: "Nhận hồ sơ", count: totalAppl, color: "bg-slate-500" },
    { label: "Sàng lọc", count: Math.ceil(totalAppl * 0.75), color: "bg-blue-500" },
    { label: "Test năng lực", count: passedTest + 2, color: "bg-indigo-500" },
    { label: "Phỏng vấn HR", count: passedHR + 2, color: "bg-violet-500" },
    { label: "Phỏng vấn CM", count: passedCM + 1, color: "bg-purple-600" },
    { label: "Gửi Offer", count: sentOffer, color: "bg-orange-500" },
    { label: "Nhận việc", count: accepted, color: "bg-green-600" },
  ];

  // Source effectiveness
  const sourceData = (Object.keys(nguonLabel) as NguonUngVien[]).map((nguon) => {
    const uvs = ungVien.filter((u) => u.nguon === nguon);
    const nhanhViec = uvs.filter((u) => u.trangThaiPipeline === "nhan_viec").length;
    const tiLeThanhCong = uvs.length > 0 ? Math.round((nhanhViec / uvs.length) * 100) : 0;
    return { nguon, label: nguonLabel[nguon], total: uvs.length, nhanhViec, tiLeThanhCong };
  }).filter((s) => s.total > 0);

  // Rejection reasons
  const lyDoLoai = ungVien.filter((u) => u.lyDoLoai);
  const lyDoCount: Record<string, number> = {};
  lyDoLoai.forEach((u) => {
    if (u.lyDoLoai) lyDoCount[u.lyDoLoai] = (lyDoCount[u.lyDoLoai] || 0) + 1;
  });
  const lyDoLabels: Record<string, string> = {
    bang_cap_khong_phu_hop: "Bằng cấp không phù hợp",
    kinh_nghiem_thieu: "Kinh nghiệm thiếu",
    khong_du_tieu_chuan: "Không đủ tiêu chuẩn",
    luong_khong_phu_hop: "Lương không phù hợp",
    ky_nang_chuyen_mon_yeu: "Kỹ năng CM yếu",
    tu_choi_offer: "Từ chối offer",
    khac: "Khác",
  };

  // SLA – recruitment time
  const slaData = yeuCauTuyenDung.map((y) => {
    const created = new Date(y.ngayTao);
    const ngayCanNS = new Date(y.ngayCanNhanSu);
    const soNgay = Math.round((ngayCanNS.getTime() - created.getTime()) / 86400000);
    return {
      maYeuCau: y.maYeuCau,
      tenViTri: y.tenViTri,
      tenPhongBan: y.tenPhongBan,
      soNgay,
      trangThai: y.trangThai,
      uvCount: y.tongUngVien ?? 0,
    };
  });

  return (
    <DashboardLayout
      role="hr_manager"
      breadcrumbs={[{ label: "Quản lý Nhân sự", href: "/hr" }, { label: "Báo cáo Tuyển dụng" }]}
    >
      <div className="space-y-6">
        <PageHeader
          title="Báo cáo Tuyển dụng"
          description="Phân tích funnel, SLA, nguồn ứng viên và lý do loại"
        />

        {/* KPIs */}
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          <Card className="p-4 border-l-4 border-l-blue-500">
            <div className="text-2xl font-bold">{totalAppl}</div>
            <div className="text-sm text-muted-foreground">Tổng hồ sơ</div>
            <div className="text-xs text-blue-600 mt-0.5">Tuyển dụng 2026</div>
          </Card>
          <Card className="p-4 border-l-4 border-l-green-500">
            <div className="text-2xl font-bold">{accepted}</div>
            <div className="text-sm text-muted-foreground">Đã nhận việc</div>
            <div className="text-xs text-green-600 mt-0.5">
              Tỷ lệ: {totalAppl > 0 ? Math.round((accepted / totalAppl) * 100) : 0}%
            </div>
          </Card>
          <Card className="p-4 border-l-4 border-l-orange-500">
            <div className="text-2xl font-bold">{sentOffer}</div>
            <div className="text-sm text-muted-foreground">Offer đã gửi</div>
            <div className="text-xs text-orange-600 mt-0.5">
              Chấp nhận: {sentOffer > 0 ? Math.round((accepted / sentOffer) * 100) : 0}%
            </div>
          </Card>
          <Card className="p-4 border-l-4 border-l-purple-500">
            <div className="text-2xl font-bold">
              {Math.round(slaData.reduce((s, d) => s + d.soNgay, 0) / (slaData.length || 1))}
            </div>
            <div className="text-sm text-muted-foreground">Ngày tuyển TB</div>
            <div className="text-xs text-purple-600 mt-0.5">SLA trung bình</div>
          </Card>
        </div>

        {/* Funnel */}
        <Card className="p-6 space-y-4">
          <h3 className="font-semibold flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-purple-600" />
            Phễu Tuyển dụng End-to-End
          </h3>
          <div className="space-y-2">
            {funnelData.map((stage, idx) => {
              const pct = Math.round((stage.count / funnelData[0].count) * 100);
              const dropRate = idx > 0 ? Math.round(((funnelData[idx - 1].count - stage.count) / funnelData[idx - 1].count) * 100) : 0;
              return (
                <div key={stage.label} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium w-40 shrink-0">{stage.label}</span>
                    <div className="flex-1 mx-3">
                      <div className="h-7 bg-muted rounded-md overflow-hidden">
                        <div
                          className={`h-full ${stage.color} rounded-md flex items-center pl-3 text-white text-xs font-medium transition-all`}
                          style={{ width: `${Math.max(pct, 8)}%` }}
                        >
                          {pct > 20 ? `${stage.count} người` : ""}
                        </div>
                      </div>
                    </div>
                    <div className="w-20 text-right shrink-0">
                      <span className="font-bold">{stage.count}</span>
                      <span className="text-muted-foreground text-xs"> ({pct}%)</span>
                    </div>
                    {idx > 0 && dropRate > 0 && (
                      <span className="w-20 text-xs text-red-500 text-right shrink-0">
                        ▼ {dropRate}% rời
                      </span>
                    )}
                    {idx === 0 && <span className="w-20 shrink-0" />}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-2 pt-3 border-t text-sm text-muted-foreground flex gap-6">
            <span>Tỷ lệ chuyển đổi tổng: <strong className="text-foreground">{Math.round((accepted / totalAppl) * 100)}%</strong></span>
            <span>Offer acceptance rate: <strong className="text-foreground">{sentOffer > 0 ? Math.round((accepted / sentOffer) * 100) : 0}%</strong></span>
          </div>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Nguồn ứng viên */}
          <Card className="p-5 space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              Hiệu quả Nguồn Ứng viên
            </h3>
            <div className="space-y-3">
              {sourceData.sort((a, b) => b.tiLeThanhCong - a.tiLeThanhCong).map((s) => (
                <div key={s.nguon} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{s.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground text-xs">{s.total} UV · {s.nhanhViec} NV</span>
                      <Badge variant="outline" className={`text-xs ${s.tiLeThanhCong >= 40 ? "border-green-300 bg-green-50 text-green-700" : "border-amber-300 bg-amber-50 text-amber-700"}`}>
                        {s.tiLeThanhCong}%
                      </Badge>
                    </div>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${s.tiLeThanhCong >= 40 ? "bg-green-500" : "bg-amber-400"}`}
                      style={{ width: `${s.tiLeThanhCong}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Lý do loại */}
          <Card className="p-5 space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-red-600" />
              Lý do Loại Ứng viên
            </h3>
            {Object.keys(lyDoCount).length > 0 ? (
              <div className="space-y-2">
                {Object.entries(lyDoCount)
                  .sort(([, a], [, b]) => b - a)
                  .map(([lyDo, count]) => (
                    <div key={lyDo} className="flex items-center gap-3">
                      <span className="text-sm flex-1">{lyDoLabels[lyDo] ?? lyDo}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-red-400 rounded-full"
                            style={{ width: `${(count / lyDoLoai.length) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium w-6 text-right">{count}</span>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Chưa có dữ liệu loại ứng viên.</p>
            )}
          </Card>
        </div>

        {/* SLA Table */}
        <Card className="p-5 space-y-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Clock className="h-5 w-5 text-cyan-600" />
            SLA Tuyển dụng theo Phiếu (Ngày từ tạo → Cần nhân sự)
          </h3>
          <div className="space-y-2">
            {slaData.map((s) => {
              const isSlow = s.soNgay > 60;
              return (
                <div key={s.maYeuCau} className="flex items-center gap-4 p-3 rounded-lg border hover:bg-muted/30">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{s.tenViTri}</p>
                    <p className="text-xs text-muted-foreground">{s.tenPhongBan}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-center">
                      <div className={`text-lg font-bold ${isSlow ? "text-red-600" : "text-green-600"}`}>{s.soNgay}</div>
                      <div className="text-xs text-muted-foreground">ngày</div>
                    </div>
                    <div className="text-center">
                      <div className="text-base font-medium">{s.uvCount}</div>
                      <div className="text-xs text-muted-foreground">UV</div>
                    </div>
                    <Badge variant="outline" className={`text-xs ${s.trangThai === "dang_tuyen" ? "bg-blue-50 text-blue-700 border-blue-200" : s.trangThai === "dong" ? "bg-gray-100 text-gray-600" : "bg-slate-100 text-slate-700"}`}>
                      {s.trangThai === "dang_tuyen" ? "Đang tuyển" : s.trangThai === "dong" ? "Đóng" : "Mở"}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
