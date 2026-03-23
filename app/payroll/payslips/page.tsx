"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { FileSpreadsheet, Eye } from "lucide-react";
import { bangLuong, phieuLuongThang3, phieuLuongThang2 } from "@/lib/payroll-mock-data";
import type { PhieuLuongNhanVien } from "@/lib/payroll-types";

function fmt(n: number) {
  return n.toLocaleString("vi-VN");
}

const statusMap: Record<number, { label: string; color: string }> = {
  0: { label: "Nháp", color: "bg-yellow-100 text-yellow-800" },
  1: { label: "Đã phê duyệt", color: "bg-blue-100 text-blue-800" },
  2: { label: "Đã thanh toán", color: "bg-green-100 text-green-800" },
};

export default function PayrollPayslipsPage() {
  const [selectedKy, setSelectedKy] = useState("2");
  const [selectedPhieu, setSelectedPhieu] = useState<PhieuLuongNhanVien | null>(null);

  const ky = bangLuong.find((b) => b.id === Number(selectedKy))!;
  const danhSach = selectedKy === "1" ? phieuLuongThang2 : phieuLuongThang3;

  const tongGross = danhSach.reduce((s, p) => s + p.tongThuNhap, 0);
  const tongNet = danhSach.reduce((s, p) => s + p.luongThucLinh, 0);
  const tongThue = danhSach.reduce((s, p) => s + p.thueTNCN, 0);
  const tongBH = danhSach.reduce((s, p) => s + p.tongBaoHiem, 0);

  return (
    <DashboardLayout
      role="payroll_accountant"
      breadcrumbs={[{ label: "Tổng quan", href: "/payroll" }, { label: "Bảng lương & Phiếu lương" }]}
    >
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Bảng lương & Phiếu lương</h1>
            <p className="text-muted-foreground">Xem bảng lương tổng hợp và phiếu lương cá nhân</p>
          </div>
          <Select value={selectedKy} onValueChange={setSelectedKy}>
            <SelectTrigger className="w-52">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {bangLuong.map((b) => (
                <SelectItem key={b.id} value={String(b.id)}>{b.tenKyLuong}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* KPI kỳ đã chọn */}
        <div className="flex items-center gap-4 p-4 border rounded-lg bg-muted/10">
          <div>
            <p className="font-semibold text-lg">{ky.tenKyLuong}</p>
            <p className="text-sm text-muted-foreground">Ngày chốt lương: {new Date(ky.ngayChotLuong).toLocaleDateString("vi-VN")}</p>
            {ky.nguoiDuyet && <p className="text-sm text-muted-foreground">KTT duyệt: {ky.nguoiDuyet} ({ky.ngayDuyet && new Date(ky.ngayDuyet).toLocaleDateString("vi-VN")})</p>}
            {ky.nguoiGiamDoc && <p className="text-sm text-muted-foreground">GĐ duyệt: {ky.nguoiGiamDoc} ({ky.ngayGiamDocDuyet && new Date(ky.ngayGiamDocDuyet).toLocaleDateString("vi-VN")})</p>}
          </div>
          <div className="ml-auto flex items-center gap-4">
            <Badge className={`text-sm px-3 py-1 ${statusMap[ky.trangThai].color}`}>{statusMap[ky.trangThai].label}</Badge>
            <Button variant="outline" size="sm">
              <FileSpreadsheet className="h-4 w-4 mr-2" /> Xuất Excel
            </Button>
          </div>
        </div>

        {/* Bảng tổng hợp */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Tổng Gross", value: tongGross },
            { label: "Tổng Bảo hiểm NV", value: tongBH },
            { label: "Tổng Thuế TNCN", value: tongThue },
            { label: "Tổng Thực lĩnh", value: tongNet },
          ].map((item) => (
            <Card key={item.label}>
              <CardContent className="pt-5">
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="font-bold mt-1">{fmt(item.value)}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5" />
              Bảng lương chi tiết ({danhSach.length} nhân viên)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-muted-foreground">
                    <th className="text-left py-2 font-medium">Nhân viên</th>
                    <th className="text-left py-2 font-medium">Phòng ban</th>
                    <th className="text-right py-2 font-medium">Gross (vnđ)</th>
                    <th className="text-right py-2 font-medium">BH NV (vnđ)</th>
                    <th className="text-right py-2 font-medium">Thuế TNCN (vnđ)</th>
                    <th className="text-right py-2 font-medium">Thực lĩnh (vnđ)</th>
                    <th className="py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {danhSach.map((pl) => (
                    <tr key={pl.nhanVien.id} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="py-3">
                        <p className="font-medium">{pl.nhanVien.hoTen}</p>
                        <p className="text-xs text-muted-foreground">{pl.nhanVien.maNhanVien}</p>
                      </td>
                      <td className="py-3 text-muted-foreground text-xs">{pl.nhanVien.phongBan}</td>
                      <td className="py-3 text-right">{fmt(pl.tongThuNhap)}</td>
                      <td className="py-3 text-right text-orange-600">{fmt(pl.tongBaoHiem)}</td>
                      <td className="py-3 text-right text-red-600">{fmt(pl.thueTNCN)}</td>
                      <td className="py-3 text-right font-bold text-green-700">{fmt(pl.luongThucLinh)}</td>
                      <td className="py-3 text-right">
                        <Button variant="ghost" size="sm" onClick={() => setSelectedPhieu(pl)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t bg-muted/20 font-semibold">
                    <td className="py-2" colSpan={2}>Tổng cộng</td>
                    <td className="py-2 text-right">{fmt(tongGross)}</td>
                    <td className="py-2 text-right text-orange-600">{fmt(tongBH)}</td>
                    <td className="py-2 text-right text-red-600">{fmt(tongThue)}</td>
                    <td className="py-2 text-right text-green-700">{fmt(tongNet)}</td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Dialog phiếu lương */}
        {selectedPhieu && (
          <Dialog open={!!selectedPhieu} onOpenChange={() => setSelectedPhieu(null)}>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Phiếu lương — {selectedPhieu.nhanVien.hoTen}</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 text-sm">
                <div className="text-muted-foreground text-xs">{selectedPhieu.nhanVien.phongBan} · {selectedPhieu.nhanVien.maNhanVien} · {ky.tenKyLuong}</div>
                <Separator />
                <div className="space-y-1">
                  <p className="font-semibold text-green-700">Khoản cộng</p>
                  <div className="flex justify-between"><span>Lương thời gian</span><span>{fmt(selectedPhieu.luongThoiGian)}</span></div>
                  {selectedPhieu.thuongKPI > 0 && <div className="flex justify-between"><span>Thưởng KPI</span><span>{fmt(selectedPhieu.thuongKPI)}</span></div>}
                  <div className="flex justify-between"><span>PC ăn trưa</span><span>{fmt(selectedPhieu.phuCapAnTrua)}</span></div>
                  <div className="flex justify-between"><span>PC xăng xe</span><span>{fmt(selectedPhieu.phuCapXangXe)}</span></div>
                  <div className="flex justify-between font-semibold border-t pt-1"><span>Tổng thu nhập (Gross)</span><span>{fmt(selectedPhieu.tongThuNhap)}</span></div>
                </div>
                <Separator />
                <div className="space-y-1">
                  <p className="font-semibold text-red-600">Khoản trừ</p>
                  <div className="flex justify-between"><span>BHXH (8%)</span><span className="text-red-600">-{fmt(selectedPhieu.bhxhNhanVien)}</span></div>
                  <div className="flex justify-between"><span>BHYT (1.5%)</span><span className="text-red-600">-{fmt(selectedPhieu.bhytNhanVien)}</span></div>
                  <div className="flex justify-between"><span>BHTN (1%)</span><span className="text-red-600">-{fmt(selectedPhieu.bhtnNhanVien)}</span></div>
                  <div className="flex justify-between"><span>Thuế TNCN</span><span className="text-red-600">-{fmt(selectedPhieu.thueTNCN)}</span></div>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold text-green-700">
                  <span>Lương thực lĩnh</span>
                  <span>{fmt(selectedPhieu.luongThucLinh)}</span>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </DashboardLayout>
  );
}
