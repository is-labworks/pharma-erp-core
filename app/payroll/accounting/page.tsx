"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, BookOpen, Download } from "lucide-react";
import { hachToanEntries, trichNopData, phieuLuongThang3, phieuLuongThang2, luongNhanVien } from "@/lib/payroll-mock-data";

function fmt(n: number) { return n.toLocaleString("vi-VN"); }

const tkColor: Record<string, string> = {
  "622": "bg-blue-100 text-blue-800",
  "641": "bg-green-100 text-green-800",
  "642": "bg-purple-100 text-purple-800",
  "334": "bg-orange-100 text-orange-800",
  "3383": "bg-red-100 text-red-800",
  "3335": "bg-amber-100 text-amber-800",
};

export default function PayrollAccountingPage() {
  const [tab, setTab] = useState<"hachtoan" | "trichnop" | "toikhai">("hachtoan");

  const tongBHNV = trichNopData.reduce((s, t) => s + t.bhxhNLD + t.bhytNLD + t.bhtnNLD, 0);
  const tongBHDN = trichNopData.reduce((s, t) => s + t.bhxhDN + t.bhytDN + t.bhtnDN, 0);
  const tongThue = trichNopData.reduce((s, t) => s + t.thueTNCN, 0);
  const tongLuong334 = phieuLuongThang3.reduce((s, p) => s + p.tongThuNhap, 0);

  return (
    <DashboardLayout
      role="payroll_accountant"
      breadcrumbs={[{ label: "Tổng quan", href: "/payroll" }, { label: "Kế toán & Báo cáo Thuế" }]}
    >
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Kế toán & Báo cáo Thuế</h1>
            <p className="text-muted-foreground">Bút toán hạch toán, trích nộp BH & tờ khai TNCN — Tháng 03/2026</p>
          </div>
          <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-2" />Xuất báo cáo</Button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "TK 334 – Phải trả NV", value: tongLuong334, color: "text-orange-700" },
            { label: "TK 3383 – BH NV đóng", value: tongBHNV, color: "text-red-700" },
            { label: "TK 3383 – BH DN đóng", value: tongBHDN, color: "text-red-700" },
            { label: "TK 3335 – Thuế TNCN", value: tongThue, color: "text-purple-700" },
          ].map(item => (
            <Card key={item.label}>
              <CardContent className="pt-4">
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className={`font-bold mt-1 ${item.color}`}>{fmt(item.value)}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b">
          {([["hachtoan","Bút toán Hạch toán"],["trichnop","Trích nộp BH & Thuế"],["toikhai","Tờ khai Thuế TNCN"]] as const).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${tab === key ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            >{label}</button>
          ))}
        </div>

        {/* Tab: Bút toán */}
        {tab === "hachtoan" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />Bút toán Hạch toán Tiền lương tháng 03/2026
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-muted-foreground">
                      <th className="text-left py-2">Ngày HT</th>
                      <th className="text-left py-2">Bộ phận</th>
                      <th className="text-center py-2">TK Nợ</th>
                      <th className="text-center py-2">TK Có</th>
                      <th className="text-right py-2">Số tiền (vnđ)</th>
                      <th className="text-left py-2">Diễn giải</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hachToanEntries.map((h) => (
                      <tr key={h.id} className="border-b last:border-0 hover:bg-muted/30">
                        <td className="py-2 text-muted-foreground">{new Date(h.ngayHachToan).toLocaleDateString("vi-VN")}</td>
                        <td className="py-2">{h.tenPhongBan}</td>
                        <td className="py-2 text-center">
                          <Badge className={`font-mono ${tkColor[h.taiKhoanNo] ?? "bg-gray-100 text-gray-800"}`}>TK {h.taiKhoanNo}</Badge>
                        </td>
                        <td className="py-2 text-center">
                          <Badge className={`font-mono ${tkColor[h.taiKhoanCo] ?? "bg-gray-100 text-gray-800"}`}>TK {h.taiKhoanCo}</Badge>
                        </td>
                        <td className="py-2 text-right font-medium">{fmt(h.soTien)}</td>
                        <td className="py-2 text-muted-foreground text-xs max-w-xs">{h.dienGiai}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t font-semibold bg-muted/20">
                      <td className="py-2" colSpan={4}>Tổng phát sinh</td>
                      <td className="py-2 text-right">{fmt(hachToanEntries.reduce((s, h) => s + h.soTien, 0))}</td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tab: Trích nộp BH & Thuế */}
        {tab === "trichnop" && (
          <Card>
            <CardHeader>
              <CardTitle>Chi tiết Trích nộp BH & Thuế TNCN từng nhân viên</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-muted-foreground text-xs">
                      <th className="text-left py-2">Nhân viên</th>
                      <th className="text-right py-2">TN chịu thuế</th>
                      <th className="text-right py-2">Giảm trừ GC</th>
                      <th className="text-right py-2">TN tính thuế</th>
                      <th className="text-right py-2">BHXH NLĐ</th>
                      <th className="text-right py-2">BHYT NLĐ</th>
                      <th className="text-right py-2">BHTN NLĐ</th>
                      <th className="text-right py-2">BHXH DN</th>
                      <th className="text-right py-2">BHYT DN</th>
                      <th className="text-right py-2">Thuế TNCN</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trichNopData.map((t) => {
                      const nv = luongNhanVien.find(n => n.id === t.idNhanVien)!;
                      const pl = phieuLuongThang3.find(p => p.nhanVien.id === t.idNhanVien)!;
                      return (
                        <tr key={t.id} className="border-b last:border-0 hover:bg-muted/30 text-xs">
                          <td className="py-2 font-medium">{nv.hoTen}</td>
                          <td className="py-2 text-right">{fmt(t.thuNhapChiuThue)}</td>
                          <td className="py-2 text-right text-green-700">-{fmt(t.giamTruGiaCanh)}</td>
                          <td className="py-2 text-right font-medium">{fmt(pl.thuNhapTinhThue)}</td>
                          <td className="py-2 text-right text-orange-600">{fmt(t.bhxhNLD)}</td>
                          <td className="py-2 text-right text-orange-600">{fmt(t.bhytNLD)}</td>
                          <td className="py-2 text-right text-orange-600">{fmt(t.bhtnNLD)}</td>
                          <td className="py-2 text-right text-red-600">{fmt(t.bhxhDN)}</td>
                          <td className="py-2 text-right text-red-600">{fmt(t.bhytDN)}</td>
                          <td className="py-2 text-right text-purple-700 font-medium">{fmt(t.thueTNCN)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="border-t font-semibold text-xs bg-muted/20">
                      <td className="py-2">Tổng cộng</td>
                      <td className="py-2 text-right">{fmt(trichNopData.reduce((s,t)=>s+t.thuNhapChiuThue,0))}</td>
                      <td className="py-2 text-right text-green-700">-{fmt(trichNopData.reduce((s,t)=>s+t.giamTruGiaCanh,0))}</td>
                      <td className="py-2 text-right">{fmt(phieuLuongThang3.reduce((s,p)=>s+p.thuNhapTinhThue,0))}</td>
                      <td className="py-2 text-right text-orange-600">{fmt(trichNopData.reduce((s,t)=>s+t.bhxhNLD,0))}</td>
                      <td className="py-2 text-right text-orange-600">{fmt(trichNopData.reduce((s,t)=>s+t.bhytNLD,0))}</td>
                      <td className="py-2 text-right text-orange-600">{fmt(trichNopData.reduce((s,t)=>s+t.bhtnNLD,0))}</td>
                      <td className="py-2 text-right text-red-600">{fmt(trichNopData.reduce((s,t)=>s+t.bhxhDN,0))}</td>
                      <td className="py-2 text-right text-red-600">{fmt(trichNopData.reduce((s,t)=>s+t.bhytDN,0))}</td>
                      <td className="py-2 text-right text-purple-700">{fmt(trichNopData.reduce((s,t)=>s+t.thueTNCN,0))}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tab: Tờ khai TNCN */}
        {tab === "toikhai" && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Tờ khai thuế TNCN tháng 03/2026 (Mẫu 01-TNTX)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2 p-4 border rounded-lg">
                    <p className="font-semibold text-muted-foreground uppercase text-xs tracking-wider">Thông tin đơn vị</p>
                    <div className="flex justify-between"><span>Tên đơn vị:</span><span className="font-medium">PharmaPro Co., Ltd</span></div>
                    <div className="flex justify-between"><span>MST:</span><span className="font-medium">0312345678</span></div>
                    <div className="flex justify-between"><span>Kỳ kê khai:</span><span className="font-medium">Tháng 03/2026</span></div>
                    <div className="flex justify-between"><span>Số NV có thu nhập:</span><span className="font-medium">{luongNhanVien.length} người</span></div>
                  </div>
                  <div className="space-y-2 p-4 border rounded-lg">
                    <p className="font-semibold text-muted-foreground uppercase text-xs tracking-wider">Tổng hợp số liệu</p>
                    <div className="flex justify-between"><span>Tổng TN chịu thuế:</span><span className="font-medium">{fmt(trichNopData.reduce((s,t)=>s+t.thuNhapChiuThue,0))}</span></div>
                    <div className="flex justify-between"><span>Tổng giảm trừ:</span><span className="font-medium text-green-700">-{fmt(trichNopData.reduce((s,t)=>s+t.giamTruGiaCanh,0))}</span></div>
                    <div className="flex justify-between"><span>Tổng TN tính thuế:</span><span className="font-medium">{fmt(phieuLuongThang3.reduce((s,p)=>s+p.thuNhapTinhThue,0))}</span></div>
                    <div className="flex justify-between border-t pt-2"><span className="font-semibold">Tổng thuế TNCN phải nộp:</span><span className="font-bold text-red-700">{fmt(tongThue)}</span></div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <p className="text-sm font-medium mb-2">Chi tiết từng cá nhân</p>
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b bg-muted/20">
                        <th className="text-left py-2 px-2">STT</th>
                        <th className="text-left py-2">Họ tên</th>
                        <th className="text-left py-2">MST cá nhân</th>
                        <th className="text-right py-2">TN chịu thuế</th>
                        <th className="text-right py-2">Giảm trừ</th>
                        <th className="text-right py-2">TN tính thuế</th>
                        <th className="text-right py-2">Thuế TNCN</th>
                      </tr>
                    </thead>
                    <tbody>
                      {trichNopData.map((t, i) => {
                        const nv = luongNhanVien.find(n => n.id === t.idNhanVien)!;
                        const pl = phieuLuongThang3.find(p => p.nhanVien.id === t.idNhanVien)!;
                        return (
                          <tr key={t.id} className="border-b last:border-0 hover:bg-muted/20">
                            <td className="py-1.5 px-2">{i+1}</td>
                            <td className="py-1.5">{nv.hoTen}</td>
                            <td className="py-1.5 font-mono text-muted-foreground">MST-{String(nv.id).padStart(8,"0")}</td>
                            <td className="py-1.5 text-right">{fmt(t.thuNhapChiuThue)}</td>
                            <td className="py-1.5 text-right text-green-700">-{fmt(t.giamTruGiaCanh)}</td>
                            <td className="py-1.5 text-right">{fmt(pl.thuNhapTinhThue)}</td>
                            <td className="py-1.5 text-right font-semibold text-red-700">{fmt(t.thueTNCN)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="flex gap-3 pt-2">
                  <Button size="sm"><FileText className="h-4 w-4 mr-2" />Nộp tờ khai điện tử</Button>
                  <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-2" />Tải XML nộp thuế</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />Quyết toán năm (Mẫu 02A-TNTX) — Tóm tắt
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-3">
                <p className="text-muted-foreground">Tổng thu nhập lũy kế từ 01/2026 đến 03/2026</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b bg-muted/20">
                        <th className="text-left py-2">Họ tên</th>
                        <th className="text-right py-2">TN T1</th>
                        <th className="text-right py-2">TN T2</th>
                        <th className="text-right py-2">TN T3</th>
                        <th className="text-right py-2">Tổng TN</th>
                        <th className="text-right py-2">Tổng thuế</th>
                      </tr>
                    </thead>
                    <tbody>
                      {phieuLuongThang3.map((pl3) => {
                        const pl2 = phieuLuongThang2.find(p => p.nhanVien.id === pl3.nhanVien.id)!;
                        const t1 = Math.round(pl3.tongThuNhap * 0.9); // giả lập T1
                        const tongTN = t1 + pl2.tongThuNhap + pl3.tongThuNhap;
                        const tongThueNV = Math.round(pl2.thueTNCN + pl3.thueTNCN + pl3.thueTNCN * 0.85);
                        return (
                          <tr key={pl3.nhanVien.id} className="border-b last:border-0 hover:bg-muted/20">
                            <td className="py-1.5">{pl3.nhanVien.hoTen}</td>
                            <td className="py-1.5 text-right">{fmt(t1)}</td>
                            <td className="py-1.5 text-right">{fmt(pl2.tongThuNhap)}</td>
                            <td className="py-1.5 text-right">{fmt(pl3.tongThuNhap)}</td>
                            <td className="py-1.5 text-right font-medium">{fmt(tongTN)}</td>
                            <td className="py-1.5 text-right text-red-700 font-medium">{fmt(tongThueNV)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
