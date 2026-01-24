"use client";
import { DashboardLayout } from "@/components/dashboard-layout";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { stockTransactions } from "@/lib/warehouse-mock-data";
import {
  Search,
  ArrowDownCircle,
  ArrowUpCircle,
  Settings2,
  ArrowRightLeft,
} from "lucide-react";
import { useState } from "react";

export default function StockTransactionsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTransactions = stockTransactions.filter(
    (txn) =>
      txn.transactionNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.batchNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.productName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const movementIcons = {
    in: ArrowDownCircle,
    out: ArrowUpCircle,
    adjustment: Settings2,
    transfer: ArrowRightLeft,
  };

  const movementColors = {
    in: "text-green-600",
    out: "text-red-600",
    adjustment: "text-yellow-600",
    transfer: "text-blue-600",
  };

  const movementLabels = {
    in: "Nhập kho",
    out: "Xuất kho",
    adjustment: "Điều chỉnh",
    transfer: "Chuyển kho",
  };

  const categoryLabels = {
    raw_material: "Nguyên liệu",
    semi_finished: "Bán thành phẩm",
    finished_goods: "Thành phẩm",
  };

  return (
    <DashboardLayout
      role="warehouse"
      breadcrumbs={[
        { label: "Quản lý kho", href: "/warehouse/inventory" },
        { label: "Giao dịch kho" },
      ]}
    >
      <div className="space-y-6">
        <PageHeader
          title="Giao dịch Kho (Stock Transactions)"
          description="Theo dõi nhập - xuất - tồn theo thời gian thực"
        />

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm theo mã giao dịch, số lô, sản phẩm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Tabs by Movement Type */}
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">
              Tất cả ({filteredTransactions.length})
            </TabsTrigger>
            <TabsTrigger value="in">
              Nhập kho (
              {
                filteredTransactions.filter((t) => t.movementType === "in")
                  .length
              }
              )
            </TabsTrigger>
            <TabsTrigger value="out">
              Xuất kho (
              {
                filteredTransactions.filter((t) => t.movementType === "out")
                  .length
              }
              )
            </TabsTrigger>
            <TabsTrigger value="adjustment">
              Điều chỉnh (
              {
                filteredTransactions.filter(
                  (t) => t.movementType === "adjustment",
                ).length
              }
              )
            </TabsTrigger>
          </TabsList>

          {["all", "in", "out", "adjustment"].map((tabValue) => (
            <TabsContent key={tabValue} value={tabValue} className="space-y-3">
              {filteredTransactions
                .filter(
                  (t) => tabValue === "all" || t.movementType === tabValue,
                )
                .sort(
                  (a, b) =>
                    new Date(b.performedAt).getTime() -
                    new Date(a.performedAt).getTime(),
                )
                .map((txn) => {
                  const Icon = movementIcons[txn.movementType];
                  return (
                    <Card key={txn.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div
                            className={`rounded-full p-2 ${movementColors[txn.movementType]}`}
                          >
                            <Icon className="h-5 w-5" />
                          </div>

                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="font-semibold">
                                    {txn.transactionNumber}
                                  </h4>
                                  <Badge variant="outline">
                                    {movementLabels[txn.movementType]}
                                  </Badge>
                                  <Badge variant="secondary">
                                    {categoryLabels[txn.category]}
                                  </Badge>
                                </div>
                                <p className="mt-1 text-sm text-muted-foreground">
                                  {txn.productName} ({txn.productCode})
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-muted-foreground">
                                  {new Date(txn.performedAt).toLocaleString(
                                    "vi-VN",
                                  )}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  Bởi: {txn.performedByName}
                                </p>
                              </div>
                            </div>

                            <div className="mt-3 grid gap-2 rounded-md bg-muted/50 p-3 md:grid-cols-4">
                              <div>
                                <p className="text-xs text-muted-foreground">
                                  Số lô
                                </p>
                                <p className="mt-1 font-medium">
                                  {txn.batchNumber}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">
                                  Số lượng
                                </p>
                                <p
                                  className={`mt-1 font-medium ${
                                    txn.movementType === "in"
                                      ? "text-green-600"
                                      : txn.movementType === "out"
                                        ? "text-red-600"
                                        : "text-yellow-600"
                                  }`}
                                >
                                  {txn.movementType === "in"
                                    ? "+"
                                    : txn.movementType === "out"
                                      ? "-"
                                      : ""}
                                  {txn.quantity} {txn.unit}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">
                                  Trước → Sau
                                </p>
                                <p className="mt-1 font-medium">
                                  {txn.beforeQuantity} → {txn.afterQuantity}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">
                                  Vị trí
                                </p>
                                <p className="mt-1 font-medium">
                                  {txn.location}
                                </p>
                              </div>
                            </div>

                            {txn.referenceCode && (
                              <div className="mt-2 text-xs text-muted-foreground">
                                Tham chiếu: {txn.referenceCode}
                              </div>
                            )}

                            {txn.notes && (
                              <div className="mt-2 rounded-md bg-blue-50 p-2 text-xs text-blue-900">
                                💡 {txn.notes}
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
