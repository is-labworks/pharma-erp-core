"use client";
import React from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Users, CalendarDays, MapPin, CheckCircle2, XCircle, Clock,
  Star, AlertCircle, FileText, GraduationCap, Briefcase,
} from "lucide-react";
import { ungVien, lichPhongVan, phieuDanhGia, tieuChiTuyenDung, yeuCauTuyenDung } from "@/lib/hr-mock-data";

const stageLabels: Record<string, string> = {
  ho_so: "Nhận hồ sơ", sang_loc: "Sàng lọc", test: "Test năng lực",
  pv_hr: "Phỏng vấn HR", pv_chuyen_mon: "Phỏng vấn CM", tham_dinh: "Thẩm định",
  offer: "Đang offer", nhan_viec: "Đã nhận việc", loai: "Đã loại",
};

export default function CandidateDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const uv = ungVien.find((u) => u.maUngVien === id) ?? ungVien[0];
  const lichPV = lichPhongVan.filter((l) => l.maUngVien === uv.maUngVien);
  const phieu = phieuDanhGia.find((p) => p.maUngVien === uv.maUngVien);
  const yeuCau = yeuCauTuyenDung.find((y) => y.maYeuCau === uv.maYeuCau);
  const tieuChi = tieuChiTuyenDung.filter((t) => t.maYeuCau === uv.maYeuCau);

  const missingDocs = Object.entries(uv.hoSoHopLe)
    .filter(([, v]) => !v)
    .map(([k]) => ({ cccd: "CCCD/CMND", bangCap: "Bằng cấp", khamSucKhoe: "Khám sức khỏe", lyLich: "Lý lịch tư pháp" }[k] ?? k));

  const isBlockedOnboarding = missingDocs.length > 0 &&
    (uv.trangThaiPipeline === "offer" || uv.trangThaiPipeline === "nhan_viec");

  return (
    <DashboardLayout
      role="hr_manager"
      breadcrumbs={[
        { label: "Quản lý Nhân sự", href: "/hr" },
        { label: "Pipeline Ứng viên", href: "/hr/candidates" },
        { label: uv.hoTen },
      ]}
    >
      <div className="space-y-6 max-w-5xl">
        {/* Header card */}
        <Card className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-xl font-bold shrink-0">
                {uv.hoTen.split(" ").slice(-1)[0][0]}
              </div>
              <div>
                <h2 className="text-xl font-bold">{uv.hoTen}</h2>
                <p className="text-muted-foreground">{uv.tenViTri} · {uv.tenPhongBan}</p>
                <div className="flex gap-4 mt-1.5 text-sm text-muted-foreground">
                  <span>{uv.email}</span>
                  <span>{uv.sdt}</span>
                </div>
                <div className="flex gap-2 mt-2 flex-wrap">
                  <Badge variant="secondary" className="gap-1">
                    <GraduationCap className="h-3 w-3" />{uv.trinhDo} – {uv.chuyenNganh}
                  </Badge>
                  <Badge variant="secondary" className="gap-1">
                    <Briefcase className="h-3 w-3" />{uv.namKinhNghiem} năm kinh nghiệm
                  </Badge>
                </div>
              </div>
            </div>
            <div className="text-right shrink-0">
              <Badge className={`text-sm ${uv.trangThaiPipeline === "nhan_viec" ? "bg-green-500" : uv.trangThaiPipeline === "loai" ? "bg-red-500" : "bg-blue-500"}`}>
                {stageLabels[uv.trangThaiPipeline]}
              </Badge>
              <p className="text-xs text-muted-foreground mt-2">
                Nguồn: {uv.nguon === "referral" ? "Giới thiệu" : uv.nguon === "website" ? "Website" : uv.nguon === "truong_dh" ? "Trường ĐH" : uv.nguon}
              </p>
              <p className="text-xs text-muted-foreground">
                Nộp: {new Date(uv.ngayNop).toLocaleDateString("vi-VN")}
              </p>
            </div>
          </div>
        </Card>

        {/* Compliance Block */}
        {isBlockedOnboarding && (
          <Card className="p-4 border-red-300 bg-red-50 dark:bg-red-950">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-800 dark:text-red-200">
                  🚫 Bị chặn – Thiếu hồ sơ bắt buộc
                </p>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                  Ứng viên không thể nhận việc khi thiếu: <strong>{missingDocs.join(", ")}</strong>
                </p>
                <p className="text-xs text-red-600 mt-1">
                  Theo quy định kiểm soát nội bộ và chuẩn GMP của công ty dược phẩm.
                </p>
              </div>
            </div>
          </Card>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          {/* Trạng thái hồ sơ */}
          <Card className="p-5 space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-600" />
              Kiểm tra Hồ sơ Pháp lý
            </h3>
            {[
              { key: "cccd", label: "CCCD / CMND" },
              { key: "bangCap", label: "Bằng cấp / Chứng chỉ" },
              { key: "khamSucKhoe", label: "Giấy khám sức khỏe" },
              { key: "lyLich", label: "Lý lịch tư pháp" },
            ].map(({ key, label }) => {
              const ok = uv.hoSoHopLe[key as keyof typeof uv.hoSoHopLe];
              return (
                <div key={key} className="flex items-center justify-between py-1.5 border-b last:border-0">
                  <span className="text-sm">{label}</span>
                  {ok ? (
                    <Badge variant="outline" className="gap-1 text-green-700 border-green-300 bg-green-50">
                      <CheckCircle2 className="h-3 w-3" />Đã có
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="gap-1 text-red-700 border-red-300 bg-red-50">
                      <XCircle className="h-3 w-3" />Thiếu
                    </Badge>
                  )}
                </div>
              );
            })}
          </Card>

          {/* Pipeline History */}
          <Card className="p-5 space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Users className="h-4 w-4 text-purple-600" />
              Lịch sử Pipeline
            </h3>
            {["ho_so", "sang_loc", "test", "pv_hr", "pv_chuyen_mon", "tham_dinh", "offer", "nhan_viec"].map((stage) => {
              const stages = ["ho_so", "sang_loc", "test", "pv_hr", "pv_chuyen_mon", "tham_dinh", "offer", "nhan_viec"];
              const currentIdx = stages.indexOf(uv.trangThaiPipeline);
              const stageIdx = stages.indexOf(stage);
              const isPast = stageIdx < currentIdx;
              const isCurrent = stage === uv.trangThaiPipeline;
              return (
                <div key={stage} className={`flex items-center gap-2 text-sm ${isCurrent ? "font-semibold text-primary" : isPast ? "text-muted-foreground" : "text-muted-foreground/40"}`}>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${isCurrent ? "bg-primary text-primary-foreground" : isPast ? "bg-green-500 text-white" : "bg-muted"}`}>
                    {isPast ? <CheckCircle2 className="h-3 w-3" /> : <span className="text-[10px]">{stageIdx + 1}</span>}
                  </div>
                  {stageLabels[stage]}
                  {isCurrent && <span className="text-xs font-normal text-primary">← Hiện tại</span>}
                </div>
              );
            })}
          </Card>
        </div>

        {/* Lịch phỏng vấn */}
        {lichPV.length > 0 && (
          <Card className="p-5 space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-cyan-600" />
              Lịch Phỏng vấn
            </h3>
            {lichPV.map((lp) => (
              <div key={lp.maLich} className="p-3 border rounded-lg space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{lp.vongPV}</span>
                  {lp.ketQua === "dat" ? (
                    <Badge className="bg-green-500 gap-1"><CheckCircle2 className="h-3 w-3" />Đạt {lp.diemDanh && `· ${lp.diemDanh}/100`}</Badge>
                  ) : lp.ketQua === "khong_dat" ? (
                    <Badge variant="destructive" className="gap-1"><XCircle className="h-3 w-3" />Không đạt</Badge>
                  ) : (
                    <Badge variant="outline" className="gap-1 text-amber-600"><Clock className="h-3 w-3" />Chờ kết quả</Badge>
                  )}
                </div>
                <div className="flex gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><CalendarDays className="h-3 w-3" />{new Date(lp.thoiGian).toLocaleString("vi-VN")}</span>
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{lp.diaDiem}</span>
                </div>
                {lp.nhanXet && <p className="text-xs text-muted-foreground italic border-l-2 border-muted pl-2">"{lp.nhanXet}"</p>}
                <p className="text-xs text-muted-foreground">NĐPV: {lp.tenNguoiPV.join(", ")}</p>
              </div>
            ))}
          </Card>
        )}

        {/* Phiếu đánh giá */}
        {phieu && (
          <Card className="p-5 space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Star className="h-4 w-4 text-amber-500" />
              Phiếu Đánh giá Tổng hợp
            </h3>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className={`text-4xl font-black ${phieu.tongDiem >= 70 ? "text-green-600" : "text-red-600"}`}>{phieu.tongDiem}</div>
                <div className="text-xs text-muted-foreground">/ 100 điểm</div>
              </div>
              <div>
                <Badge className={`text-sm ${phieu.ketLuan === "dat" ? "bg-green-500" : "bg-red-500"}`}>
                  {phieu.ketLuan === "dat" ? "✓ ĐẠT YÊU CẦU" : "✗ KHÔNG ĐẠT"}
                </Badge>
                {phieu.deXuatLuong && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Đề xuất lương: <strong className="text-foreground">{phieu.deXuatLuong.toLocaleString("vi-VN")}đ</strong>
                  </p>
                )}
                <p className="text-xs text-muted-foreground">Người chấm: {phieu.tenNguoiCham} · {new Date(phieu.ngayCham).toLocaleDateString("vi-VN")}</p>
              </div>
            </div>
            <div className="space-y-2">
              {phieu.danhGiaTieuChi.map((dtc) => (
                <div key={dtc.maTieuChi} className="flex items-center gap-3">
                  <span className="text-sm flex-1">{dtc.noiDung}</span>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 10 }, (_, i) => (
                      <div key={i} className={`w-2 h-5 rounded-sm ${i < dtc.diem ? "bg-primary" : "bg-muted"}`} />
                    ))}
                  </div>
                  <span className="text-sm font-medium w-8 text-right">{dtc.diem}/10</span>
                </div>
              ))}
            </div>
            {/* Audit trail */}
            {phieu.lichSuSua.length > 0 && (
              <div className="mt-3 pt-3 border-t">
                <p className="text-xs font-medium text-muted-foreground mb-2">Log chỉnh sửa điểm (GMP compliance):</p>
                {phieu.lichSuSua.map((ls, i) => (
                  <div key={i} className="text-xs text-muted-foreground bg-muted/40 p-2 rounded mb-1">
                    <strong>{ls.nguoiSua}</strong> · {new Date(ls.thoiGian).toLocaleString("vi-VN")} · {ls.truocKhi} → {ls.sauKhi}
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}

        {/* Actions */}
        <div className="flex gap-3 flex-wrap">
          {uv.trangThaiPipeline === "pv_hr" && (
            <Button variant="outline">Chuyển sang PV Chuyên môn</Button>
          )}
          {uv.trangThaiPipeline === "tham_dinh" && (
            <Button>Tạo Offer</Button>
          )}
          {uv.trangThaiPipeline === "offer" && !isBlockedOnboarding && (
            <Button className="bg-green-600 hover:bg-green-700">Xác nhận Nhận việc</Button>
          )}
          {isBlockedOnboarding && (
            <Button disabled className="gap-2">
              <AlertCircle className="h-4 w-4" />
              Bị chặn – Thiếu hồ sơ
            </Button>
          )}
          <Button variant="outline" className="text-red-600">Loại ứng viên</Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
