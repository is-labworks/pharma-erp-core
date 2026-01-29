"use client";
import { DashboardLayout } from "@/components/dashboard-layout";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Save, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function NewCustomerPage() {
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    category: "pharmacy" as "pharmacy" | "hospital" | "distributor",
    taxCode: "",
    address: "",
    district: "",
    city: "",
    phone: "",
    email: "",
    contactPerson: "",
    contactPhone: "",
    debtLimit: "50000000",
    paymentTerms: "30 ngày",
    notes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // In real app: API call to create customer
    console.log("Creating customer:", formData);

    setTimeout(() => {
      alert("Tạo khách hàng thành công!");
      window.location.href = "/sales/customers";
    }, 1000);
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <DashboardLayout
      role="sales_staff"
      breadcrumbs={[
        { label: "Kinh doanh", href: "/sales" },
        { label: "Khách hàng", href: "/sales/customers" },
        { label: "Thêm mới" },
      ]}
    >
      <div className="space-y-6">
        <PageHeader
          title="Thêm khách hàng mới"
          description="Nhập thông tin khách hàng để tạo hồ sơ"
        />

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Basic Info */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Thông tin cơ bản</h3>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="code">
                    Mã khách hàng <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => updateField("code", e.target.value)}
                    placeholder="NT-001, BV-001, DL-001"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    NT = Nhà thuốc, BV = Bệnh viện, DL = Đại lý
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">
                    Tên khách hàng <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    placeholder="Nhà thuốc An Khang"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">
                    Loại khách hàng <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.category}
                    onValueChange={(val: any) => updateField("category", val)}
                  >
                    <SelectTrigger id="category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pharmacy">Nhà thuốc</SelectItem>
                      <SelectItem value="hospital">Bệnh viện</SelectItem>
                      <SelectItem value="distributor">
                        Đại lý phân phối
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="taxCode">Mã số thuế</Label>
                  <Input
                    id="taxCode"
                    value={formData.taxCode}
                    onChange={(e) => updateField("taxCode", e.target.value)}
                    placeholder="0312345001"
                  />
                </div>
              </div>
            </Card>

            {/* Address */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Địa chỉ</h3>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2 md:col-span-3">
                  <Label htmlFor="address">
                    Địa chỉ <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => updateField("address", e.target.value)}
                    placeholder="123 Lý Thường Kiệt"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="district">
                    Quận/Huyện <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="district"
                    value={formData.district}
                    onChange={(e) => updateField("district", e.target.value)}
                    placeholder="Quận 10"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">
                    Tỉnh/Thành phố <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => updateField("city", e.target.value)}
                    placeholder="TP. Hồ Chí Minh"
                    required
                  />
                </div>
              </div>
            </Card>

            {/* Contact */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Thông tin liên hệ</h3>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone">
                    Điện thoại <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    placeholder="028-3975-1234"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    placeholder="ankhang@gmail.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactPerson">
                    Người liên hệ <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="contactPerson"
                    value={formData.contactPerson}
                    onChange={(e) =>
                      updateField("contactPerson", e.target.value)
                    }
                    placeholder="Nguyễn Văn A"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactPhone">
                    SĐT người liên hệ <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="contactPhone"
                    type="tel"
                    value={formData.contactPhone}
                    onChange={(e) =>
                      updateField("contactPhone", e.target.value)
                    }
                    placeholder="0903-123-456"
                    required
                  />
                </div>
              </div>
            </Card>

            {/* Business Terms */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Điều kiện kinh doanh</h3>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="debtLimit">
                    Hạn mức công nợ (VNĐ){" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="debtLimit"
                    type="number"
                    value={formData.debtLimit}
                    onChange={(e) => updateField("debtLimit", e.target.value)}
                    placeholder="50000000"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Hiện tại:{" "}
                    {(parseInt(formData.debtLimit) / 1000000).toFixed(0)}tr VNĐ
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paymentTerms">
                    Điều kiện thanh toán <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.paymentTerms}
                    onValueChange={(val) => updateField("paymentTerms", val)}
                  >
                    <SelectTrigger id="paymentTerms">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ngay">Thanh toán ngay</SelectItem>
                      <SelectItem value="7 ngày">7 ngày</SelectItem>
                      <SelectItem value="15 ngày">15 ngày</SelectItem>
                      <SelectItem value="30 ngày">30 ngày</SelectItem>
                      <SelectItem value="45 ngày">45 ngày</SelectItem>
                      <SelectItem value="60 ngày">60 ngày</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="notes">Ghi chú</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => updateField("notes", e.target.value)}
                    placeholder="Thông tin thêm về khách hàng..."
                    rows={3}
                  />
                </div>
              </div>
            </Card>

            {/* Actions */}
            <Card className="p-6">
              <div className="flex justify-between">
                <Link href="/sales/customers">
                  <Button type="button" variant="outline">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Quay lại
                  </Button>
                </Link>

                <Button type="submit" disabled={isSubmitting}>
                  <Save className="mr-2 h-4 w-4" />
                  {isSubmitting ? "Đang lưu..." : "Tạo khách hàng"}
                </Button>
              </div>
            </Card>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
