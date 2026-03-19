"use client";
import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Search, Mail, Phone, User, GraduationCap, Briefcase, AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { ungVien, yeuCauTuyenDung } from "@/lib/hr-mock-data";
import type { PipelineStage } from "@/lib/hr-types";

const pipelineStages: { key: PipelineStage; label: string; color: string; bgColor: string }[] = [
  { key: "ho_so", label: "Nhận hồ sơ", color: "text-slate-700", bgColor: "bg-slate-50 border-slate-200" },
  { key: "sang_loc", label: "Sàng lọc", color: "text-blue-700", bgColor: "bg-blue-50 border-blue-200" },
  { key: "test", label: "Test", color: "text-indigo-700", bgColor: "bg-indigo-50 border-indigo-200" },
  { key: "pv_hr", label: "PV HR", color: "text-violet-700", bgColor: "bg-violet-50 border-violet-200" },
  { key: "pv_chuyen_mon", label: "PV Chuyên môn", color: "text-purple-700", bgColor: "bg-purple-50 border-purple-200" },
  { key: "tham_dinh", label: "Thẩm định", color: "text-fuchsia-700", bgColor: "bg-fuchsia-50 border-fuchsia-200" },
  { key: "offer", label: "Offer", color: "text-orange-700", bgColor: "bg-orange-50 border-orange-200" },
  { key: "nhan_viec", label: "Nhận việc", color: "text-green-700", bgColor: "bg-green-50 border-green-200" },
];

const nguonLabel: Record<string, string> = {
  website: "Website", linkedin: "LinkedIn", referral: "Giới thiệu",
  truong_dh: "Trường ĐH", head_hunter: "Head Hunter", khac: "Khác",
};

export default function CandidatesPage() {
  const [filterYC, setFilterYC] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = ungVien.filter((u) => {
    if (u.trangThaiPipeline === "loai") return false;
    if (filterYC !== "all" && u.maYeuCau !== filterYC) return false;
    if (search && !u.hoTen.toLowerCase().includes(search.toLowerCase()) &&
        !u.email.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const loai = ungVien.filter((u) => u.trangThaiPipeline === "loai");

  const getCandidatesForStage = (stage: PipelineStage) =>
    filtered.filter((u) => u.trangThaiPipeline === stage);

  return (
    <DashboardLayout
      role="hr_manager"
      breadcrumbs={[{ label: "Quản lý Nhân sự", href: "/hr" }, { label: "Pipeline Ứng viên" }]}
    >
      <div className="space-y-6">
        <PageHeader
          title="Pipeline Ứng viên"
          description={`${ungVien.filter((u) => u.trangThaiPipeline !== 'loai').length} ứng viên đang trong quy trình · ${loai.length} đã loại`}
        />

        {/* Filters */}
        <Card className="p-4">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-8 w-56"
                placeholder="Tìm ứng viên..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={filterYC} onValueChange={setFilterYC}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Yêu cầu tuyển dụng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả yêu cầu</SelectItem>
                {yeuCauTuyenDung.map((y) => (
                  <SelectItem key={y.maYeuCau} value={y.maYeuCau}>
                    {y.maYeuCau} – {y.tenViTri}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="text-sm text-muted-foreground ml-auto">
              Hiển thị <strong>{filtered.length}</strong> ứng viên
            </div>
          </div>
        </Card>

        {/* Kanban Pipeline */}
        <div className="overflow-x-auto">
          <div className="flex gap-4 min-w-max pb-4">
            {pipelineStages.map((stage) => {
              const candidates = getCandidatesForStage(stage.key);
              return (
                <div key={stage.key} className="w-[220px] shrink-0">
                  <div className={`rounded-t-lg border p-3 ${stage.bgColor}`}>
                    <div className={`text-sm font-semibold ${stage.color}`}>{stage.label}</div>
                    <div className={`text-xl font-bold ${stage.color}`}>{candidates.length}</div>
                  </div>
                  <div className={`rounded-b-lg border border-t-0 ${stage.bgColor} min-h-[200px] p-2 space-y-2`}>
                    {candidates.map((uv) => {
                      const hasDocsIssue = Object.values(uv.hoSoHopLe).some((v) => !v);
                      return (
                        <Link href={`/hr/candidates/${uv.maUngVien}`} key={uv.maUngVien}>
                          <Card className="p-3 cursor-pointer hover:shadow-md transition-shadow bg-white dark:bg-card">
                            <div className="flex items-start justify-between gap-1">
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold truncate">{uv.hoTen}</p>
                                <p className="text-xs text-muted-foreground truncate mt-0.5">{uv.tenViTri}</p>
                              </div>
                              {hasDocsIssue && stage.key !== "ho_so" && stage.key !== "sang_loc" && (
                                <AlertCircle className="h-3.5 w-3.5 text-orange-500 shrink-0" aria-label="Thiếu hồ sơ" />
                              )}
                            </div>
                            <div className="mt-2 flex flex-wrap gap-1.5 text-xs text-muted-foreground">
                              <span className="flex items-center gap-0.5 truncate">
                                <GraduationCap className="h-3 w-3" />{uv.trinhDo}
                              </span>
                              <span className="flex items-center gap-0.5">
                                <Briefcase className="h-3 w-3" />{uv.namKinhNghiem}năm
                              </span>
                            </div>
                            <div className="mt-1.5">
                              <Badge variant="outline" className="text-[10px] py-0 h-4">
                                {nguonLabel[uv.nguon]}
                              </Badge>
                            </div>
                          </Card>
                        </Link>
                      );
                    })}
                    {candidates.length === 0 && (
                      <div className="h-20 flex items-center justify-center">
                        <p className="text-xs text-muted-foreground">Không có ứng viên</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Loại */}
        {loai.length > 0 && (
          <Card className="p-4">
            <h3 className="font-medium text-sm text-muted-foreground mb-3 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-500" />
              Ứng viên đã loại ({loai.length})
            </h3>
            <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
              {loai.map((uv) => (
                <div key={uv.maUngVien} className="flex items-center gap-2 p-2 rounded border bg-red-50/50 text-sm">
                  <User className="h-4 w-4 text-red-400 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{uv.hoTen}</p>
                    <p className="text-xs text-muted-foreground truncate">{uv.tenViTri}</p>
                  </div>
                  {uv.lyDoLoai && (
                    <Badge variant="outline" className="text-[10px] bg-red-50 text-red-600 border-red-200 shrink-0">
                      {uv.lyDoLoai === "bang_cap_khong_phu_hop" ? "Bằng cấp" :
                       uv.lyDoLoai === "kinh_nghiem_thieu" ? "Kinh nghiệm" :
                       uv.lyDoLoai === "khong_du_tieu_chuan" ? "Không đủ TC" : uv.lyDoLoai}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
