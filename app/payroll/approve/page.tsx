"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, AlertCircle, ChevronRight } from "lucide-react";
import { bangLuong } from "@/lib/payroll-mock-data";
import type { BangLuong } from "@/lib/payroll-types";
import { useAuth } from "@/lib/auth-context";

const statusMap: Record<number, { label: string; color: string; bgColor: string }> = {
  0: { label: "Nháp", color: "text-yellow-700", bgColor: "bg-yellow-50 border-yellow-200" },
  1: { label: "Đã phê duyệt KTT", color: "text-blue-700", bgColor: "bg-blue-50 border-blue-200" },
  2: { label: "Đã thanh toán", color: "text-green-700", bgColor: "bg-green-50 border-green-200" },
};

type Step = { label: string; role: string; date?: string; done: boolean; current: boolean; key: "nguoiTao" | "nguoiDuyet" | "nguoiGiamDoc" };

function getSteps(ky: BangLuong): Step[] {
  return [
    {
      label: "Kế toán lập bảng lương",
      role: "Kế toán Tiền lương",
      date: ky.ngayChotLuong,
      done: ky.trangThai >= 0,
      current: ky.trangThai === 0,
      key: "nguoiTao",
    },
    {
      label: "Kế toán trưởng phê duyệt",
      role: "Kế toán trưởng",
      date: ky.ngayDuyet,
      done: ky.trangThai >= 1,
      current: ky.trangThai === 1,
      key: "nguoiDuyet",
    },
    {
      label: "Giám đốc ký duyệt & Thanh toán",
      role: "Ban Giám đốc",
      date: ky.ngayGiamDocDuyet,
      done: ky.trangThai === 2,
      current: false,
      key: "nguoiGiamDoc",
    },
  ];
}

export default function PayrollApprovePage() {
  const { user } = useAuth();
  const [kyList, setKyList] = useState(bangLuong);

  const handleApprove = (id: number) => {
    setKyList((prev) =>
      prev.map((k) =>
        k.id === id && k.trangThai < 2
          ? {
              ...k,
              trangThai: (k.trangThai + 1) as 0 | 1 | 2,
              nguoiDuyet: k.trangThai === 0 ? "Trần Kế Toán Trưởng" : k.nguoiDuyet,
              ngayDuyet: k.trangThai === 0 ? new Date().toISOString().split("T")[0] : k.ngayDuyet,
              nguoiGiamDoc: k.trangThai === 1 ? "Nguyễn Văn Giám Đốc" : k.nguoiGiamDoc,
              ngayGiamDocDuyet: k.trangThai === 1 ? new Date().toISOString().split("T")[0] : k.ngayGiamDocDuyet,
            }
          : k
      )
    );
  };

  const handleReject = (id: number) => {
    setKyList((prev) =>
      prev.map((k) =>
        k.id === id ? { ...k, ghiChu: "Đã từ chối — cần điều chỉnh lại" } : k
      )
    );
  };

  return (
    <DashboardLayout
      role={user?.role as any || "payroll_accountant"}
      breadcrumbs={[{ label: "Tổng quan", href: "/payroll" }, { label: "Phê duyệt" }]}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quy trình Phê duyệt Lương</h1>
          <p className="text-muted-foreground">Kiểm soát đa cấp: Kế toán → Kế toán trưởng → Giám đốc</p>
        </div>

        {kyList.map((ky) => {
          const steps = getSteps(ky);
          const st = statusMap[ky.trangThai];
          return (
            <Card key={ky.id} className={`border-2 ${st.bgColor}`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{ky.tenKyLuong}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Ngày chốt: {new Date(ky.ngayChotLuong).toLocaleDateString("vi-VN")}
                      {ky.nguoiTao && ` · Người lập: ${ky.nguoiTao}`}
                    </p>
                    {ky.ghiChu && (
                      <p className="text-sm text-muted-foreground italic mt-1">{ky.ghiChu}</p>
                    )}
                  </div>
                  <Badge className={`px-3 py-1 ${st.color} border`}>{st.label}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                {/* Approval Timeline */}
                <div className="flex items-center gap-2 mb-6">
                  {steps.map((step, i) => (
                    <div key={i} className="flex items-center gap-2 flex-1">
                      <div className="flex flex-col items-center min-w-0 flex-1">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${step.done ? "bg-green-500 border-green-500 text-white" : step.current ? "bg-yellow-400 border-yellow-400 text-white" : "bg-muted border-muted-foreground/30 text-muted-foreground"}`}>
                          {step.done ? <CheckCircle2 className="h-5 w-5" /> : step.current ? <Clock className="h-5 w-5" /> : <span className="text-xs font-bold">{i + 1}</span>}
                        </div>
                        <p className={`text-xs mt-1 text-center font-medium ${step.done ? "text-green-700" : step.current ? "text-yellow-700" : "text-muted-foreground"}`}>{step.label}</p>
                        <p className="text-xs text-muted-foreground text-center">{step.role}</p>
                        {step.done && step.date && (
                          <p className="text-xs text-muted-foreground mt-0.5">{new Date(step.date).toLocaleDateString("vi-VN")}</p>
                        )}
                        {step.done && ky[step.key] && (
                          <p className="text-xs text-green-700 font-medium">{ky[step.key]}</p>
                        )}
                      </div>
                      {i < steps.length - 1 && (
                        <ChevronRight className={`h-5 w-5 shrink-0 ${steps[i + 1].done || steps[i + 1].current ? "text-primary" : "text-muted-foreground/30"}`} />
                      )}
                    </div>
                  ))}
                </div>

                {/* Action buttons */}
                {ky.trangThai < 2 && (
                  <div className="flex gap-3 pt-4 border-t">
                    <Button
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleApprove(ky.id)}
                      disabled={
                        (ky.trangThai === 0 && user?.role !== "accounting" && user?.role !== "director") ||
                        (ky.trangThai === 1 && user?.role !== "director")
                      }
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      {ky.trangThai === 0 ? "Kế toán trưởng Duyệt" : "Giám đốc Ký duyệt & Thanh toán"}
                    </Button>
                    <Button 
                      variant="outline" 
                      className="text-red-600" 
                      onClick={() => handleReject(ky.id)}
                      disabled={
                        (ky.trangThai === 0 && user?.role !== "accounting" && user?.role !== "director") ||
                        (ky.trangThai === 1 && user?.role !== "director")
                      }
                    >
                      <AlertCircle className="h-4 w-4 mr-2" /> Từ chối
                    </Button>
                  </div>
                )}

                {ky.trangThai === 2 && (
                  <div className="flex items-center gap-2 pt-4 border-t text-green-700 font-medium text-sm">
                    <CheckCircle2 className="h-5 w-5" />
                    Đã thanh toán lương thành công — Sẵn sàng xuất file ngân hàng
                    <Button size="sm" variant="outline" className="ml-auto">Xuất file ngân hàng</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
