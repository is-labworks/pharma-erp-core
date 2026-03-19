"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calculator } from "lucide-react"

export default function SupplierPayablesPage() {
  return (
    <DashboardLayout breadcrumbs={[{ label: "Công nợ nhà cung cấp" }]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Công nợ nhà cung cấp</h1>
          <p className="text-muted-foreground">Quản lý và theo dõi công nợ với các nhà cung cấp.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Tình trạng công nợ (Đang phát triển)
            </CardTitle>
            <CardDescription>Chức năng này đang trong quá trình xây dựng.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center p-12 text-center border rounded-lg bg-muted/10 border-dashed">
              <p className="text-muted-foreground">Chưa có dữ liệu công nợ.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
