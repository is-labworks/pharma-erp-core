"use client";
import { DashboardLayout } from "@/components/dashboard-layout";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { CheckCircle2, XCircle, Clock, AlertCircle, UserCheck } from "lucide-react";
import Link from "next/link";
import { offers } from "@/lib/hr-mock-data";
import type { TrangThaiOffer } from "@/lib/hr-types";

const trangThaiConfig: Record<TrangThaiOffer, { label: string; color: string; icon: React.ElementType }> = {
  gui: { label: "Đã gửi – Chờ phản hồi", color: "bg-amber-100 text-amber-700 border-amber-200", icon: Clock },
  dong_y: { label: "Đồng ý", color: "bg-green-100 text-green-700 border-green-200", icon: CheckCircle2 },
  tu_choi: { label: "Từ chối", color: "bg-red-100 text-red-700 border-red-200", icon: XCircle },
};

export default function OffersPage() {
  const tongLuong = offers.filter((o) => o.trangThai === "dong_y").reduce((s, o) => s + o.tongLuong, 0);

  return (
    <DashboardLayout
      role="hr_manager"
      breadcrumbs={[{ label: "Quản lý Nhân sự", href: "/hr" }, { label: "Quản lý Offer" }]}
    >
      <div className="space-y-6">
        <PageHeader
          title="Quản lý Offer"
          description="Theo dõi offer, kiểm tra hồ sơ và chuyển đổi sang nhân viên mới"
        />

        <div className="grid gap-4 grid-cols-3">
          {(["gui", "dong_y", "tu_choi"] as TrangThaiOffer[]).map((ts) => {
            const cfg = trangThaiConfig[ts];
            const count = offers.filter((o) => o.trangThai === ts).length;
            const CfgIcon = cfg.icon;
            return (
              <Card key={ts} className="p-4 flex items-center gap-3">
                <CfgIcon className="h-8 w-8 text-muted-foreground" />
                <div>
                  <div className="text-2xl font-bold">{count}</div>
                  <div className="text-sm text-muted-foreground">{cfg.label.split("–")[0].trim()}</div>
                </div>
              </Card>
            );
          })}
        </div>

        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã Offer</TableHead>
                <TableHead>Ứng viên</TableHead>
                <TableHead>Vị trí</TableHead>
                <TableHead>Lương cơ bản</TableHead>
                <TableHead>Phụ cấp</TableHead>
                <TableHead>Tổng lương</TableHead>
                <TableHead>Ngày nhận việc</TableHead>
                <TableHead>Hạn trả lời</TableHead>
                <TableHead>Checklist hồ sơ</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {offers.map((o) => {
                const cfg = trangThaiConfig[o.trangThai];
                const CfgIcon = cfg.icon;
                const checklistOk = Object.values(o.checklistHoSo).every(Boolean);
                const missingCount = Object.values(o.checklistHoSo).filter((v) => !v).length;
                return (
                  <TableRow key={o.maOffer}>
                    <TableCell className="font-mono text-xs">{o.maOffer}</TableCell>
                    <TableCell className="font-medium">{o.tenUngVien}</TableCell>
                    <TableCell className="text-sm">
                      <div>{o.tenViTri}</div>
                      <div className="text-xs text-muted-foreground">{o.tenPhongBan}</div>
                    </TableCell>
                    <TableCell className="text-sm">{(o.mucLuongChinh / 1e6).toFixed(1)}tr</TableCell>
                    <TableCell className="text-sm">{(o.phuCap / 1e6).toFixed(1)}tr</TableCell>
                    <TableCell className="font-semibold text-primary">{(o.tongLuong / 1e6).toFixed(1)}tr</TableCell>
                    <TableCell className="text-sm">
                      {new Date(o.ngayNhanViec).toLocaleDateString("vi-VN")}
                    </TableCell>
                    <TableCell className="text-sm">
                      {new Date(o.hanTraLoi).toLocaleDateString("vi-VN")}
                    </TableCell>
                    <TableCell>
                      {checklistOk ? (
                        <Badge variant="outline" className="gap-1 text-green-700 border-green-300 bg-green-50 text-xs">
                          <CheckCircle2 className="h-3 w-3" />Đầy đủ
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="gap-1 text-orange-700 border-orange-300 bg-orange-50 text-xs">
                          <AlertCircle className="h-3 w-3" />Thiếu {missingCount} loại
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`gap-1 text-xs ${cfg.color}`}>
                        <CfgIcon className="h-3 w-3" />
                        {cfg.label.split("–")[0].trim()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {o.trangThai === "dong_y" && (
                        <Button size="sm" className="h-7 text-xs gap-1 bg-green-600 hover:bg-green-700">
                          <UserCheck className="h-3 w-3" />
                          {checklistOk ? "Tạo HĐ thử việc" : "Bổ sung hồ sơ"}
                        </Button>
                      )}
                      {o.ghiChu && (
                        <p className="text-xs text-muted-foreground mt-1 max-w-[140px] truncate" title={o.ghiChu}>{o.ghiChu}</p>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>

        {/* Note compliance */}
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold text-blue-800">Kiểm soát bắt buộc trước khi tạo Hợp đồng thử việc:</p>
              <ul className="mt-1 space-y-0.5 text-blue-700 list-disc list-inside">
                <li>CCCD/CMND còn hiệu lực</li>
                <li>Bằng cấp phù hợp vị trí (cao đẳng dược trở lên cho GMP)</li>
                <li>Giấy khám sức khỏe không quá 12 tháng</li>
                <li>Lý lịch tư pháp không vi phạm</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
