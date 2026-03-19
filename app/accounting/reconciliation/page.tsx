"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileSpreadsheet } from "lucide-react"

export default function DocumentReconciliationPage() {
  return (
    <DashboardLayout breadcrumbs={[{ label: "Đối chiếu chứng từ" }]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Đối chiếu chứng từ</h1>
          <p className="text-muted-foreground">Kiểm tra và đối chiếu các chứng từ kế toán, hóa đơn, và phiếu nhập kho.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5" />
              Công cụ đối chiếu (Đang phát triển)
            </CardTitle>
            <CardDescription>Chức năng này đang trong quá trình xây dựng.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center p-12 text-center border rounded-lg bg-muted/10 border-dashed">
              <p className="text-muted-foreground">Hệ thống đang cập nhật module đối chiếu chứng từ tự động.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
