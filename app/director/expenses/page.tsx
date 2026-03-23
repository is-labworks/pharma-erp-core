"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell, LineChart, Line 
} from "recharts";
import { Download, TrendingDown, TrendingUp, AlertTriangle, ShieldCheck, Info } from "lucide-react";
import { 
  ytdMetrics, 
  spendTrends, 
  spendByMaterial, 
  topSuppliers,
  expenseByDepartment 
} from "@/lib/director-mock-data";

function fmt(n: number) { 
  return new Intl.NumberFormat("vi-VN", { notation: "compact", maximumFractionDigits: 1 }).format(n);
}

function fmtCurrency(n: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border rounded shadow-md text-sm">
        <p className="font-semibold mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.name}: {entry.value.toLocaleString()} Tr
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function DirectorExpensesPage() {
  return (
    <DashboardLayout
      role="director"
      breadcrumbs={[{ label: "Tổng quan", href: "/director/overview" }, { label: "Phân tích Chi phí Mua hàng" }]}
    >
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Phân tích Chi phí Mua hàng</h1>
            <p className="text-muted-foreground">Khai thác dữ liệu mua sắm chiến lược: API, Tá dược, Bao bì & Phân tích NCC</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-2" /> PDF Report</Button>
            <Button className="bg-blue-600 hover:bg-blue-700" size="sm">Export Data</Button>
          </div>
        </div>

        {/* Tổng quan KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                Tổng Chi Mua sắm (YTD) <Info className="h-4 w-4 text-muted-foreground/50" />
              </p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-bold">{fmt(ytdMetrics.totalSpend)}</span>
                <span className="text-sm font-medium text-muted-foreground">VND</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Lũy kế từ đầu năm</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <p className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                Tỷ trọng Chi tiêu API <Info className="h-4 w-4 text-muted-foreground/50" />
              </p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-blue-600">{ytdMetrics.apiPercentage}%</span>
              </div>
              <div className="flex items-center gap-1 mt-1 text-xs text-green-600 font-medium">
                <TrendingDown className="h-3 w-3" />
                <span>Giảm 1.2% so với ngân sách</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <p className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                Chi phí Tiết kiệm (Cost Savings) <Info className="h-4 w-4 text-muted-foreground/50" />
              </p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-green-600">{fmt(ytdMetrics.totalSavings)}</span>
              </div>
              <div className="flex items-center gap-1 mt-1 text-xs text-green-600 font-medium">
                <TrendingUp className="h-3 w-3" />
                <span>+8% so với cùng kỳ năm ngoái</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <p className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                Tỷ lệ Hoàn thành Ngân sách <Info className="h-4 w-4 text-muted-foreground/50" />
              </p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className={`text-3xl font-bold ${ytdMetrics.budgetCompletion > 100 ? "text-red-600" : "text-slate-800"}`}>
                  {ytdMetrics.budgetCompletion}%
                </span>
              </div>
              <div className="h-2 w-full bg-secondary mt-3 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${ytdMetrics.budgetCompletion > 100 ? "bg-red-500" : "bg-blue-600"}`} 
                  style={{ width: `${Math.min(ytdMetrics.budgetCompletion, 100)}%` }}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Biểu đồ phân tích */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Xu hướng Chi mua sắm theo tháng</CardTitle>
              <CardDescription>Thực tế (Actual) vs Ngân sách (Budget) - Đơn vị: Triệu VND</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={spendTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                    <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value / 1000}k`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend iconType="circle" />
                    <Bar dataKey="actual" name="Thực tế" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="budget" name="Ngân sách" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cơ cấu Chi phí theo Loại Vật tư</CardTitle>
              <CardDescription>Tỷ trọng phân bổ chi ngân sách năm nay</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row items-center gap-4 h-[300px]">
                <div className="w-full md:w-1/2 h-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={spendByMaterial}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {spendByMaterial.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => `${value.toLocaleString()} Tr`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-full md:w-1/2 space-y-3">
                  {spendByMaterial.map((item, index) => {
                    const total = spendByMaterial.reduce((s, d) => s + d.value, 0);
                    const pct = Math.round((item.value / total) * 100);
                    return (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="font-medium">{item.name}</span>
                        </div>
                        <span className="text-muted-foreground">{pct}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top 5 Nhà cung cấp & Cost by Dept */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Top 5 Nhà cung cấp Trọng điểm</CardTitle>
              <CardDescription>Chiếm {topSuppliers.reduce((s, d) => s + d.percentage, 0).toFixed(1)}% tổng ngân sách mua hàng</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-muted-foreground text-left">
                      <th className="py-3 font-medium">Nhà cung cấp</th>
                      <th className="py-3 font-medium">Nhóm vật tư</th>
                      <th className="py-3 font-medium text-right">Giá trị & Tỷ trọng</th>
                      <th className="py-3 font-medium text-right">Rủi ro Supply</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topSuppliers.map((sup, idx) => (
                      <tr key={sup.id} className="border-b last:border-0 hover:bg-muted/30">
                        <td className="py-3">
                          <p className="font-semibold">{sup.name}</p>
                          <p className="text-xs text-muted-foreground">{sup.id}</p>
                        </td>
                        <td className="py-3">
                          <Badge variant="outline" className="font-normal">{sup.category}</Badge>
                        </td>
                        <td className="py-3 text-right">
                          <p className="font-semibold">{fmtCurrency(sup.spend)}</p>
                          <div className="flex items-center justify-end gap-2 mt-1">
                            <span className="text-xs text-muted-foreground">{sup.percentage}%</span>
                            <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                              <div className="h-full bg-blue-600" style={{ width: `${sup.percentage}%` }} />
                            </div>
                          </div>
                        </td>
                        <td className="py-3 text-right">
                          <Badge 
                            variant="secondary" 
                            className={`
                              ${sup.riskLevel === 'Low' ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''}
                              ${sup.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' : ''}
                              ${sup.riskLevel === 'High' ? 'bg-red-100 text-red-800 hover:bg-red-100' : ''}
                            `}
                          >
                            {sup.riskLevel === 'Low' && <ShieldCheck className="w-3 h-3 mr-1" />}
                            {sup.riskLevel === 'High' && <AlertTriangle className="w-3 h-3 mr-1" />}
                            {sup.riskLevel}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Chi phí NVL theo khối</CardTitle>
              <CardDescription>Phân bổ vật tư xuất dùng</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 pt-2">
                {expenseByDepartment.map((dept, index) => {
                  const max = expenseByDepartment[0].spend;
                  const pct = (dept.spend / max) * 100;
                  return (
                    <div key={index}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-slate-700">{dept.name}</span>
                        <span className="font-bold">{fmt(dept.spend)}</span>
                      </div>
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
