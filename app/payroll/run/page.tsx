"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChevronDown, ChevronUp, CheckCircle2, Calculator } from "lucide-react";
import { bangLuong, phieuLuongThang3, tinhPhieuLuong, luongNhanVien } from "@/lib/payroll-mock-data";
import type { PhieuLuongNhanVien } from "@/lib/payroll-types";

function fmt(n: number) {
  return n.toLocaleString("vi-VN");
}

function PhieuRow({ pl }: { pl: PhieuLuongNhanVien }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/30 text-left"
      >
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xs font-bold flex items-center justify-center shrink-0">
            {pl.nhanVien.hoTen.split(" ").slice(-1)[0][0]}
          </div>
          <div>
            <p className="font-medium text-sm">{pl.nhanVien.hoTen}</p>
            <p className="text-xs text-muted-foreground">{pl.nhanVien.phongBan} · {pl.nhanVien.maNhanVien}</p>
          </div>
        </div>
        <div className="flex items-center gap-6 text-sm">
          <div className="text-right hidden md:block">
            <p className="text-muted-foreground text-xs">Gross</p>
            <p>{fmt(pl.tongThuNhap)}</p>
          </div>
          <div className="text-right hidden md:block">
            <p className="text-muted-foreground text-xs">BH + Thuế</p>
            <p className="text-red-600">-{fmt(pl.tongBaoHiem + pl.thueTNCN)}</p>
          </div>
          <div className="text-right">
            <p className="text-muted-foreground text-xs">Thực lĩnh</p>
            <p className="font-bold text-green-700">{fmt(pl.luongThucLinh)}</p>
          </div>
          {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </div>
      </button>
      {open && (
        <div className="border-t bg-muted/10 p-4 grid md:grid-cols-3 gap-4 text-sm">
          <div className="space-y-1">
            <p className="font-semibold text-green-700 mb-2">Thu nhập (+)</p>
            <div className="flex justify-between"><span className="text-muted-foreground">Lương thời gian</span><span>{fmt(pl.luongThoiGian)}</span></div>
            {pl.thuongKPI > 0 && <div className="flex justify-between"><span className="text-muted-foreground">Thưởng KPI</span><span>{fmt(pl.thuongKPI)}</span></div>}
            <div className="flex justify-between"><span className="text-muted-foreground">PC ăn trưa</span><span>{fmt(pl.phuCapAnTrua)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">PC xăng xe</span><span>{fmt(pl.phuCapXangXe)}</span></div>
            <Separator className="my-1"/>
            <div className="flex justify-between font-semibold"><span>Gross</span><span>{fmt(pl.tongThuNhap)}</span></div>
          </div>
          <div className="space-y-1">
            <p className="font-semibold text-red-600 mb-2">Khấu trừ (-)</p>
            <div className="flex justify-between"><span className="text-muted-foreground">BHXH (8%)</span><span className="text-red-600">-{fmt(pl.bhxhNhanVien)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">BHYT (1.5%)</span><span className="text-red-600">-{fmt(pl.bhytNhanVien)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">BHTN (1%)</span><span className="text-red-600">-{fmt(pl.bhtnNhanVien)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Thuế TNCN</span><span className="text-red-600">-{fmt(pl.thueTNCN)}</span></div>
            <Separator className="my-1"/>
            <div className="flex justify-between font-semibold"><span>Tổng trừ</span><span className="text-red-600">-{fmt(pl.tongBaoHiem + pl.thueTNCN)}</span></div>
          </div>
          <div className="space-y-1">
            <p className="font-semibold text-blue-700 mb-2">Thuế TNCN chi tiết</p>
            <div className="flex justify-between"><span className="text-muted-foreground">Giảm trừ bản thân</span><span>-{fmt(pl.giamTruBanThan)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Giảm trừ PT ({pl.nhanVien.soNguoiPhuThuoc} người)</span><span>-{fmt(pl.giamTruPhuThuoc)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Thu nhập tính thuế</span><span>{fmt(pl.thuNhapTinhThue)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Thuế TNCN phải nộp</span><span className="font-medium">{fmt(pl.thueTNCN)}</span></div>
            <Separator className="my-1"/>
            <div className="flex justify-between text-base font-bold text-green-700"><span>Lương thực lĩnh</span><span>{fmt(pl.luongThucLinh)}</span></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PayrollRunPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const ky = bangLuong[1]; // Tháng 03/2026 – nháp
  const phieuList = phieuLuongThang3;

  const tongGross = phieuList.reduce((s, p) => s + p.tongThuNhap, 0);
  const tongBH = phieuList.reduce((s, p) => s + p.tongBaoHiem, 0);
  const tongThue = phieuList.reduce((s, p) => s + p.thueTNCN, 0);
  const tongNet = phieuList.reduce((s, p) => s + p.luongThucLinh, 0);

  return (
    <DashboardLayout
      role="payroll_accountant"
      breadcrumbs={[{ label: "Tổng quan", href: "/payroll" }, { label: "Tính lương" }]}
    >
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Tính lương — {ky.tenKyLuong}</h1>
            <p className="text-muted-foreground">Kết quả tính lương chi tiết từng nhân viên</p>
          </div>
          <Badge className="px-4 py-2 text-sm bg-yellow-100 text-yellow-800 border border-yellow-300">Nháp — chưa phê duyệt</Badge>
        </div>

        {/* Tổng kết */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Tổng Gross", value: tongGross, color: "text-foreground" },
            { label: "Bảo hiểm NV đóng", value: tongBH, color: "text-orange-600" },
            { label: "Thuế TNCN phải nộp", value: tongThue, color: "text-red-600" },
            { label: "Tổng Net thực lĩnh", value: tongNet, color: "text-green-700 text-xl" },
          ].map((item) => (
            <Card key={item.label}>
              <CardContent className="pt-5">
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className={`font-bold mt-1 ${item.color}`}>{fmt(item.value)}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Biểu thuế lũy tiến */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Calculator className="h-4 w-4" /> Biểu thuế TNCN lũy tiến (áp dụng)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-7 gap-2 text-xs">
              {[
                { den: "5 triệu", thue: "5%" },
                { den: "10 triệu", thue: "10%" },
                { den: "18 triệu", thue: "15%" },
                { den: "32 triệu", thue: "20%" },
                { den: "52 triệu", thue: "25%" },
                { den: "80 triệu", thue: "30%" },
                { den: "Trên 80M", thue: "35%" },
              ].map((b, i) => (
                <div key={i} className="border rounded p-2 text-center">
                  <p className="text-muted-foreground">Bậc {i + 1}</p>
                  <p className="font-semibold text-primary">{b.thue}</p>
                  <p className="text-muted-foreground text-[10px]">đến {b.den}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Danh sách phiếu lương */}
        <div className="space-y-2">
          <h2 className="font-semibold text-lg">Chi tiết phiếu lương từng nhân viên</h2>
          {phieuList.map((pl) => (
            <PhieuRow key={pl.nhanVien.id} pl={pl} />
          ))}
        </div>

        <div className="flex gap-3 pt-4 border-t">
          <Button 
            className={isSubmitted ? "bg-green-600 hover:bg-green-600 opacity-100" : "bg-blue-600 hover:bg-blue-700"}
            onClick={() => setIsSubmitted(true)}
            disabled={isSubmitted}
          >
            {isSubmitted ? (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" /> Đã gửi phê duyệt Kế toán trưởng
              </>
            ) : "Gửi phê duyệt Kế toán trưởng"}
          </Button>
          <Button variant="outline">Xuất Excel</Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
