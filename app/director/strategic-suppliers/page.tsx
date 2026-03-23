"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ZAxis
} from "recharts";
import { Download, AlertCircle, ShieldCheck, Truck, Star, Info } from "lucide-react";
import { 
  supplierKPIs, 
  supplierScorecard, 
  coreApiSourcing, 
  supplierRiskMatrix 
} from "@/lib/director-mock-data";

export default function StrategicSuppliersPage() {
  return (
    <DashboardLayout
      role="director"
      breadcrumbs={[{ label: "Tổng quan", href: "/director/overview" }, { label: "Nhà cung cấp Chiến lược" }]}
    >
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Quản trị Nhà cung cấp & Rủi ro chuỗi cung ứng</h1>
            <p className="text-muted-foreground">Đánh giá hiệu suất NCC định kỳ, tỷ lệ giao hàng OTIF, và phân bổ nguồn cung API cốt lõi.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-2" /> PDF Report</Button>
          </div>
        </div>

        {/* Tổng quan KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                NCC Chiến lược (Core Vendors) <Info className="h-4 w-4 text-muted-foreground/50" />
              </p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-slate-800">{supplierKPIs.activeStrategic}</span>
                <span className="text-sm font-medium text-muted-foreground">Đối tác</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Quản lý 80% tổng giá trị mua sắm</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <p className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                Tỷ lệ OTIF (On-Time In-Full) <Truck className="h-4 w-4 text-muted-foreground/50" />
              </p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-green-600">{supplierKPIs.otifRate}%</span>
              </div>
              <div className="h-2 w-full bg-secondary mt-3 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: `${supplierKPIs.otifRate}%` }} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <p className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                Tỷ lệ Đạt QA/QC Đầu vào <ShieldCheck className="h-4 w-4 text-muted-foreground/50" />
              </p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-blue-600">{supplierKPIs.qualityPassRate}%</span>
              </div>
              <div className="h-2 w-full bg-secondary mt-3 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${supplierKPIs.qualityPassRate}%` }} />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-red-50 border-red-200">
            <CardContent className="pt-6">
              <p className="text-sm font-medium text-red-800 flex items-center justify-between">
                Rủi ro Độc quyền API <AlertCircle className="h-4 w-4 text-red-600/70" />
              </p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-red-700">{supplierKPIs.singleSourceApis}</span>
                <span className="text-sm font-medium text-red-600">Hoạt chất chính</span>
              </div>
              <p className="text-xs text-red-600 mt-1 font-medium">Cảnh báo: Chỉ có 1 NCC duy nhất</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Ma trận Rủi ro Nguồn cung (Supply Risk Matrix)</CardTitle>
              <CardDescription>Trục X: Tỷ trọng Chi tiêu (Spend) - Trục Y: Mức độ rủi ro đứt gãy</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis type="number" dataKey="spend" name="Tỷ trọng chi tiêu (%)" unit="%" tickLine={false} />
                    <YAxis type="number" dataKey="risk" name="Rủi ro đứt gãy" unit="%" tickLine={false} />
                    <ZAxis type="category" dataKey="name" name="NCC" />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} 
                             formatter={(value, name) => [value + '%', name === 'spend' ? 'Spend' : 'Risk']} 
                             labelFormatter={(label) => ''} 
                    />
                    <Scatter data={supplierRiskMatrix} fill="#8884d8">
                      {supplierRiskMatrix.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.warning ? "#ef4444" : "#3b82f6"} />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
              <div className="flex gap-4 justify-center mt-2 text-xs">
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-blue-500" /> Rủi ro chấp nhận được</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-500" /> Cảnh báo đỏ (Cần backup)</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Phân bổ Nguồn cung API Cốt lõi (Vendor Backup)</CardTitle>
              <CardDescription>Đánh giá tỷ lệ phụ thuộc nhà cung cấp (Tránh rủi ro Single-Source)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {coreApiSourcing.map((item, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="font-semibold text-sm flex items-center gap-2">
                          {item.api}
                          {item.vendors.length === 1 && <AlertCircle className="w-4 h-4 text-red-500" />}
                        </p>
                        <p className="text-xs text-muted-foreground">Sản lượng năm: {item.totalVol}</p>
                      </div>
                      <div className="text-xs font-medium text-muted-foreground">
                        {item.vendors.length} NCC
                      </div>
                    </div>
                    
                    <div className="h-4 w-full bg-muted rounded-full overflow-hidden flex">
                      {item.vendors.map((v, idx) => (
                        <div 
                          key={idx} 
                          title={`${v.name}: ${v.share}%`}
                          className="h-full flex items-center justify-center text-[10px] text-white font-bold" 
                          style={{ width: `${v.share}%`, backgroundColor: v.color }}
                        >
                          {v.share > 15 ? `${v.name} (${v.share}%)` : ""}
                        </div>
                      ))}
                    </div>
                    {item.vendors.length === 1 && (
                      <p className="text-xs text-red-600 font-medium italic">Không có nhà cung cấp dự phòng. Nguy cơ thiếu hụt cao nếu đứt gãy chuỗi cung ứng.</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Bảng Điểm Đánh giá Nhà cung cấp (Supplier Scorecard)</CardTitle>
            <CardDescription>Đánh giá định kỳ dựa trên Chất lượng, Giao hàng (OTIF), Giá hợp đồng và Dịch vụ hỗ trợ.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-muted-foreground text-left bg-muted/20">
                    <th className="py-3 px-4 font-medium rounded-tl-lg">Nhà cung cấp</th>
                    <th className="py-3 px-4 font-medium">Nhóm</th>
                    <th className="py-3 px-4 text-center font-medium">Chất lượng (40%)</th>
                    <th className="py-3 px-4 text-center font-medium">Giao hàng (30%)</th>
                    <th className="py-3 px-4 text-center font-medium">Giá cả (20%)</th>
                    <th className="py-3 px-4 text-center font-medium">Hỗ trợ (10%)</th>
                    <th className="py-3 px-4 text-center font-medium bg-blue-50/50">Điểm Tổng hợp</th>
                    <th className="py-3 px-4 text-center font-medium rounded-tr-lg">Phân hạng</th>
                  </tr>
                </thead>
                <tbody>
                  {supplierScorecard.map((sup) => (
                    <tr key={sup.id} className="border-b last:border-0 hover:bg-muted/10">
                      <td className="py-3 px-4">
                        <p className="font-semibold text-slate-800">{sup.name}</p>
                        <p className="text-xs text-muted-foreground">{sup.id}</p>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline" className="font-normal">{sup.category}</Badge>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`font-medium ${sup.quality < 90 ? 'text-red-500' : 'text-slate-700'}`}>{sup.quality}</span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`font-medium ${sup.delivery < 90 ? 'text-orange-500' : 'text-slate-700'}`}>{sup.delivery}</span>
                      </td>
                      <td className="py-3 px-4 text-center">{sup.cost}</td>
                      <td className="py-3 px-4 text-center">{sup.service}</td>
                      <td className="py-3 px-4 text-center bg-blue-50/20">
                        <div className="flex items-center justify-center gap-1 font-bold text-blue-700">
                          {sup.overall} 
                          {sup.overall >= 90 && <Star className="w-3 h-3 fill-yellow-400 text-yellow-500" />}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Badge 
                          className={`
                            ${sup.status === 'Preferred' ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''}
                            ${sup.status === 'Approved' ? 'bg-blue-100 text-blue-800 hover:bg-blue-100' : ''}
                            ${sup.status === 'Watchlist' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' : ''}
                          `}
                          variant="secondary"
                        >
                          {sup.status}
                        </Badge>
                      </td>
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
