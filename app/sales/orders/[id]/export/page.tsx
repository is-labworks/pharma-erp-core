"use client";
import { DashboardLayout } from "@/components/dashboard-layout";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  salesOrdersExtended,
  statusLabelsExtended,
} from "@/lib/sales-mock-data";
import {
  Package,
  Truck,
  CheckCircle,
  AlertTriangle,
  Calendar,
  User,
  MapPin,
  FileText,
  Printer,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useState } from "react";

export default function ExportRequestPage({
  params,
}: {
  params: { id: string };
}) {
  const order = salesOrdersExtended.find((o) => o.id === params.id);

  if (!order) {
    return notFound();
  }

  if (order.status !== "approved") {
    return (
      <DashboardLayout role="sales_staff" breadcrumbs={[]}>
        <Card className="p-12">
          <div className="text-center">
            <AlertTriangle className="h-16 w-16 text-orange-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold">
              Đơn hàng chưa được phê duyệt
            </h3>
            <p className="text-sm text-muted-foreground mt-2">
              Chỉ có thể tạo phiếu xuất kho cho đơn hàng đã được phê duyệt
            </p>
            <Link href="/sales/orders" className="mt-4 inline-block">
              <Button variant="outline">Quay lại danh sách</Button>
            </Link>
          </div>
        </Card>
      </DashboardLayout>
    );
  }

  const [exportData, setExportData] = useState({
    exportDate: new Date().toISOString().split("T")[0],
    deliveryDate: order.requiredDeliveryDate.split("T")[0],
    deliveryAddress: `${order.customer.address}, ${order.customer.district}, ${order.customer.city}`,
    receiverName: order.customer.contactPerson,
    receiverPhone: order.customer.contactPhone,
    vehicleNumber: "",
    driverName: "",
    driverPhone: "",
    notes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    console.log("Creating export request:", exportData);

    setTimeout(() => {
      alert("Đã tạo phiếu xuất kho thành công!");
      window.location.href = "/sales/orders";
    }, 1000);
  };

  return (
    <DashboardLayout
      role="sales_staff"
      breadcrumbs={[
        { label: "Kinh doanh", href: "/sales" },
        { label: "Đơn hàng", href: "/sales/orders" },
        { label: order.code, href: `/sales/orders/${order.id}` },
        { label: "Xuất kho" },
      ]}
    >
      <div className="space-y-6">
        <PageHeader
          title="Tạo phiếu xuất kho"
          description={`Đơn hàng: ${order.code} - ${order.customer.name}`}
        />

        {/* Order Summary */}
        <Card className="p-6 bg-blue-50 border-blue-200">
          <div className="flex items-start gap-4">
            <Package className="h-8 w-8 text-blue-600 mt-1" />
            <div className="flex-1">
              <h3 className="font-semibold text-blue-900">
                Thông tin đơn hàng
              </h3>
              <div className="grid md:grid-cols-3 gap-4 mt-3">
                <div>
                  <p className="text-sm text-blue-800">Mã đơn hàng</p>
                  <p className="font-medium">{order.code}</p>
                </div>
                <div>
                  <p className="text-sm text-blue-800">Số lượng mặt hàng</p>
                  <p className="font-medium">{order.items.length} sản phẩm</p>
                </div>
                <div>
                  <p className="text-sm text-blue-800">Tổng giá trị</p>
                  <p className="font-medium">
                    {(order.totalAmount / 1000000).toFixed(2)}tr VNĐ
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Export Info */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Thông tin xuất kho
              </h3>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="exportDate">
                    Ngày xuất kho <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="exportDate"
                    type="date"
                    value={exportData.exportDate}
                    onChange={(e) =>
                      setExportData({
                        ...exportData,
                        exportDate: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deliveryDate">
                    Ngày giao hàng dự kiến{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="deliveryDate"
                    type="date"
                    value={exportData.deliveryDate}
                    onChange={(e) =>
                      setExportData({
                        ...exportData,
                        deliveryDate: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>
            </Card>

            {/* Delivery Info */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Thông tin giao hàng
              </h3>

              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="deliveryAddress">
                    Địa chỉ giao hàng <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="deliveryAddress"
                    value={exportData.deliveryAddress}
                    onChange={(e) =>
                      setExportData({
                        ...exportData,
                        deliveryAddress: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="receiverName">
                      Người nhận <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="receiverName"
                      value={exportData.receiverName}
                      onChange={(e) =>
                        setExportData({
                          ...exportData,
                          receiverName: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="receiverPhone">
                      SĐT người nhận <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="receiverPhone"
                      type="tel"
                      value={exportData.receiverPhone}
                      onChange={(e) =>
                        setExportData({
                          ...exportData,
                          receiverPhone: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Transport Info */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Thông tin vận chuyển
              </h3>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="vehicleNumber">Biển số xe</Label>
                  <Input
                    id="vehicleNumber"
                    value={exportData.vehicleNumber}
                    onChange={(e) =>
                      setExportData({
                        ...exportData,
                        vehicleNumber: e.target.value,
                      })
                    }
                    placeholder="51A-12345"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="driverName">Tên tài xế</Label>
                  <Input
                    id="driverName"
                    value={exportData.driverName}
                    onChange={(e) =>
                      setExportData({
                        ...exportData,
                        driverName: e.target.value,
                      })
                    }
                    placeholder="Nguyễn Văn A"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="driverPhone">SĐT tài xế</Label>
                  <Input
                    id="driverPhone"
                    type="tel"
                    value={exportData.driverPhone}
                    onChange={(e) =>
                      setExportData({
                        ...exportData,
                        driverPhone: e.target.value,
                      })
                    }
                    placeholder="0903-123-456"
                  />
                </div>
              </div>
            </Card>

            {/* Products to Export */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Sản phẩm xuất kho</h3>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-2 text-sm font-medium">
                        STT
                      </th>
                      <th className="text-left py-3 px-2 text-sm font-medium">
                        Tên sản phẩm
                      </th>
                      <th className="text-center py-3 px-2 text-sm font-medium">
                        ĐVT
                      </th>
                      <th className="text-right py-3 px-2 text-sm font-medium">
                        Số lượng
                      </th>
                      <th className="text-center py-3 px-2 text-sm font-medium">
                        Tồn kho
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item, idx) => (
                      <tr key={item.id} className="border-b">
                        <td className="py-3 px-2 text-sm">{idx + 1}</td>
                        <td className="py-3 px-2">
                          <p className="text-sm font-medium">
                            {item.medicineName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {item.medicineCode}
                          </p>
                        </td>
                        <td className="py-3 px-2 text-sm text-center">
                          {item.unit}
                        </td>
                        <td className="py-3 px-2 text-sm text-right font-medium">
                          {item.quantity.toLocaleString()}
                        </td>
                        <td className="py-3 px-2 text-center">
                          {item.quantity <= item.availableStock ? (
                            <Badge variant="outline" className="bg-green-50">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              {item.availableStock.toLocaleString()}
                            </Badge>
                          ) : (
                            <Badge variant="destructive">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Thiếu{" "}
                              {(
                                item.quantity - item.availableStock
                              ).toLocaleString()}
                            </Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Notes */}
            <Card className="p-6">
              <div className="space-y-2">
                <Label htmlFor="notes">Ghi chú</Label>
                <Textarea
                  id="notes"
                  value={exportData.notes}
                  onChange={(e) =>
                    setExportData({ ...exportData, notes: e.target.value })
                  }
                  placeholder="Ghi chú về việc xuất kho và giao hàng..."
                  rows={3}
                />
              </div>
            </Card>

            {/* Actions */}
            <Card className="p-6">
              <div className="flex justify-between">
                <Link href={`/sales/orders/${order.id}`}>
                  <Button type="button" variant="outline">
                    Quay lại
                  </Button>
                </Link>

                <div className="flex gap-2">
                  <Button type="button" variant="outline">
                    <Printer className="mr-2 h-4 w-4" />
                    Xem trước
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    {isSubmitting ? "Đang tạo..." : "Tạo phiếu xuất kho"}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
