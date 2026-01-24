"use client"
import { DashboardLayout } from "@/components/dashboard-layout"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Cog, Bell, Shield, Database, Mail, Save } from "lucide-react"

export default function AdminSettingsPage() {
  return (
    <DashboardLayout role="admin" breadcrumbs={[{ label: "Cài đặt" }]}>
      <div className="space-y-6">
        <PageHeader title="Cài đặt hệ thống" description="Cấu hình các thông số và tùy chọn của hệ thống" icon={Cog} />

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Database className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Thông tin công ty</CardTitle>
                  <CardDescription>Cài đặt thông tin cơ bản của công ty</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label>Tên công ty</Label>
                  <Input defaultValue="Công ty Dược phẩm PharmaPro" />
                </div>
                <div className="grid gap-2">
                  <Label>Mã số thuế</Label>
                  <Input defaultValue="0123456789" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Địa chỉ</Label>
                <Input defaultValue="123 Đường ABC, Quận 1, TP.HCM" />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label>Điện thoại</Label>
                  <Input defaultValue="028-1234-5678" />
                </div>
                <div className="grid gap-2">
                  <Label>Email</Label>
                  <Input defaultValue="contact@pharmapro.vn" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Quy định phê duyệt</CardTitle>
                  <CardDescription>Cấu hình ngưỡng giá trị và quy trình phê duyệt</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label>Ngưỡng phê duyệt Trưởng BP (VND)</Label>
                  <Input type="number" defaultValue="50000000" />
                </div>
                <div className="grid gap-2">
                  <Label>Ngưỡng phê duyệt QL Mua hàng (VND)</Label>
                  <Input type="number" defaultValue="200000000" />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label>Ngưỡng phê duyệt Ban GĐ (VND)</Label>
                  <Input type="number" defaultValue="500000000" />
                </div>
                <div className="grid gap-2">
                  <Label>Số NCC tối thiểu báo giá</Label>
                  <Select defaultValue="3">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2 nhà cung cấp</SelectItem>
                      <SelectItem value="3">3 nhà cung cấp</SelectItem>
                      <SelectItem value="5">5 nhà cung cấp</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Bell className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Thông báo</CardTitle>
                  <CardDescription>Cấu hình gửi thông báo và email</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Thông báo phê duyệt</Label>
                  <p className="text-sm text-muted-foreground">Gửi email khi có yêu cầu cần phê duyệt</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Cảnh báo tồn kho</Label>
                  <p className="text-sm text-muted-foreground">Gửi email khi vật tư dưới mức tối thiểu</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Nhắc nhở thanh toán</Label>
                  <p className="text-sm text-muted-foreground">Gửi email nhắc thanh toán sắp đến hạn</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Báo cáo định kỳ</Label>
                  <p className="text-sm text-muted-foreground">Gửi báo cáo tổng hợp hàng tuần</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Cấu hình Email</CardTitle>
                  <CardDescription>Thiết lập máy chủ gửi email</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label>SMTP Server</Label>
                  <Input placeholder="smtp.gmail.com" />
                </div>
                <div className="grid gap-2">
                  <Label>Port</Label>
                  <Input placeholder="587" />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label>Username</Label>
                  <Input placeholder="noreply@pharmapro.vn" />
                </div>
                <div className="grid gap-2">
                  <Label>Password</Label>
                  <Input type="password" placeholder="••••••••" />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button size="lg">
              <Save className="mr-2 h-4 w-4" />
              Lưu cài đặt
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
