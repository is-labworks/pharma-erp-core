"use client";
import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, CheckCircle2, Save, Send } from "lucide-react";
import { dm_phongBan, dm_viTriCongViec } from "@/lib/hr-mock-data";

export default function CreatePlanningPage() {
  const [selectedPhong, setSelectedPhong] = useState("");
  const [selectedViTri, setSelectedViTri] = useState("");
  const [dinhBien, setDinhBien] = useState(0);
  const [hienCo, setHienCo] = useState(0);
  const [duBao, setDuBao] = useState(0);
  const [saved, setSaved] = useState(false);

  const soLuongCanTuyen = Math.max(0, dinhBien - hienCo + duBao);

  const viTriTheoPhong = dm_viTriCongViec.filter((v) => v.maPhongBan === selectedPhong);
  const viTriSelected = dm_viTriCongViec.find((v) => v.maViTri === selectedViTri);
  const phongSelected = dm_phongBan.find((p) => p.maPhongBan === selectedPhong);

  const requiresGMPCriteria = phongSelected?.khoiChucNang === "san_xuat_gmp" || phongSelected?.khoiChucNang === "qa_qc";
  const requiresGSPCriteria = phongSelected?.khoiChucNang === "kho_gsp";

  const handleSave = (status: string) => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <DashboardLayout
      role="hr_manager"
      breadcrumbs={[
        { label: "Quản lý Nhân sự", href: "/hr" },
        { label: "Kế hoạch Nhân lực", href: "/hr/planning" },
        { label: "Lập kế hoạch mới" },
      ]}
    >
      <div className="space-y-6 max-w-4xl">
        <PageHeader
          title="Lập Kế hoạch Nhân lực"
          description="Tạo kế hoạch nhân lực mới để gửi BGĐ phê duyệt"
        />

        {saved && (
          <Card className="p-4 border-green-200 bg-green-50">
            <div className="flex items-center gap-2 text-green-700">
              <CheckCircle2 className="h-4 w-4" />
              <span className="text-sm font-medium">Đã lưu kế hoạch thành công!</span>
            </div>
          </Card>
        )}

        {/* Thông tin cơ bản */}
        <Card className="p-6 space-y-5">
          <h3 className="font-semibold text-base">Thông tin Kế hoạch</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Năm <span className="text-red-500">*</span></Label>
              <Select defaultValue="2026">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="2026">2026</SelectItem>
                  <SelectItem value="2027">2027</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Tháng <span className="text-red-500">*</span></Label>
              <Select>
                <SelectTrigger><SelectValue placeholder="Chọn tháng" /></SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => (
                    <SelectItem key={i + 1} value={String(i + 1)}>Tháng {i + 1}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Phòng ban <span className="text-red-500">*</span></Label>
              <Select onValueChange={(v) => { setSelectedPhong(v); setSelectedViTri(""); }}>
                <SelectTrigger><SelectValue placeholder="Chọn phòng ban" /></SelectTrigger>
                <SelectContent>
                  {dm_phongBan.map((pb) => (
                    <SelectItem key={pb.maPhongBan} value={pb.maPhongBan}>{pb.tenPhongBan}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Vị trí công việc <span className="text-red-500">*</span></Label>
              <Select value={selectedViTri} onValueChange={setSelectedViTri} disabled={!selectedPhong}>
                <SelectTrigger><SelectValue placeholder={selectedPhong ? "Chọn vị trí" : "Chọn phòng ban trước"} /></SelectTrigger>
                <SelectContent>
                  {viTriTheoPhong.map((vt) => (
                    <SelectItem key={vt.maViTri} value={vt.maViTri}>{vt.tenViTri}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Pharma compliance alert */}
          {selectedPhong && (requiresGMPCriteria || requiresGSPCriteria) && (
            <div className={`flex items-start gap-3 p-3 rounded-lg border ${requiresGMPCriteria ? "border-purple-200 bg-purple-50" : "border-orange-200 bg-orange-50"}`}>
              <AlertCircle className={`h-4 w-4 mt-0.5 shrink-0 ${requiresGMPCriteria ? "text-purple-600" : "text-orange-600"}`} />
              <div className="text-sm">
                <p className={`font-medium ${requiresGMPCriteria ? "text-purple-800" : "text-orange-800"}`}>
                  {requiresGMPCriteria
                    ? "⚠️ Vị trí GMP/QC – Yêu cầu tiêu chí chuyên môn bắt buộc"
                    : "⚠️ Vị trí Kho GSP/GDP – Bắt buộc khai báo tiêu chí GSP/GDP/FEFO"}
                </p>
                <p className={`mt-0.5 ${requiresGMPCriteria ? "text-purple-700" : "text-orange-700"}`}>
                  {requiresGMPCriteria
                    ? "Khi tạo Yêu cầu Tuyển dụng từ kế hoạch này, hệ thống sẽ yêu cầu khai báo tiêu chí GMP/GLP/thiết bị lab."
                    : "Khi tạo Yêu cầu Tuyển dụng, hệ thống sẽ yêu cầu khai báo tiêu chí GSP, GDP và nguyên tắc FEFO."}
                </p>
              </div>
            </div>
          )}

          {/* Vị trí info */}
          {viTriSelected && (
            <Card className="p-4 bg-muted/30 space-y-2">
              <h4 className="text-sm font-medium">Thông tin vị trí: {viTriSelected.tenViTri}</h4>
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div><span className="text-muted-foreground">Cấp bậc:</span> <strong>{viTriSelected.capBac}</strong></div>
                <div><span className="text-muted-foreground">Bằng cấp:</span> <strong>{viTriSelected.yeuCauBangCap}</strong></div>
                <div><span className="text-muted-foreground">Kinh nghiệm:</span> <strong>{viTriSelected.yeuCauKinhNghiem}+ năm</strong></div>
              </div>
              {viTriSelected.tieuChiDacThu.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {viTriSelected.tieuChiDacThu.map((t) => (
                    <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
                  ))}
                </div>
              )}
            </Card>
          )}
        </Card>

        {/* Định biên */}
        <Card className="p-6 space-y-5">
          <h3 className="font-semibold text-base">Thông số Định biên</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Định biên (tổng)</Label>
              <Input
                type="number" min={0}
                value={dinhBien || ""}
                onChange={(e) => setDinhBien(parseInt(e.target.value) || 0)}
                placeholder="VD: 20"
              />
            </div>
            <div className="space-y-2">
              <Label>Hiện có</Label>
              <Input
                type="number" min={0}
                value={hienCo || ""}
                onChange={(e) => setHienCo(parseInt(e.target.value) || 0)}
                placeholder="VD: 16"
              />
            </div>
            <div className="space-y-2">
              <Label>Dự báo nghỉ việc</Label>
              <Input
                type="number" min={0}
                value={duBao || ""}
                onChange={(e) => setDuBao(parseInt(e.target.value) || 0)}
                placeholder="VD: 2"
              />
            </div>
            <div className="space-y-2">
              <Label>Số lượng cần tuyển</Label>
              <div className="h-10 flex items-center px-3 rounded-md border bg-muted font-bold text-primary text-lg">
                {soLuongCanTuyen}
              </div>
              <p className="text-xs text-muted-foreground">= Định biên − Hiện có + Dự báo</p>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Lý do / Ghi chú</Label>
            <Textarea
              placeholder="Mô tả lý do mở rộng hoặc thay thế nhân sự... VD: Mở rộng dây chuyền SX theo kế hoạch Q2/2026"
              rows={3}
            />
          </div>
        </Card>

        {/* Actions */}
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2" onClick={() => handleSave("nhap")}>
            <Save className="h-4 w-4" />
            Lưu nháp
          </Button>
          <Button className="gap-2" onClick={() => handleSave("cho_duyet")}>
            <Send className="h-4 w-4" />
            Gửi duyệt BGĐ
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
