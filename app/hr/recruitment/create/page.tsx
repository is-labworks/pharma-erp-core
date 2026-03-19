"use client";
import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, Plus, Trash2, Send, Save } from "lucide-react";
import { keHoachNhanLuc, dm_phongBan, dm_viTriCongViec, tieuChiTuyenDung } from "@/lib/hr-mock-data";

export default function CreateRecruitmentPage() {
  const [selectedPhong, setSelectedPhong] = useState("");
  const [selectedViTri, setSelectedViTri] = useState("");
  const [tieuChi, setTieuChi] = useState<{ loai: "bat_buoc" | "uu_tien"; noiDung: string; trongSo: number }[]>([]);
  const [saved, setSaved] = useState(false);

  const phongSelected = dm_phongBan.find((p) => p.maPhongBan === selectedPhong);
  const viTriTheoPhong = dm_viTriCongViec.filter((v) => v.maPhongBan === selectedPhong);
  const viTriSelected = dm_viTriCongViec.find((v) => v.maViTri === selectedViTri);
  const keHoachDuyet = keHoachNhanLuc.filter((k) => k.trangThai === "da_duyet" && k.maPhongBan === selectedPhong);

  const requiresGMP = phongSelected?.khoiChucNang === "san_xuat_gmp" || phongSelected?.khoiChucNang === "qa_qc";
  const requiresGSP = phongSelected?.khoiChucNang === "kho_gsp";

  const addTieuChi = () => {
    setTieuChi([...tieuChi, { loai: "bat_buoc", noiDung: "", trongSo: 5 }]);
  };

  const addDefaultCriteria = () => {
    if (requiresGMP) {
      setTieuChi([
        { loai: "bat_buoc", noiDung: "Có kiến thức GMP theo tiêu chuẩn ASEAN/WHO", trongSo: 10 },
        { loai: "bat_buoc", noiDung: "Am hiểu GLP và tiêu chuẩn phòng kiểm nghiệm", trongSo: 9 },
        { loai: "uu_tien", noiDung: "Có chứng chỉ GMP được cơ quan có thẩm quyền cấp", trongSo: 7 },
      ]);
    } else if (requiresGSP) {
      setTieuChi([
        { loai: "bat_buoc", noiDung: "Am hiểu GSP – Good Storage Practice", trongSo: 10 },
        { loai: "bat_buoc", noiDung: "Am hiểu GDP – Good Distribution Practice", trongSo: 10 },
        { loai: "bat_buoc", noiDung: "Nắm vững nguyên tắc FEFO trong xuất kho dược phẩm", trongSo: 9 },
        { loai: "uu_tien", noiDung: "Kinh nghiệm quản lý kho lạnh dược (2-8°C)", trongSo: 7 },
      ]);
    }
  };

  return (
    <DashboardLayout
      role="hr_manager"
      breadcrumbs={[
        { label: "Quản lý Nhân sự", href: "/hr" },
        { label: "Yêu cầu Tuyển dụng", href: "/hr/recruitment" },
        { label: "Tạo yêu cầu" },
      ]}
    >
      <div className="space-y-6 max-w-5xl">
        <PageHeader
          title="Tạo Yêu cầu Tuyển dụng"
          description="Lập phiếu tuyển dụng với JD, tiêu chí bắt buộc và quy trình phê duyệt đa cấp"
        />

        {/* Thông tin cơ bản */}
        <Card className="p-6 space-y-5">
          <h3 className="font-semibold">Thông tin Cơ bản</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Phòng ban <span className="text-red-500">*</span></Label>
              <Select onValueChange={(v) => { setSelectedPhong(v); setSelectedViTri(""); setTieuChi([]); }}>
                <SelectTrigger><SelectValue placeholder="Chọn phòng ban" /></SelectTrigger>
                <SelectContent>
                  {dm_phongBan.map((pb) => (
                    <SelectItem key={pb.maPhongBan} value={pb.maPhongBan}>{pb.tenPhongBan}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Vị trí <span className="text-red-500">*</span></Label>
              <Select value={selectedViTri} onValueChange={setSelectedViTri} disabled={!selectedPhong}>
                <SelectTrigger><SelectValue placeholder="Chọn vị trí" /></SelectTrigger>
                <SelectContent>
                  {viTriTheoPhong.map((vt) => (
                    <SelectItem key={vt.maViTri} value={vt.maViTri}>{vt.tenViTri}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Kế hoạch nhân lực (đã duyệt)</Label>
              <Select disabled={!selectedPhong}>
                <SelectTrigger><SelectValue placeholder={selectedPhong ? (keHoachDuyet.length > 0 ? "Chọn kế hoạch" : "Không có kế hoạch đã duyệt") : "Chọn phòng ban trước"} /></SelectTrigger>
                <SelectContent>
                  {keHoachDuyet.map((k) => (
                    <SelectItem key={k.maKeHoach} value={k.maKeHoach}>
                      {k.maKeHoach} – {k.tenViTri} (T{k.thang}/{k.nam})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Số lượng cần tuyển <span className="text-red-500">*</span></Label>
              <Input type="number" min={1} defaultValue={1} />
            </div>
            <div className="space-y-2">
              <Label>Mức lương tối thiểu (VNĐ)</Label>
              <Input type="number" placeholder="VD: 9000000" />
            </div>
            <div className="space-y-2">
              <Label>Mức lương tối đa (VNĐ)</Label>
              <Input type="number" placeholder="VD: 13000000" />
            </div>
            <div className="space-y-2 col-span-2">
              <Label>Ngày cần nhận sự <span className="text-red-500">*</span></Label>
              <Input type="date" className="w-48" />
            </div>
          </div>
        </Card>

        {/* Compliance Alert */}
        {selectedPhong && (requiresGMP || requiresGSP) && (
          <div className={`flex items-start gap-3 p-4 rounded-lg border ${requiresGMP ? "border-purple-200 bg-purple-50" : "border-orange-200 bg-orange-50"}`}>
            <AlertCircle className={`h-5 w-5 mt-0.5 shrink-0 ${requiresGMP ? "text-purple-600" : "text-orange-600"}`} />
            <div className="flex-1">
              <p className={`font-semibold text-sm ${requiresGMP ? "text-purple-800" : "text-orange-800"}`}>
                {requiresGMP
                  ? "Vị trí GMP/QC: Bắt buộc khai báo tiêu chí GMP, GLP và thiết bị lab"
                  : "Vị trí Kho GSP/GDP: Bắt buộc khai báo tiêu chí GSP, GDP, FEFO"}
              </p>
              <p className={`text-xs mt-1 ${requiresGMP ? "text-purple-700" : "text-orange-700"}`}>
                Vui lòng thêm tiêu chí bắt buộc để đảm bảo tuân thủ quy định ngành dược phẩm.
              </p>
              {tieuChi.length === 0 && (
                <Button
                  size="sm"
                  variant="outline"
                  className={`mt-2 ${requiresGMP ? "border-purple-400 text-purple-700" : "border-orange-400 text-orange-700"}`}
                  onClick={addDefaultCriteria}
                >
                  Tự động thêm tiêu chí bắt buộc
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Mô tả công việc */}
        <Card className="p-6 space-y-4">
          <h3 className="font-semibold">Mô tả Công việc (JD)</h3>
          {viTriSelected && (
            <div className="p-3 rounded-md bg-muted/40 border text-sm space-y-1">
              <p className="text-muted-foreground">Gợi ý từ danh mục vị trí:</p>
              <p>Yêu cầu bằng cấp: <strong>{viTriSelected.yeuCauBangCap}</strong> · Kinh nghiệm: <strong>{viTriSelected.yeuCauKinhNghiem}+ năm</strong></p>
              {viTriSelected.tieuChiDacThu.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {viTriSelected.tieuChiDacThu.map((t) => (
                    <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
                  ))}
                </div>
              )}
            </div>
          )}
          <Textarea
            placeholder="Mô tả chi tiết công việc, trách nhiệm, yêu cầu kỹ năng..."
            rows={5}
          />
        </Card>

        {/* Tiêu chí tuyển dụng */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Tiêu chí Tuyển dụng</h3>
            <Button size="sm" variant="outline" onClick={addTieuChi} className="gap-1">
              <Plus className="h-3.5 w-3.5" />
              Thêm tiêu chí
            </Button>
          </div>

          {tieuChi.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              Chưa có tiêu chí nào. Nhấn "Thêm tiêu chí" để bắt đầu.
            </p>
          )}

          <div className="space-y-3">
            {tieuChi.map((tc, idx) => (
              <div key={idx} className="flex gap-3 items-start p-3 border rounded-lg bg-muted/20">
                <Select
                  value={tc.loai}
                  onValueChange={(v) => {
                    const updated = [...tieuChi];
                    updated[idx].loai = v as "bat_buoc" | "uu_tien";
                    setTieuChi(updated);
                  }}
                >
                  <SelectTrigger className="w-36 h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bat_buoc">🔴 Bắt buộc</SelectItem>
                    <SelectItem value="uu_tien">🟡 Ưu tiên</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  value={tc.noiDung}
                  onChange={(e) => {
                    const updated = [...tieuChi];
                    updated[idx].noiDung = e.target.value;
                    setTieuChi(updated);
                  }}
                  placeholder="Nội dung tiêu chí..."
                  className="flex-1 h-9 text-sm"
                />
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-muted-foreground whitespace-nowrap">Trọng số:</span>
                  <Input
                    type="number" min={1} max={10}
                    value={tc.trongSo}
                    onChange={(e) => {
                      const updated = [...tieuChi];
                      updated[idx].trongSo = parseInt(e.target.value) || 1;
                      setTieuChi(updated);
                    }}
                    className="w-16 h-9 text-sm"
                  />
                </div>
                <Button
                  size="icon" variant="ghost"
                  className="h-9 w-9 text-red-500 hover:text-red-600 shrink-0"
                  onClick={() => setTieuChi(tieuChi.filter((_, i) => i !== idx))}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          {tieuChi.some((t) => t.loai === "bat_buoc") && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <span>{tieuChi.filter((t) => t.loai === "bat_buoc").length} tiêu chí bắt buộc</span>
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400 ml-2" />
              <span>{tieuChi.filter((t) => t.loai === "uu_tien").length} tiêu chí ưu tiên</span>
            </div>
          )}
        </Card>

        {/* Workflow phê duyệt */}
        <Card className="p-6 space-y-3">
          <h3 className="font-semibold">Quy trình Phê duyệt</h3>
          <div className="flex items-center gap-2 text-sm">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-blue-50 border border-blue-200 text-blue-700">
              <div className="w-5 h-5 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">1</div>
              Trưởng bộ phận
            </div>
            <div className="text-muted-foreground">→</div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-purple-50 border border-purple-200 text-purple-700">
              <div className="w-5 h-5 rounded-full bg-purple-600 text-white text-xs flex items-center justify-center font-bold">2</div>
              HR Manager
            </div>
            <div className="text-muted-foreground">→</div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-green-50 border border-green-200 text-green-700">
              <div className="w-5 h-5 rounded-full bg-green-600 text-white text-xs flex items-center justify-center font-bold">3</div>
              Ban Giám đốc
            </div>
          </div>
        </Card>

        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Save className="h-4 w-4" />
            Lưu nháp
          </Button>
          <Button className="gap-2">
            <Send className="h-4 w-4" />
            Gửi phê duyệt
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
