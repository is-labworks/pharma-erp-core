"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Users } from "lucide-react";
import { luongNhanVien } from "@/lib/payroll-mock-data";

const statusLabels: Record<string, { label: string; color: string }> = {
  chinh_thuc: { label: "Chính thức", color: "bg-green-100 text-green-800" },
  thu_viec: { label: "Thử việc", color: "bg-yellow-100 text-yellow-800" },
  nghi_viec: { label: "Nghỉ việc", color: "bg-gray-100 text-gray-600" },
};

export default function PayrollEmployeesPage() {
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("all");

  const depts = Array.from(new Set(luongNhanVien.map((n) => n.phongBan)));

  const filtered = luongNhanVien.filter((nv) => {
    const matchSearch =
      nv.hoTen.toLowerCase().includes(search.toLowerCase()) ||
      nv.maNhanVien.toLowerCase().includes(search.toLowerCase());
    const matchDept = deptFilter === "all" || nv.phongBan === deptFilter;
    return matchSearch && matchDept;
  });

  return (
    <DashboardLayout
      role="payroll_accountant"
      breadcrumbs={[{ label: "Tổng quan", href: "/payroll" }, { label: "Nhân viên & Lương" }]}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nhân viên & Lương Hợp đồng</h1>
          <p className="text-muted-foreground">Master data nhân sự — cơ sở tính lương</p>
        </div>

        <div className="flex gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm nhân viên..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={deptFilter} onValueChange={setDeptFilter}>
            <SelectTrigger className="w-52">
              <SelectValue placeholder="Tất cả phòng ban" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả phòng ban</SelectItem>
              {depts.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Danh sách nhân viên ({filtered.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 font-medium">Mã NV</th>
                    <th className="text-left py-3 font-medium">Họ tên</th>
                    <th className="text-left py-3 font-medium">Phòng ban · Chức vụ</th>
                    <th className="text-right py-3 font-medium">Lương CB (vnđ)</th>
                    <th className="text-right py-3 font-medium">% Hưởng</th>
                    <th className="text-right py-3 font-medium">Người PT</th>
                    <th className="text-left py-3 font-medium">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((nv) => {
                    const luongThucte = nv.luongCoBan * nv.phanTramHuongLuong / 100;
                    const st = statusLabels[nv.trangThai];
                    return (
                      <tr key={nv.id} className="border-b last:border-0 hover:bg-muted/30">
                        <td className="py-3 font-mono text-xs">{nv.maNhanVien}</td>
                        <td className="py-3 font-medium">{nv.hoTen}</td>
                        <td className="py-3">
                          <p>{nv.phongBan}</p>
                          <p className="text-xs text-muted-foreground">{nv.chucVu}</p>
                        </td>
                        <td className="py-3 text-right">{nv.luongCoBan.toLocaleString("vi-VN")}</td>
                        <td className="py-3 text-right">{nv.phanTramHuongLuong}%</td>
                        <td className="py-3 text-right">{nv.soNguoiPhuThuoc}</td>
                        <td className="py-3">
                          <Badge className={`text-xs ${st.color}`}>{st.label}</Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
