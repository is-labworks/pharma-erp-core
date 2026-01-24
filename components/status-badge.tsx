import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type StatusType =
  | "pending"
  | "approved"
  | "rejected"
  | "processing"
  | "completed"
  | "waiting"
  | "passed"
  | "failed"
  | "draft"
  | "sent"
  | "received"
  | "closed"
  | "active"
  | "inactive"

interface StatusBadgeProps {
  status: StatusType
  className?: string
}

const statusConfig: Record<
  StatusType,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  pending: { label: "Chờ duyệt", variant: "secondary" },
  approved: { label: "Đã duyệt", variant: "default" },
  rejected: { label: "Từ chối", variant: "destructive" },
  processing: { label: "Đang xử lý", variant: "secondary" },
  completed: { label: "Hoàn thành", variant: "default" },
  waiting: { label: "Chờ kiểm nghiệm", variant: "secondary" },
  passed: { label: "Đạt", variant: "default" },
  failed: { label: "Không đạt", variant: "destructive" },
  draft: { label: "Bản nháp", variant: "outline" },
  sent: { label: "Đã gửi", variant: "secondary" },
  received: { label: "Đã nhận", variant: "default" },
  closed: { label: "Đã đóng", variant: "outline" },
  active: { label: "Hoạt động", variant: "default" },
  inactive: { label: "Ngừng hoạt động", variant: "outline" },
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status]

  return (
    <Badge variant={config.variant} className={cn("font-medium", className)}>
      {config.label}
    </Badge>
  )
}
