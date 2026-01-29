"use client";
import { DashboardLayout } from "@/components/dashboard-layout";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { medicines } from "@/lib/mock-data";
import { productPrices, inventoryBatches } from "@/lib/sales-mock-data";
import { Package, Search, AlertTriangle, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { CustomerCategory } from "@/lib/sales-types";

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<
    "all" | CustomerCategory
  >("all");

  const filteredProducts = medicines.filter((medicine) => {
    const matchesSearch =
      medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medicine.code.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  const getPrice = (
    medicineId: string,
    category: CustomerCategory = "pharmacy",
  ) => {
    const price = productPrices.find(
      (p) => p.medicineId === medicineId && p.customerCategory === category,
    );
    return price || productPrices.find((p) => p.medicineId === medicineId);
  };

  const getTotalStock = (medicineId: string) => {
    // In real app, would query by medicineId from inventory
    return 50000; // Mock value
  };

  return (
    <DashboardLayout
      role="sales_staff"
      breadcrumbs={[
        { label: "Kinh doanh", href: "/sales" },
        { label: "Sản phẩm" },
      ]}
    >
      <div className="space-y-6">
        <PageHeader
          title="Danh mục Sản phẩm"
          description="Tra cứu sản phẩm, giá bán và tồn kho"
        />

        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm theo tên hoặc mã sản phẩm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={categoryFilter === "all" ? "default" : "outline"}
                  onClick={() => setCategoryFilter("all")}
                  size="sm"
                >
                  Tất cả
                </Button>
                <Button
                  variant={
                    categoryFilter === "pharmacy" ? "default" : "outline"
                  }
                  onClick={() => setCategoryFilter("pharmacy")}
                  size="sm"
                >
                  Giá Nhà thuốc
                </Button>
                <Button
                  variant={
                    categoryFilter === "hospital" ? "default" : "outline"
                  }
                  onClick={() => setCategoryFilter("hospital")}
                  size="sm"
                >
                  Giá Bệnh viện
                </Button>
                <Button
                  variant={
                    categoryFilter === "distributor" ? "default" : "outline"
                  }
                  onClick={() => setCategoryFilter("distributor")}
                  size="sm"
                >
                  Giá Đại lý
                </Button>
              </div>
            </div>

            <div className="text-sm text-muted-foreground">
              Tìm thấy {filteredProducts.length} sản phẩm
            </div>
          </div>
        </Card>

        <div className="grid gap-4">
          {filteredProducts.map((medicine) => {
            const price = getPrice(
              medicine.id,
              categoryFilter === "all" ? "pharmacy" : categoryFilter,
            );
            const stock = getTotalStock(medicine.id);

            return (
              <Card
                key={medicine.id}
                className="p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                        <Package className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold">
                            {medicine.name}
                          </h3>
                          <Badge variant="outline">{medicine.code}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {medicine.description}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Loại thuốc
                        </p>
                        <p className="text-sm capitalize">
                          {medicine.type === "tablet"
                            ? "Viên nén"
                            : medicine.type === "capsule"
                              ? "Viên nang"
                              : medicine.type === "syrup"
                                ? "Xi-rô"
                                : medicine.type}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Liều lượng
                        </p>
                        <p className="text-sm">{medicine.dosage}</p>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Đơn giá
                        </p>
                        {price && (
                          <div>
                            <p className="text-sm font-medium">
                              {price.unitPrice.toLocaleString("vi-VN")} VNĐ/
                              {medicine.unit}
                            </p>
                            {price.discountPercent > 0 && (
                              <p className="text-xs text-green-600">
                                Giảm {price.discountPercent}%
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Tồn kho
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          {stock > 10000 ? (
                            <>
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span className="text-sm font-medium text-green-600">
                                {stock.toLocaleString("vi-VN")} {medicine.unit}
                              </span>
                            </>
                          ) : (
                            <>
                              <AlertTriangle className="h-4 w-4 text-orange-600" />
                              <span className="text-sm font-medium text-orange-600">
                                Sắp hết: {stock.toLocaleString("vi-VN")}{" "}
                                {medicine.unit}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {medicine.registrationNumber && (
                      <div className="mt-3 pt-3 border-t">
                        <p className="text-xs text-muted-foreground">
                          Số đăng ký: {medicine.registrationNumber}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <Link href={`/sales/products/${medicine.id}`}>
                      <Button variant="outline" size="sm">
                        Chi tiết
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            );
          })}

          {filteredProducts.length === 0 && (
            <Card className="p-12">
              <div className="flex flex-col items-center justify-center text-center">
                <Package className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold">
                  Không tìm thấy sản phẩm
                </h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Thử thay đổi từ khóa tìm kiếm
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
