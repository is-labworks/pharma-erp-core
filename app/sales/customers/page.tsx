"use client";
import { DashboardLayout } from "@/components/dashboard-layout";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { customers, statusLabelsExtended } from "@/lib/sales-mock-data";
import { statusLabels } from "@/lib/mock-data";
import {
  Users,
  Plus,
  Search,
  Building2,
  Store,
  Warehouse,
  Phone,
  Mail,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { CustomerCategory } from "@/lib/sales-types";

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<
    "all" | CustomerCategory
  >("all");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" || customer.category === categoryFilter;

    const matchesStatus =
      statusFilter === "all" || customer.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getCategoryIcon = (category: CustomerCategory) => {
    switch (category) {
      case "pharmacy":
        return <Store className="h-4 w-4" />;
      case "hospital":
        return <Building2 className="h-4 w-4" />;
      case "distributor":
        return <Warehouse className="h-4 w-4" />;
    }
  };

  const getDebtStatusBadge = (debtStatus: string) => {
    switch (debtStatus) {
      case "good":
        return (
          <Badge variant="outline" className="bg-green-50">
            <CheckCircle className="h-3 w-3 mr-1" />
            Tốt
          </Badge>
        );
      case "warning":
        return (
          <Badge variant="outline" className="bg-yellow-50">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Cảnh báo
          </Badge>
        );
      case "overdue":
        return (
          <Badge variant="destructive">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Quá hạn
          </Badge>
        );
      case "blocked":
        return (
          <Badge variant="destructive">
            <XCircle className="h-3 w-3 mr-1" />
            Khóa
          </Badge>
        );
      default:
        return <Badge variant="outline">{debtStatus}</Badge>;
    }
  };

  return (
    <DashboardLayout
      role="sales_staff"
      breadcrumbs={[
        { label: "Kinh doanh", href: "/sales" },
        { label: "Khách hàng" },
      ]}
    >
      <div className="space-y-6">
        <PageHeader
          title="Quản lý Khách hàng"
          description="Danh sách khách hàng và thông tin liên hệ"
        >
          <Link href="/sales/customers/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Thêm khách hàng
            </Button>
          </Link>
        </PageHeader>

        <Card className="p-6">
          <div className="space-y-4">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm theo tên, mã, SĐT, email..."
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
                  <Store className="mr-2 h-4 w-4" />
                  Nhà thuốc
                </Button>
                <Button
                  variant={
                    categoryFilter === "hospital" ? "default" : "outline"
                  }
                  onClick={() => setCategoryFilter("hospital")}
                  size="sm"
                >
                  <Building2 className="mr-2 h-4 w-4" />
                  Bệnh viện
                </Button>
                <Button
                  variant={
                    categoryFilter === "distributor" ? "default" : "outline"
                  }
                  onClick={() => setCategoryFilter("distributor")}
                  size="sm"
                >
                  <Warehouse className="mr-2 h-4 w-4" />
                  Đại lý
                </Button>
              </div>
            </div>

            {/* Results count */}
            <div className="text-sm text-muted-foreground">
              Tìm thấy {filteredCustomers.length} khách hàng
            </div>
          </div>
        </Card>

        {/* Customer List */}
        <div className="grid gap-4">
          {filteredCustomers.map((customer) => (
            <Card
              key={customer.id}
              className="p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-primary/10">
                      {getCategoryIcon(customer.category)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold">
                          {customer.name}
                        </h3>
                        <Badge variant="outline">{customer.code}</Badge>
                        {customer.status === "active" ? (
                          <Badge variant="outline" className="bg-green-50">
                            {statusLabels[customer.status]}
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            {statusLabels[customer.status]}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {statusLabels[customer.category]}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Địa chỉ
                      </p>
                      <p className="text-sm">
                        {customer.address}, {customer.district}, {customer.city}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Liên hệ
                      </p>
                      <div className="space-y-1">
                        <p className="text-sm flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {customer.phone}
                        </p>
                        <p className="text-sm flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {customer.email}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Công nợ
                      </p>
                      <div className="space-y-1">
                        <p className="text-sm">
                          Hiện tại:{" "}
                          {(customer.currentDebt / 1000000).toFixed(0)}tr /{" "}
                          {(customer.debtLimit / 1000000).toFixed(0)}tr
                        </p>
                        <div>{getDebtStatusBadge(customer.debtStatus)}</div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3 pt-3 border-t">
                    <div className="text-sm">
                      <span className="text-muted-foreground">
                        Người liên hệ:
                      </span>{" "}
                      <span className="font-medium">
                        {customer.contactPerson}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Số đơn:</span>{" "}
                      <span className="font-medium">
                        {customer.totalOrders}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Doanh thu:</span>{" "}
                      <span className="font-medium">
                        {(customer.totalRevenue / 1000000).toFixed(0)}tr VNĐ
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  <Link href={`/sales/customers/${customer.id}`}>
                    <Button variant="outline" size="sm">
                      <Eye className="mr-2 h-4 w-4" />
                      Xem
                    </Button>
                  </Link>
                  <Link href={`/sales/orders/new?customerId=${customer.id}`}>
                    <Button size="sm">Tạo đơn hàng</Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}

          {filteredCustomers.length === 0 && (
            <Card className="p-12">
              <div className="flex flex-col items-center justify-center text-center">
                <Users className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold">
                  Không tìm thấy khách hàng
                </h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
