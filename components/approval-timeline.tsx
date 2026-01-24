import { CheckCircle2, XCircle, Clock, User } from "lucide-react"
import type { ApprovalStep } from "@/lib/types"
import { cn } from "@/lib/utils"

interface ApprovalTimelineProps {
  steps: ApprovalStep[]
  className?: string
}

export function ApprovalTimeline({ steps, className }: ApprovalTimelineProps) {
  if (steps.length === 0) {
    return <div className={cn("text-muted-foreground text-sm", className)}>Chưa có lịch sử phê duyệt</div>
  }

  return (
    <div className={cn("space-y-4", className)}>
      {steps.map((step, index) => (
        <div key={step.id} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full border-2",
                step.status === "approved" && "border-primary bg-primary/10 text-primary",
                step.status === "rejected" && "border-destructive bg-destructive/10 text-destructive",
                step.status === "pending" && "border-muted bg-muted text-muted-foreground",
              )}
            >
              {step.status === "approved" && <CheckCircle2 className="h-5 w-5" />}
              {step.status === "rejected" && <XCircle className="h-5 w-5" />}
              {step.status === "pending" && <Clock className="h-5 w-5" />}
            </div>
            {index < steps.length - 1 && <div className="h-full w-0.5 bg-border my-2" />}
          </div>
          <div className="flex-1 pb-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{step.approverName}</span>
              <span className="text-sm text-muted-foreground">({step.role})</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{new Date(step.timestamp).toLocaleString("vi-VN")}</p>
            {step.comment && <div className="mt-2 rounded-lg bg-muted/50 p-3 text-sm">{step.comment}</div>}
          </div>
        </div>
      ))}
    </div>
  )
}
