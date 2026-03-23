"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, XCircle, AlertTriangle, ShieldCheck, ShoppingCart, MessageSquare, Clock, ArrowRight } from "lucide-react";
import { highValueApprovals } from "@/lib/director-mock-data";

function fmtCurrency(n: number) {
  if (n === 0) return "N/A";
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);
}

export default function HighValueApprovalsPage() {
  const [approvals, setApprovals] = useState(highValueApprovals);

  const handleAction = (id: string, newStatus: string) => {
    setApprovals(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
  };

  const pendingCount = approvals.filter(a => a.status === "Pending").length;
  const poCount = approvals.filter(a => a.type === "PO" && a.status === "Pending").length;
  const vendorCount = approvals.filter(a => a.type === "VENDOR" && a.status === "Pending").length;
  const riskCount = approvals.filter(a => a.type === "RISK" && a.status === "Pending").length;

  const renderApprovalCard = (item: any) => (
    <Card key={item.id} className={`border-l-4 ${
      item.urgency === 'Critical' ? 'border-l-red-500' : 
      item.urgency === 'High' ? 'border-l-orange-500' : 
      'border-l-blue-500'
    }`}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-mono text-xs">{item.id}</Badge>
              {item.type === "PO" && <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-0"><ShoppingCart className="w-3 h-3 mr-1"/> Mua sắm lớn</Badge>}
              {item.type === "VENDOR" && <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100 border-0"><ShieldCheck className="w-3 h-3 mr-1"/> Duyệt NCC</Badge>}
              {item.type === "RISK" && <Badge className="bg-red-100 text-red-800 hover:bg-red-100 border-0"><AlertTriangle className="w-3 h-3 mr-1"/> Xử lý Rủi ro</Badge>}
              
              {item.urgency === "Critical" && <Badge variant="destructive" className="animate-pulse">Khẩn cấp (Sản xuất Đình trệ)</Badge>}
              {item.urgency === "High" && <Badge variant="secondary" className="bg-orange-100 text-orange-800 border-orange-200">Ưu tiên cao</Badge>}
            </div>
            <CardTitle className="text-lg pt-1">{item.title}</CardTitle>
            <CardDescription className="flex items-center gap-2 pt-1">
              <span>Đề xuất từ: <span className="font-medium text-slate-700">{item.department}</span></span>
              <span>•</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {item.date}</span>
            </CardDescription>
          </div>
          {item.status !== "Pending" && (
            <Badge className={item.status === "Approved" ? "bg-green-500" : "bg-red-500"}>
              {item.status === "Approved" ? "Đã Phê Duyệt" : "Đã Từ Chối"}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="bg-muted/30 p-4 rounded-lg text-sm mb-4">
          <span className="font-semibold block mb-1">Nội dung trình duyệt:</span>
          {item.description}
        </div>
        
        {item.type !== "VENDOR" && (
          <div className="grid grid-cols-2 gap-4 text-sm mt-4 border-t pt-4">
            <div>
              <p className="text-muted-foreground mb-1">Tổng Giá Trị / Chi phí phát sinh</p>
              <p className="font-bold text-lg text-slate-800">{fmtCurrency(item.value)}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Tình trạng Ngân sách (Budget)</p>
              <p className={`font-semibold ${
                item.budgetStatus.includes("Trong") ? "text-green-600" : "text-red-500"
              }`}>{item.budgetStatus}</p>
            </div>
          </div>
        )}
      </CardContent>
      {item.status === "Pending" && (
        <CardFooter className="flex justify-between border-t bg-muted/10 pt-4">
          <Button variant="outline" className="text-slate-600"><MessageSquare className="w-4 h-4 mr-2" /> Yêu cầu giải trình thêm</Button>
          <div className="flex gap-2">
            <Button variant="outline" className="text-red-600 hover:bg-red-50 hover:text-red-700" onClick={() => handleAction(item.id, "Rejected")}>
              <XCircle className="w-4 h-4 mr-2" /> Từ chối
            </Button>
            <Button className="bg-green-600 hover:bg-green-700" onClick={() => handleAction(item.id, "Approved")}>
              <CheckCircle2 className="w-4 h-4 mr-2" /> Phê duyệt (Ký số)
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );

  return (
    <DashboardLayout
      role="director"
      breadcrumbs={[{ label: "Tổng quan", href: "/director/overview" }, { label: "Phê duyệt Cấp cao" }]}
    >
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Phê duyệt Cấp cao của Ban Giám đốc</h1>
            <p className="text-muted-foreground">Ký duyệt Hợp đồng lớn, Mở mã Nhà cung cấp, và Quyết định Xử lý Rủi ro Chuỗi cung ứng.</p>
          </div>
          <Badge className="px-3 py-1 text-sm bg-blue-100 text-blue-800 border-blue-200" variant="outline">
            Chờ xử lý: {pendingCount} phiếu
          </Badge>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="all">Tất cả ({pendingCount})</TabsTrigger>
            <TabsTrigger value="po" className="flex gap-2">
              <ShoppingCart className="w-4 h-4" /> Mua số lượng lớn ({poCount})
            </TabsTrigger>
            <TabsTrigger value="vendor" className="flex gap-2">
              <ShieldCheck className="w-4 h-4" /> Đánh giá NCC mới ({vendorCount})
            </TabsTrigger>
            <TabsTrigger value="risk" className="flex gap-2">
              <AlertTriangle className="w-4 h-4" /> Xử lý Rủi ro ({riskCount})
            </TabsTrigger>
            <TabsTrigger value="history">Đã xử lý</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {approvals.filter(a => a.status === "Pending").map(renderApprovalCard)}
            {pendingCount === 0 && <p className="text-center py-10 text-muted-foreground">Bạn không có tờ trình nào chờ phê duyệt.</p>}
          </TabsContent>

          <TabsContent value="po" className="space-y-4">
            {approvals.filter(a => a.type === "PO" && a.status === "Pending").map(renderApprovalCard)}
            {poCount === 0 && <p className="text-center py-10 text-muted-foreground">Không có tờ trình mua sắm nào chờ duyệt.</p>}
          </TabsContent>

          <TabsContent value="vendor" className="space-y-4">
            {approvals.filter(a => a.type === "VENDOR" && a.status === "Pending").map(renderApprovalCard)}
            {vendorCount === 0 && <p className="text-center py-10 text-muted-foreground">Không có tờ trình cấp phép NCC nào.</p>}
          </TabsContent>

          <TabsContent value="risk" className="space-y-4">
            {approvals.filter(a => a.type === "RISK" && a.status === "Pending").map(renderApprovalCard)}
            {riskCount === 0 && <p className="text-center py-10 text-muted-foreground">Hệ thống chuỗi cung ứng đang hoạt động ổn định.</p>}
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            {approvals.filter(a => a.status !== "Pending").map(renderApprovalCard)}
            {approvals.filter(a => a.status !== "Pending").length === 0 && <p className="text-center py-10 text-muted-foreground">Chưa có lịch sử phê duyệt.</p>}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
