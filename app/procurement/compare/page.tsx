"use client"
import { DashboardLayout } from "@/components/dashboard-layout"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { quotations, suppliers } from "@/lib/mock-data"
import { CheckCircle, Star, Clock, CreditCard, Truck, Scale } from "lucide-react"
import { cn } from "@/lib/utils"

export default function CompareQuotationsPage() {
  const formatCurrency = (amount: number) => amount.toLocaleString("vi-VN") + " VNĐ"

  const getSupplier = (supplierId: string) => suppliers.find((s) => s.id === supplierId)

  // Find the best option for each criteria
  const lowestPrice = Math.min(...quotations.map((q) => q.totalAmount))
  const fastestDelivery = Math.min(...quotations.map((q) => q.deliveryTime))

  return (
    <DashboardLayout role="procurement" breadcrumbs={[{ label: "So sánh báo giá" }]}>
      <div className="space-y-6">
        <PageHeader
          title="So sánh báo giá"
          description="So sánh các báo giá từ nhà cung cấp để lựa chọn phương án tối ưu"
        />

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5" />
              RFQ-2026-0001 - Vỉ nhôm PVC/Alu
            </CardTitle>
            <CardDescription>So sánh 2 báo giá từ nhà cung cấp</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 lg:grid-cols-2">
              {quotations.map((quotation) => {
                const supplier = getSupplier(quotation.supplierId)
                const isBestPrice = quotation.totalAmount === lowestPrice
                const isFastestDelivery = quotation.deliveryTime === fastestDelivery

                return (
                  <Card
                    key={quotation.id}
                    className={cn("relative overflow-hidden", isBestPrice && "border-primary border-2")}
                  >
                    {isBestPrice && (
                      <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-medium rounded-bl-lg">
                        Giá tốt nhất
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{quotation.supplierName}</CardTitle>
                          <CardDescription className="mt-1">
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              {supplier?.rating.toFixed(1)} / 5
                            </div>
                          </CardDescription>
                        </div>
                        {supplier?.gmpCertificate && (
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            GMP
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="rounded-lg border p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground flex items-center gap-2">
                            <CreditCard className="h-4 w-4" />
                            Tổng giá trị
                          </span>
                          <span className={cn("text-xl font-bold", isBestPrice && "text-primary")}>
                            {formatCurrency(quotation.totalAmount)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground flex items-center gap-2">
                            <Truck className="h-4 w-4" />
                            Thời gian giao hàng
                          </span>
                          <span className={cn("font-medium", isFastestDelivery && "text-green-600")}>
                            {quotation.deliveryTime} ngày
                            {isFastestDelivery && <span className="text-xs ml-1">(Nhanh nhất)</span>}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            Điều kiện thanh toán
                          </span>
                          <span className="font-medium text-right max-w-[180px]">{quotation.paymentTerms}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Hiệu lực đến</span>
                          <span className="font-medium">
                            {new Date(quotation.validUntil).toLocaleDateString("vi-VN")}
                          </span>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-2">Chi tiết báo giá</h4>
                        <div className="rounded-lg border">
                          <table className="w-full text-sm">
                            <thead className="bg-muted/50">
                              <tr>
                                <th className="px-3 py-2 text-left font-medium">Vật tư</th>
                                <th className="px-3 py-2 text-right font-medium">SL</th>
                                <th className="px-3 py-2 text-right font-medium">Đơn giá</th>
                                <th className="px-3 py-2 text-right font-medium">Thành tiền</th>
                              </tr>
                            </thead>
                            <tbody>
                              {quotation.items.map((item, index) => (
                                <tr key={index} className="border-t">
                                  <td className="px-3 py-2">Vỉ nhôm PVC/Alu</td>
                                  <td className="px-3 py-2 text-right">{item.quantity}</td>
                                  <td className="px-3 py-2 text-right">{formatCurrency(item.unitPrice)}</td>
                                  <td className="px-3 py-2 text-right font-medium">
                                    {formatCurrency(item.totalPrice)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <Button className="w-full">
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Chọn nhà cung cấp này
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bảng so sánh tổng hợp</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">Tiêu chí</th>
                    {quotations.map((q) => (
                      <th key={q.id} className="px-4 py-3 text-center font-medium">
                        {q.supplierName.split(" ").slice(0, 3).join(" ")}...
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t">
                    <td className="px-4 py-3 font-medium">Tổng giá trị</td>
                    {quotations.map((q) => (
                      <td
                        key={q.id}
                        className={cn(
                          "px-4 py-3 text-center",
                          q.totalAmount === lowestPrice && "text-primary font-bold",
                        )}
                      >
                        {formatCurrency(q.totalAmount)}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-t">
                    <td className="px-4 py-3 font-medium">Thời gian giao hàng</td>
                    {quotations.map((q) => (
                      <td
                        key={q.id}
                        className={cn(
                          "px-4 py-3 text-center",
                          q.deliveryTime === fastestDelivery && "text-green-600 font-bold",
                        )}
                      >
                        {q.deliveryTime} ngày
                      </td>
                    ))}
                  </tr>
                  <tr className="border-t">
                    <td className="px-4 py-3 font-medium">Điều kiện thanh toán</td>
                    {quotations.map((q) => (
                      <td key={q.id} className="px-4 py-3 text-center">
                        {q.paymentTerms}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-t">
                    <td className="px-4 py-3 font-medium">Đánh giá NCC</td>
                    {quotations.map((q) => {
                      const supplier = getSupplier(q.supplierId)
                      return (
                        <td key={q.id} className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            {supplier?.rating.toFixed(1)}
                          </div>
                        </td>
                      )
                    })}
                  </tr>
                  <tr className="border-t">
                    <td className="px-4 py-3 font-medium">Chứng nhận GMP</td>
                    {quotations.map((q) => {
                      const supplier = getSupplier(q.supplierId)
                      return (
                        <td key={q.id} className="px-4 py-3 text-center">
                          {supplier?.gmpCertificate ? (
                            <Badge variant="outline" className="text-green-600">
                              Có
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-muted-foreground">
                              Không
                            </Badge>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
