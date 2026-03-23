"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, TrendingUp, Users, Download } from "lucide-react";
import { lichSuThongKe, phieuLuongThang3, phanBoTheoPhongBan } from "@/lib/payroll-mock-data";

function fmt(n: number) { return n.toLocaleString("vi-VN"); }
function fmtM(n: number) { return (n / 1_000_000).toFixed(1) + "M"; }

function BarChart({ data }: { data: { label: string; gross: number; net: number }[] }) {
  const maxVal = Math.max(...data.map((d) => d.gross));
  return (
    <div className="space-y-3">
      {data.map((d, i) => (
        <div key={i} className="space-y-0.5">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span className="font-medium">{d.label}</span>
            <span>Gross: {fmtM(d.gross)} / Net: {fmtM(d.net)}</span>
          </div>
          <div className="h-5 rounded bg-blue-500 transition-all" style={{ width: `${(d.gross / maxVal) * 100}%` }} />
          <div className="h-3 rounded bg-green-400 transition-all" style={{ width: `${(d.net / maxVal) * 100}%` }} />
        </div>
      ))}
      <div className="flex gap-4 text-xs mt-3 pt-2 border-t">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-blue-500 inline-block" /> Gross</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-400 inline-block" /> Net thực lĩnh</span>
      </div>
    </div>
  );
}

export default function PayrollAnalyticsPage() {
  const chartData = lichSuThongKe.map((t) => ({
    label: `T${t.thang}/${t.nam}`,
    gross: t.tongGross,
    net: t.tongNet,
  }));

  const tongGross = phieuLuongThang3.reduce((s, p) => s + p.tongThuNhap, 0);
  const tongLuongCB = phieuLuongThang3.reduce((s, p) => s + p.luongThoiGian, 0);
  const tongPC = phieuLuongThang3.reduce((s, p) => s + p.phuCapAnTrua + p.phuCapXangXe, 0);
  const tongKPI = phieuLuongThang3.reduce((s, p) => s + p.thuongKPI, 0);
  const tongBHNV = phieuLuongThang3.reduce((s, p) => s + p.tongBaoHiem, 0);
  const tongThue = phieuLuongThang3.reduce((s, p) => s + p.thueTNCN, 0);

  const coCAuChi = [
    { label: "Lương thời gian", value: tongLuongCB, color: "bg-blue-500" },
    { label: "Thưởng KPI", value: tongKPI, color: "bg-green-500" },
    { label: "Phụ cấp", value: tongPC, color: "bg-amber-500" },
    { label: "BHXH/BHYT/BHTN NV", value: tongBHNV, color: "bg-red-400" },
    { label: "Thuế TNCN", value: tongThue, color: "bg-purple-500" },
  ];

  const trucTiep = phieuLuongThang3.filter((p) => p.nhanVien.phongBan === "Sản xuất (GMP)").reduce((s, p) => s + p.tongThuNhap, 0);
  const gianTiep = tongGross - trucTiep;

  return (
    <DashboardLayout
      role="payroll_accountant"
      breadcrumbs={[{ label: "Tổng quan", href: "/payroll" }, { label: "Báo cáo & Thống kê" }]}
    >
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Báo cáo & Thống kê Nhân sự</h1>
            <p className="text-muted-foreground">Phân tích biến động chi phí lao động theo tháng</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-2" />Xuất PDF</Button>
            <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-2" />Xuất Excel</Button>
          </div>
        </div>

        {/* KPI: tháng này vs tháng trước */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Tổng Gross T3/2026", cur: lichSuThongKe[4].tongGross, prev: lichSuThongKe[3].tongGross },
            { label: "Tổng Net T3/2026", cur: lichSuThongKe[4].tongNet, prev: lichSuThongKe[3].tongNet },
            { label: "BH Doanh nghiệp đóng", cur: lichSuThongKe[4].tongBaoHiemDN, prev: lichSuThongKe[3].tongBaoHiemDN },
            { label: "Thuế TNCN T3/2026", cur: lichSuThongKe[4].tongThueTNCN, prev: lichSuThongKe[3].tongThueTNCN },
          ].map((item) => {
            const chg = ((item.cur - item.prev) / item.prev) * 100;
            return (
              <Card key={item.label}>
                <CardContent className="pt-5">
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="font-bold mt-1">{fmtM(item.cur)}</p>
                  <p className={`text-xs mt-1 flex items-center gap-1 ${chg >= 0 ? "text-red-500" : "text-green-500"}`}>
                    <TrendingUp className="h-3 w-3" />
                    {chg >= 0 ? "+" : ""}{chg.toFixed(1)}% so T2
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <BarChart3 className="h-4 w-4" />Biến động Quỹ lương (5 tháng gần nhất)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BarChart data={chartData} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Cơ cấu Chi phí Nhân sự T3/2026</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {coCAuChi.map((item) => {
                const pct = Math.round((item.value / tongGross) * 100);
                return (
                  <div key={item.label} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full ${item.color}`} />
                        {item.label}
                      </span>
                      <span className="text-muted-foreground">{pct}% · {fmtM(item.value)}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${item.color}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />Chi phí Lao động – Trực tiếp vs Gián tiếp
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 border rounded-xl bg-blue-50">
                <p className="text-muted-foreground text-sm">Lao động trực tiếp</p>
                <p className="text-2xl font-bold text-blue-700 mt-2">{fmtM(trucTiep)}</p>
                <p className="text-sm text-muted-foreground">{Math.round((trucTiep / tongGross) * 100)}% tổng quỹ</p>
                <p className="text-xs mt-1 text-blue-600">Sản xuất GMP</p>
              </div>
              <div className="text-center p-6 border rounded-xl bg-purple-50">
                <p className="text-muted-foreground text-sm">Lao động gián tiếp</p>
                <p className="text-2xl font-bold text-purple-700 mt-2">{fmtM(gianTiep)}</p>
                <p className="text-sm text-muted-foreground">{Math.round((gianTiep / tongGross) * 100)}% tổng quỹ</p>
                <p className="text-xs mt-1 text-purple-600">QA/KD/KT/Kho/R&D</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Chi tiết theo phòng ban</p>
                {phanBoTheoPhongBan.map((d) => (
                  <div key={d.id} className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.mauSac }} />
                      {d.phongBan}
                    </span>
                    <span className="font-medium">{fmtM(d.tongTien)}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Bảng tổng hợp chi phí nhân sự (5 kỳ)</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-muted-foreground">
                    <th className="text-left py-2">Kỳ</th>
                    <th className="text-right py-2">NV</th>
                    <th className="text-right py-2">Gross</th>
                    <th className="text-right py-2">BH NV</th>
                    <th className="text-right py-2">BH DN</th>
                    <th className="text-right py-2">Thuế TNCN</th>
                    <th className="text-right py-2">Net</th>
                  </tr>
                </thead>
                <tbody>
                  {lichSuThongKe.map((t, i) => (
                    <tr key={i} className={`border-b last:border-0 hover:bg-muted/30 ${i === lichSuThongKe.length - 1 ? "font-semibold bg-blue-50" : ""}`}>
                      <td className="py-2">T{t.thang}/{t.nam}</td>
                      <td className="py-2 text-right">{t.tongNhanVien}</td>
                      <td className="py-2 text-right">{fmtM(t.tongGross)}</td>
                      <td className="py-2 text-right text-orange-600">{fmtM(t.tongBaoHiemNV)}</td>
                      <td className="py-2 text-right text-red-600">{fmtM(t.tongBaoHiemDN)}</td>
                      <td className="py-2 text-right text-purple-600">{fmtM(t.tongThueTNCN)}</td>
                      <td className="py-2 text-right text-green-700">{fmtM(t.tongNet)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
