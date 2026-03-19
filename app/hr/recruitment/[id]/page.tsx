"use client";
import { DashboardLayout } from "@/components/dashboard-layout";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  CheckCircle2, XCircle, Clock, Users, FilePlus, Target,
} from "lucide-react";
import Link from "next/link";
import { yeuCauTuyenDung, tieuChiTuyenDung, ungVien } from "@/lib/hr-mock-data";

const pipelineLabels: Record<string, string> = {
  ho_so: "Nhận hồ sơ", sang_loc: "Sàng lọc", test: "Test",
  pv_hr: "PV HR", pv_chuyen_mon: "PV CM", tham_dinh: "Thẩm định",
  offer: "Offer", nhan_viec: "Nhận việc", loai: "Loại",
};

export default function RecruitmentDetailPage({ params }: { params: { id: string } }) {
  const yc = yeuCauTuyenDung.find((y) => y.maYeuCau === params.id) ?? yeuCauTuyenDung[0];
  const tc = tieuChiTuyenDung.filter((t) => t.maYeuCau === yc.maYeuCau);
  const uvList = ungVien.filter((u) => u.maYeuCau === yc.maYeuCau);

  const batBuoc = tc.filter((t) => t.loai === "bat_buoc");
  const uuTien = tc.filter((t) => t.loai === "uu_tien");

  return (
    <DashboardLayout
      role="hr_manager"
      breadcrumbs={[
        { label: "Quản lý Nhân sự", href: "/hr" },
        { label: "Yêu cầu Tuyển dụng", href: "/hr/recruitment" },
        { label: yc.maYeuCau },
      ]}
    >
      <div className="space-y-6 max-w-5xl">
        <PageHeader title={yc.tenViTri} description={`${yc.maYeuCau} · ${yc.tenPhongBan}`} />

        <div className="grid gap-6 md:grid-cols-3">
          {/* Info card */}
          <Card className="p-5 space-y-3 md:col-span-2">
            <h3 className="font-semibold flex items-center gap-2">
              <Target className="h-4 w-4 text-purple-600" />
              Thông tin Yêu cầu
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-muted-foreground">Số lượng cần:</span> <strong className="text-primary">{yc.soLuong}</strong></div>
              <div><span className="text-muted-foreground">Ngày cần NS:</span> <strong>{new Date(yc.ngayCanNhanSu).toLocaleDateString("vi-VN")}</strong></div>
              <div><span className="text-muted-foreground">Lương (Min):</span> <strong>{(yc.mucLuongMin / 1e6).toFixed(1)}tr</strong></div>
              <div><span className="text-muted-foreground">Lương (Max):</span> <strong>{(yc.mucLuongMax / 1e6).toFixed(1)}tr</strong></div>
              <div><span className="text-muted-foreground">Người tạo:</span> <strong>{yc.tenNguoiTao}</strong></div>
              <div><span className="text-muted-foreground">Ngày tạo:</span> <strong>{new Date(yc.ngayTao).toLocaleDateString("vi-VN")}</strong></div>
            </div>
            <div className="pt-2 border-t">
              <p className="text-sm font-medium mb-1.5">Mô tả Công việc (JD):</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{yc.moTaCongViec}</p>
            </div>
          </Card>

          {/* Approval flow */}
          <Card className="p-5 space-y-3">
            <h3 className="font-semibold">Tiến độ Phê duyệt</h3>
            <div className="space-y-3">
              {yc.lichSuDuyet.map((ld, i) => (
                <div key={ld.id} className="flex items-start gap-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-white text-xs font-bold ${ld.trangThai === "dong_y" ? "bg-green-500" : ld.trangThai === "tu_choi" ? "bg-red-500" : "bg-gray-300"}`}>
                    {ld.trangThai === "dong_y" ? "✓" : ld.trangThai === "tu_choi" ? "✗" : i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{ld.vaiTro}</p>
                    <p className="text-xs text-muted-foreground">{ld.tenNguoiDuyet}</p>
                    {ld.thoiGian && (
                      <p className="text-xs text-muted-foreground">{new Date(ld.thoiGian).toLocaleDateString("vi-VN")}</p>
                    )}
                    {ld.ghiChu && <p className="text-xs italic text-muted-foreground mt-0.5">"{ld.ghiChu}"</p>}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Tiêu chí */}
        {tc.length > 0 && (
          <Card className="p-5 space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              Tiêu chí Tuyển dụng
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="text-sm font-medium text-red-700 mb-2 flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  Bắt buộc ({batBuoc.length})
                </h4>
                <div className="space-y-2">
                  {batBuoc.map((t) => (
                    <div key={t.maTieuChi} className="flex items-start gap-2 p-2 rounded border border-red-100 bg-red-50">
                      <CheckCircle2 className="h-3.5 w-3.5 text-red-500 shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs">{t.noiDung}</p>
                      </div>
                      <Badge variant="outline" className="text-[10px] shrink-0 border-red-200 text-red-600">
                        T.số: {t.trongSo}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
              {uuTien.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-amber-700 mb-2 flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    Ưu tiên ({uuTien.length})
                  </h4>
                  <div className="space-y-2">
                    {uuTien.map((t) => (
                      <div key={t.maTieuChi} className="flex items-start gap-2 p-2 rounded border border-amber-100 bg-amber-50">
                        <Target className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs">{t.noiDung}</p>
                        </div>
                        <Badge variant="outline" className="text-[10px] shrink-0 border-amber-200 text-amber-600">
                          T.số: {t.trongSo}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Ứng viên */}
        <Card className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-600" />
              Danh sách Ứng viên ({uvList.length})
            </h3>
            <Link href="/hr/candidates"><Button size="sm" variant="outline">Xem Pipeline</Button></Link>
          </div>
          {uvList.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Họ tên</TableHead>
                  <TableHead>Trình độ</TableHead>
                  <TableHead>Kinh nghiệm</TableHead>
                  <TableHead>Nguồn</TableHead>
                  <TableHead>Pipeline</TableHead>
                  <TableHead>Hồ sơ</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {uvList.map((uv) => {
                  const docsOk = Object.values(uv.hoSoHopLe).every(Boolean);
                  return (
                    <TableRow key={uv.maUngVien}>
                      <TableCell className="font-medium">{uv.hoTen}</TableCell>
                      <TableCell className="text-sm">{uv.trinhDo}</TableCell>
                      <TableCell className="text-sm">{uv.namKinhNghiem} năm</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{uv.nguon}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`text-xs ${uv.trangThaiPipeline === "nhan_viec" ? "bg-green-50 text-green-700 border-green-200" : uv.trangThaiPipeline === "loai" ? "bg-red-50 text-red-700 border-red-200" : "bg-blue-50 text-blue-700 border-blue-200"}`}>
                          {pipelineLabels[uv.trangThaiPipeline]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {docsOk ? (
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                      </TableCell>
                      <TableCell>
                        <Link href={`/hr/candidates/${uv.maUngVien}`}>
                          <Button size="sm" variant="outline" className="h-7 text-xs">Chi tiết</Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="py-8 text-center text-muted-foreground text-sm">
              Chưa có ứng viên nào cho yêu cầu này
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
