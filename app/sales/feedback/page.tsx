"use client";
import { DashboardLayout } from "@/components/dashboard-layout";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { customerFeedbacks, customers } from "@/lib/sales-mock-data";
import {
  MessageSquare,
  Plus,
  Star,
  AlertCircle,
  CheckCircle,
  Clock,
  Search,
} from "lucide-react";
import { useState } from "react";

export default function FeedbackPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<
    "all" | "feedback" | "complaint"
  >("all");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "new" | "in_progress" | "resolved" | "closed"
  >("all");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [newFeedback, setNewFeedback] = useState({
    customerId: "",
    type: "feedback" as "feedback" | "complaint",
    subject: "",
    description: "",
    priority: "medium" as "low" | "medium" | "high",
  });

  const filteredFeedback = customerFeedbacks.filter((fb) => {
    const matchesSearch =
      fb.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fb.customerName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === "all" || fb.type === typeFilter;
    const matchesStatus = statusFilter === "all" || fb.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  const handleSubmit = () => {
    console.log("Creating feedback:", newFeedback);
    alert("Đã ghi nhận phản hồi thành công!");
    setDialogOpen(false);
    setNewFeedback({
      customerId: "",
      type: "feedback",
      subject: "",
      description: "",
      priority: "medium",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return (
          <Badge className="bg-blue-100 text-blue-800">
            <Clock className="h-3 w-3 mr-1" />
            Mới
          </Badge>
        );
      case "in_progress":
        return (
          <Badge className="bg-orange-100 text-orange-800">
            <Clock className="h-3 w-3 mr-1" />
            Đang xử lý
          </Badge>
        );
      case "resolved":
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Đã giải quyết
          </Badge>
        );
      case "closed":
        return (
          <Badge variant="outline">
            <CheckCircle className="h-3 w-3 mr-1" />
            Đã đóng
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    return type === "complaint" ? (
      <Badge variant="destructive">
        <AlertCircle className="h-3 w-3 mr-1" />
        Khiếu nại
      </Badge>
    ) : (
      <Badge variant="outline">
        <MessageSquare className="h-3 w-3 mr-1" />
        Phản hồi
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">Cao</Badge>;
      case "medium":
        return (
          <Badge className="bg-orange-100 text-orange-800">Trung bình</Badge>
        );
      case "low":
        return <Badge variant="outline">Thấp</Badge>;
      default:
        return <Badge>{priority}</Badge>;
    }
  };

  return (
    <DashboardLayout
      role="sales_staff"
      breadcrumbs={[
        { label: "Kinh doanh", href: "/sales" },
        { label: "Chăm sóc khách hàng" },
      ]}
    >
      <div className="space-y-6">
        <PageHeader
          title="Chăm sóc Khách hàng"
          description="Quản lý phản hồi và khiếu nại từ khách hàng"
        />

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Tổng số
                </p>
                <h3 className="text-3xl font-bold mt-1">
                  {customerFeedbacks.length}
                </h3>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Mới</p>
                <h3 className="text-3xl font-bold mt-1 text-blue-600">
                  {customerFeedbacks.filter((f) => f.status === "new").length}
                </h3>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Đang xử lý
                </p>
                <h3 className="text-3xl font-bold mt-1 text-orange-600">
                  {
                    customerFeedbacks.filter((f) => f.status === "in_progress")
                      .length
                  }
                </h3>
              </div>
              <AlertCircle className="h-8 w-8 text-orange-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Đã giải quyết
                </p>
                <h3 className="text-3xl font-bold mt-1 text-green-600">
                  {
                    customerFeedbacks.filter((f) => f.status === "resolved")
                      .length
                  }
                </h3>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-6">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm theo tiêu đề hoặc tên khách hàng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              <Button
                variant={typeFilter === "all" ? "default" : "outline"}
                onClick={() => setTypeFilter("all")}
                size="sm"
              >
                Tất cả
              </Button>
              <Button
                variant={typeFilter === "feedback" ? "default" : "outline"}
                onClick={() => setTypeFilter("feedback")}
                size="sm"
              >
                Phản hồi
              </Button>
              <Button
                variant={typeFilter === "complaint" ? "default" : "outline"}
                onClick={() => setTypeFilter("complaint")}
                size="sm"
              >
                Khiếu nại
              </Button>

              <div className="w-px h-8 bg-border mx-2" />

              <Button
                variant={statusFilter === "new" ? "default" : "outline"}
                onClick={() => setStatusFilter("new")}
                size="sm"
              >
                Mới
              </Button>
              <Button
                variant={statusFilter === "in_progress" ? "default" : "outline"}
                onClick={() => setStatusFilter("in_progress")}
                size="sm"
              >
                Đang xử lý
              </Button>
              <Button
                variant={statusFilter === "resolved" ? "default" : "outline"}
                onClick={() => setStatusFilter("resolved")}
                size="sm"
              >
                Đã giải quyết
              </Button>

              <div className="ml-auto">
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Ghi nhận phản hồi
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Ghi nhận phản hồi khách hàng</DialogTitle>
                      <DialogDescription>
                        Nhập thông tin phản hồi hoặc khiếu nại từ khách hàng
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Khách hàng</Label>
                        <Select
                          value={newFeedback.customerId}
                          onValueChange={(val) =>
                            setNewFeedback({ ...newFeedback, customerId: val })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn khách hàng" />
                          </SelectTrigger>
                          <SelectContent>
                            {customers.map((c) => (
                              <SelectItem key={c.id} value={c.id}>
                                {c.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Loại</Label>
                        <Select
                          value={newFeedback.type}
                          onValueChange={(val: any) =>
                            setNewFeedback({ ...newFeedback, type: val })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="feedback">Phản hồi</SelectItem>
                            <SelectItem value="complaint">Khiếu nại</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Độ ưu tiên</Label>
                        <Select
                          value={newFeedback.priority}
                          onValueChange={(val: any) =>
                            setNewFeedback({ ...newFeedback, priority: val })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Thấp</SelectItem>
                            <SelectItem value="medium">Trung bình</SelectItem>
                            <SelectItem value="high">Cao</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Tiêu đề</Label>
                        <Input
                          value={newFeedback.subject}
                          onChange={(e) =>
                            setNewFeedback({
                              ...newFeedback,
                              subject: e.target.value,
                            })
                          }
                          placeholder="Tóm tắt vấn đề..."
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Nội dung chi tiết</Label>
                        <Textarea
                          value={newFeedback.description}
                          onChange={(e) =>
                            setNewFeedback({
                              ...newFeedback,
                              description: e.target.value,
                            })
                          }
                          placeholder="Mô tả chi tiết vấn đề..."
                          rows={4}
                        />
                      </div>
                    </div>

                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setDialogOpen(false)}
                      >
                        Hủy
                      </Button>
                      <Button onClick={handleSubmit}>Lưu</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </Card>

        {/* Feedback List */}
        <div className="grid gap-4">
          {filteredFeedback.map((feedback) => (
            <Card
              key={feedback.id}
              className="p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">
                      {feedback.subject}
                    </h3>
                    {getTypeBadge(feedback.type)}
                    {getStatusBadge(feedback.status)}
                    {getPriorityBadge(feedback.priority)}
                    {feedback.rating && (
                      <div className="flex items-center gap-1 text-yellow-600">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="text-sm font-medium">
                          {feedback.rating}/5
                        </span>
                      </div>
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground mb-3">
                    {feedback.description}
                  </p>

                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Khách hàng:</span>{" "}
                      <span className="font-medium">
                        {feedback.customerName}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Ngày tạo:</span>{" "}
                      <span className="font-medium">
                        {new Date(
                          feedback.createdAt || feedback.reportedDate,
                        ).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        Người xử lý:
                      </span>{" "}
                      <span className="font-medium">
                        {feedback.assignedTo || "Chưa phân công"}
                      </span>
                    </div>
                  </div>

                  {feedback.response && (
                    <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded">
                      <p className="text-sm font-medium text-green-900 mb-1">
                        Phản hồi từ {feedback.respondedBy}:
                      </p>
                      <p className="text-sm text-green-800">
                        {feedback.response}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  <Button variant="outline" size="sm">
                    Xem chi tiết
                  </Button>
                  {feedback.status === "new" && (
                    <Button size="sm">Bắt đầu xử lý</Button>
                  )}
                </div>
              </div>
            </Card>
          ))}

          {filteredFeedback.length === 0 && (
            <Card className="p-12">
              <div className="flex flex-col items-center justify-center text-center">
                <MessageSquare className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold">Không có phản hồi nào</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Thử thay đổi bộ lọc hoặc tạo phản hồi mới
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
