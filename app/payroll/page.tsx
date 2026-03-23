"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Wallet, TrendingUp, Receipt, CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import { bangLuong, luongNhanVien, phieuLuongThang3, phieuLuongThang2 } from "@/lib/payroll-mock-data";
import Link from "next/link";

const statusMap: Record<number, { label: string; color: string }> = {
  0: { label: "Nháp", color: "bg-yellow-100 text-yellow-800 border-yellow-300" },
  1: { label: "Đã phê duyệt", color: "bg-blue-100 text-blue-800 border-blue-300" },
  2: { label: "Đã thanh toán", color: "bg-green-100 text-green-800 border-green-300" },
};

export default function PayrollDashboardPage() {
  const kyHienTai = bangLuong[1]; // tháng 03/2026 – nháp
  const kyTruoc = bangLuong[0];   // tháng 02/2026 – đã thanh toán

  const tongQuyCuoi = phieuLuongThang3.reduce((s, p) => s + p.luongThucLinh, 0);
  const tongGross = phieuLuongThang3.reduce((s, p) => s + p.tongThuNhap, 0);
  const tongThueTNCN = phieuLuongThang3.reduce((s, p) => s + p.thueTNCN, 0);
  const tbLuong = tongQuyCuoi / phieuLuongThang3.length;

  // Thống kê theo phòng ban
  const byDept: Record<string, { count: number; gross: number; net: number }> = {};
  phieuLuongThang3.forEach((p) => {
    const dept = p.nhanVien.phongBan;
    if (!byDept[dept]) byDept[dept] = { count: 0, gross: 0, net: 0 };
    byDept[dept].count++;
    byDept[dept].gross += p.tongThuNhap;
    byDept[dept].net += p.luongThucLinh;
  });

  return (
    <DashboardLayout
      role="payroll_accountant"
      breadcrumbs={[{ label: "Tổng quan Tiền lương" }]}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Quản lý Tiền lương</h1>
            <p className="text-muted-foreground">Kỳ hiện tại: <strong>{kyHienTai.tenKyLuong}</strong></p>
          </div>
          <Badge className={`px-3 py-1 text-sm border ${statusMap[kyHienTai.trangThai].color}`}>
            {statusMap[kyHienTai.trangThai].label}
          </Badge>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Tổng Quỹ Lương (Net)</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{(tongQuyCuoi / 1_000_000).toFixed(1)}M</p>
              <p className="text-xs text-muted-foreground">Thực lĩnh sau thuế & BH</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Tổng Gross</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{(tongGross / 1_000_000).toFixed(1)}M</p>
              <p className="text-xs text-muted-foreground">Trước khấu trừ</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Số Nhân viên</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{luongNhanVien.length}</p>
              <p className="text-xs text-muted-foreground">Đang tính lương kỳ này</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Thuế TNCN</CardTitle>
              <Receipt className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{(tongThueTNCN / 1_000_000).toFixed(2)}M</p>
              <p className="text-xs text-muted-foreground">Tổng thuế TNCN phải nộp</p>
            </CardContent>
          </Card>
        </div>

        {/* Trạng thái các kỳ */}
        <Card>
          <CardHeader>
            <CardTitle>Lịch sử kỳ lương</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {bangLuong.map((ky) => (
                <div key={ky.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    {ky.trangThai === 2 ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : ky.trangThai === 1 ? (
                      <CheckCircle2 className="h-5 w-5 text-blue-600" />
                    ) : (
                      <Clock className="h-5 w-5 text-yellow-600" />
                    )}
                    <div>
                      <p className="font-semibold">{ky.tenKyLuong}</p>
                      <p className="text-xs text-muted-foreground">Chốt lương: {new Date(ky.ngayChotLuong).toLocaleDateString("vi-VN")}</p>
                      {ky.ghiChu && <p className="text-xs text-muted-foreground italic">{ky.ghiChu}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={`border ${statusMap[ky.trangThai].color}`}>{statusMap[ky.trangThai].label}</Badge>
                    <Link href={ky.trangThai === 0 ? "/payroll/run" : "/payroll/payslips"}>
                      <Button variant="outline" size="sm">Xem chi tiết</Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Bảng lương theo phòng ban */}
        <Card>
          <CardHeader>
            <CardTitle>Quỹ lương theo phòng ban — {kyHienTai.tenKyLuong}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 font-medium">Phòng ban</th>
                    <th className="text-right py-2 font-medium">NV</th>
                    <th className="text-right py-2 font-medium">Gross (vnđ)</th>
                    <th className="text-right py-2 font-medium">Net thực lĩnh (vnđ)</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(byDept).map(([dept, data]) => (
                    <tr key={dept} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="py-2">{dept}</td>
                      <td className="text-right py-2">{data.count}</td>
                      <td className="text-right py-2">{data.gross.toLocaleString("vi-VN")}</td>
                      <td className="text-right py-2 font-medium">{data.net.toLocaleString("vi-VN")}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t font-semibold bg-muted/20">
                    <td className="py-2">Tổng cộng</td>
                    <td className="text-right py-2">{luongNhanVien.length}</td>
                    <td className="text-right py-2">{tongGross.toLocaleString("vi-VN")}</td>
                    <td className="text-right py-2">{tongQuyCuoi.toLocaleString("vi-VN")}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
