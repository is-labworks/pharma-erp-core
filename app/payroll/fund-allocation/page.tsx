"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PieChart, Wallet, Lock, Unlock } from "lucide-react";
import { bangLuong, phanBoQuyLuong, phanBoTheoPhongBan, phieuLuongThang3, phieuLuongThang2 } from "@/lib/payroll-mock-data";

function fmt(n: number) { return n.toLocaleString("vi-VN"); }

// Simple SVG Pie chart
function PieChartSVG({ data }: { data: { label: string; value: number; color: string }[] }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  let cumulative = 0;
  const slices = data.map((d) => {
    const start = (cumulative / total) * 2 * Math.PI;
    cumulative += d.value;
    const end = (cumulative / total) * 2 * Math.PI;
    const x1 = Math.sin(start) * 80 + 100;
    const y1 = -Math.cos(start) * 80 + 100;
    const x2 = Math.sin(end) * 80 + 100;
    const y2 = -Math.cos(end) * 80 + 100;
    const large = end - start > Math.PI ? 1 : 0;
    return { ...d, path: `M100,100 L${x1},${y1} A80,80 0 ${large} 1 ${x2},${y2} Z` };
  });
  return (
    <svg viewBox="0 0 200 200" className="w-full max-w-[180px]">
      {slices.map((s, i) => (
        <path key={i} d={s.path} fill={s.color} stroke="white" strokeWidth="2" />
      ))}
    </svg>
  );
}

export default function FundAllocationPage() {
  const [selectedKy, setSelectedKy] = useState("2");
  const [khoaSo, setKhoaSo] = useState(bangLuong[0].khoaSo ?? true);

  const ky = bangLuong.find((b) => b.id === Number(selectedKy))!;
  const phieuList = selectedKy === "1" ? phieuLuongThang2 : phieuLuongThang3;
  const tongGross = phieuList.reduce((s, p) => s + p.tongThuNhap, 0);

  const quySoPie = phanBoQuyLuong.map((q) => ({ label: q.tenQuy, value: q.tongTien, color: q.mauSac! }));
  const deptPie = phanBoTheoPhongBan.map((q) => ({ label: q.phongBan!, value: q.tongTien, color: q.mauSac! }));

  return (
    <DashboardLayout
      role="payroll_accountant"
      breadcrumbs={[{ label: "Tổng quan", href: "/payroll" }, { label: "Phân bổ Quỹ lương" }]}
    >
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Phân bổ Quỹ lương</h1>
            <p className="text-muted-foreground">Cơ cấu quỹ lương & phân bổ theo đơn vị</p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={selectedKy} onValueChange={setSelectedKy}>
              <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
              <SelectContent>
                {bangLuong.map((b) => <SelectItem key={b.id} value={String(b.id)}>{b.tenKyLuong}</SelectItem>)}
              </SelectContent>
            </Select>
            <Badge className={`px-3 py-1.5 text-sm ${ky.trangThai === 2 ? "bg-green-100 text-green-700" : ky.trangThai === 1 ? "bg-blue-100 text-blue-700" : "bg-yellow-100 text-yellow-700"}`}>
              {ky.trangThai === 2 ? "Đã thanh toán" : ky.trangThai === 1 ? "Đã phê duyệt" : "Nháp"}
            </Badge>
          </div>
        </div>

        {/* Khóa sổ */}
        <Card className={`border-2 ${khoaSo ? "border-green-300 bg-green-50" : "border-yellow-300 bg-yellow-50"}`}>
          <CardContent className="pt-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {khoaSo ? <Lock className="h-5 w-5 text-green-700" /> : <Unlock className="h-5 w-5 text-yellow-700" />}
              <div>
                <p className={`font-semibold ${khoaSo ? "text-green-800" : "text-yellow-800"}`}>
                  {khoaSo ? "Kỳ lương đã được Khóa sổ" : "Kỳ lương đang Mở — chưa khóa sổ"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {khoaSo ? "Dữ liệu không thể chỉnh sửa. Sẵn sàng chuyển sang kế toán." : "Chỉ khóa sổ sau khi Giám đốc đã phê duyệt."}
                </p>
              </div>
            </div>
            {!khoaSo && ky.trangThai === 2 && (
              <Button className="bg-green-600 hover:bg-green-700" onClick={() => setKhoaSo(true)}>
                <Lock className="h-4 w-4 mr-2" /> Khóa sổ lương
              </Button>
            )}
            {khoaSo && (
              <Button variant="outline" size="sm" onClick={() => setKhoaSo(false)}>
                <Unlock className="h-4 w-4 mr-2" /> Mở khóa
              </Button>
            )}
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Phân bổ theo quỹ */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <PieChart className="h-4 w-4" /> Cơ cấu Quỹ lương — {ky.tenKyLuong}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <PieChartSVG data={quySoPie} />
                <div className="space-y-3 flex-1">
                  {phanBoQuyLuong.map((q) => (
                    <div key={q.id}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: q.mauSac }} />
                          {q.tenQuy}
                        </span>
                        <span className="font-medium">{q.tyLePhanBo}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${q.tyLePhanBo}%`, backgroundColor: q.mauSac }} />
                      </div>
                      <p className="text-xs text-right text-muted-foreground mt-0.5">{fmt(q.tongTien)} vnđ</p>
                    </div>
                  ))}
                  <div className="pt-2 border-t flex justify-between font-semibold text-sm">
                    <span>Tổng Gross</span>
                    <span>{fmt(tongGross)} vnđ</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Phân bổ theo phòng ban */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <PieChart className="h-4 w-4" /> Phân bổ theo Phòng ban
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <PieChartSVG data={deptPie} />
                <div className="space-y-2 flex-1">
                  {phanBoTheoPhongBan.map((q) => {
                    const pct = Math.round((q.tongTien / tongGross) * 100);
                    return (
                      <div key={q.id} className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: q.mauSac }} />
                          {q.phongBan}
                        </span>
                        <span className="text-muted-foreground">{pct}% · {fmt(q.tongTien)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bảng tổng hợp quỹ */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" /> Bảng tổng hợp quỹ lương
            </CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-muted-foreground">
                  <th className="text-left py-2">Quỹ lương</th>
                  <th className="text-right py-2">Tỷ lệ</th>
                  <th className="text-right py-2">Số tiền (vnđ)</th>
                  <th className="text-right py-2">Đã phân bổ (vnđ)</th>
                </tr>
              </thead>
              <tbody>
                {phanBoQuyLuong.map((q) => (
                  <tr key={q.id} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="py-2 flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: q.mauSac }} />
                      {q.tenQuy}
                    </td>
                    <td className="py-2 text-right">{q.tyLePhanBo}%</td>
                    <td className="py-2 text-right">{fmt(q.tongTien)}</td>
                    <td className="py-2 text-right text-green-700">{fmt(q.tongTien)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t font-semibold bg-muted/20">
                  <td className="py-2">Tổng</td>
                  <td className="py-2 text-right">100%</td>
                  <td className="py-2 text-right">{fmt(tongGross)}</td>
                  <td className="py-2 text-right text-green-700">{fmt(tongGross)}</td>
                </tr>
              </tfoot>
            </table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
