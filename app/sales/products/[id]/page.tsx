"use client";
import { DashboardLayout } from "@/components/dashboard-layout";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { medicines } from "@/lib/mock-data";
import { productPrices, inventoryBatches } from "@/lib/sales-mock-data";
import { Package, DollarSign, AlertCircle } from "lucide-react";
import { notFound } from "next/navigation";

export default function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const product = medicines.find((m) => m.id === params.id);

  if (!product) {
    return notFound();
  }

  const productPriceList = productPrices.filter(
    (p) => p.medicineId === product.id,
  );

  return (
    <DashboardLayout
      role="sales_staff"
      breadcrumbs={[
        { label: "Kinh doanh", href: "/sales" },
        { label: "Sản phẩm", href: "/sales/products" },
        { label: product.name },
      ]}
    >
      <div className="space-y-6">
        <PageHeader
          title={product.name}
          description={`Mã SP: ${product.code} • ${product.description}`}
        />

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Loại thuốc
                </p>
                <h3 className="text-xl font-bold mt-1 capitalize">
                  {product.type === "tablet"
                    ? "Viên nén"
                    : product.type === "capsule"
                      ? "Viên nang"
                      : product.type === "syrup"
                        ? "Xi-rô"
                        : product.type}
                </h3>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Liều lượng
                </p>
                <h3 className="text-xl font-bold mt-1">{product.dosage}</h3>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Đơn vị tính
                </p>
                <h3 className="text-xl font-bold mt-1">{product.unit}</h3>
              </div>
            </div>
          </Card>
        </div>

        <Tabs defaultValue="pricing" className="space-y-4">
          <TabsList>
            <TabsTrigger value="pricing">Bảng giá</TabsTrigger>
            <TabsTrigger value="inventory">Tồn kho</TabsTrigger>
            <TabsTrigger value="formula">Công thức</TabsTrigger>
          </TabsList>

          <TabsContent value="pricing" className="space-y-4">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">
                Giá bán theo loại khách hàng
              </h3>
              <div className="space-y-4">
                {productPriceList.map((price) => (
                  <div
                    key={price.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">
                        {price.customerCategory === "pharmacy"
                          ? "Nhà thuốc"
                          : price.customerCategory === "hospital"
                            ? "Bệnh viện"
                            : "Đại lý"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Hiệu lực từ:{" "}
                        {new Date(price.effectiveFrom).toLocaleDateString(
                          "vi-VN",
                        )}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">
                        {price.unitPrice.toLocaleString("vi-VN")} VNĐ
                      </p>
                      {price.discountPercent > 0 && (
                        <Badge variant="outline" className="mt-1 bg-green-50">
                          Giảm {price.discountPercent}%
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="inventory" className="space-y-4">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Tồn kho theo lô</h3>
              <div className="space-y-4">
                {inventoryBatches.map((batch) => {
                  const daysToExpiry = Math.floor(
                    (new Date(batch.expiryDate).getTime() -
                      new Date().getTime()) /
                      (1000 * 60 * 60 * 24),
                  );
                  const isExpiringSoon = daysToExpiry < 180;

                  return (
                    <div
                      key={batch.id}
                      className={`p-4 border rounded-lg ${
                        isExpiringSoon
                          ? "border-orange-200 bg-orange-50 dark:bg-orange-950"
                          : ""
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">
                              Lô {batch.batchNumber}
                            </h4>
                            <Badge
                              variant={
                                batch.status === "available"
                                  ? "outline"
                                  : "secondary"
                              }
                            >
                              {batch.status === "available"
                                ? "Sẵn sàng"
                                : batch.status === "reserved"
                                  ? "Đã đặt"
                                  : batch.status === "expired"
                                    ? "Hết hạn"
                                    : "Thu hồi"}
                            </Badge>
                            {isExpiringSoon && (
                              <Badge variant="outline" className="bg-orange-50">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                Sắp hết hạn
                              </Badge>
                            )}
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                            <div>
                              <p className="text-xs text-muted-foreground">
                                Số lượng
                              </p>
                              <p className="text-sm font-medium">
                                {batch.quantity.toLocaleString("vi-VN")}{" "}
                                {product.unit}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">
                                Vị trí
                              </p>
                              <p className="text-sm font-medium">
                                {batch.location}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">
                                NSX
                              </p>
                              <p className="text-sm font-medium">
                                {new Date(
                                  batch.manufactureDate,
                                ).toLocaleDateString("vi-VN")}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">
                                HSD
                              </p>
                              <p className="text-sm font-medium">
                                {new Date(batch.expiryDate).toLocaleDateString(
                                  "vi-VN",
                                )}
                              </p>
                              {daysToExpiry > 0 && (
                                <p className="text-xs text-orange-600">
                                  Còn {daysToExpiry} ngày
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="formula" className="space-y-4">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Thành phần công thức</h3>
              {product.materials && product.materials.length > 0 ? (
                <div className="space-y-3">
                  {product.materials.map((material, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded"
                    >
                      <div>
                        <p className="font-medium">{material.materialName}</p>
                        <p className="text-sm text-muted-foreground">
                          Mã: {material.materialId}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {material.quantityPerUnit} {material.unit}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          trên 1 {product.unit}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Chưa có thông tin công thức
                </p>
              )}
              {product.registrationNumber && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    Số đăng ký:{" "}
                    <span className="font-medium">
                      {product.registrationNumber}
                    </span>
                  </p>
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
