import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

interface KpiCardProps {
  title: string
  value: string | number
  description?: string
  icon?: React.ElementType
  trend?: "up" | "down" | "neutral"
  trendValue?: string
  change?: number
  changeLabel?: string
  className?: string
}

export function KpiCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  trendValue,
  change,
  changeLabel,
  className,
}: KpiCardProps) {
  const isPositive = trend === "up" || (change !== undefined && change > 0)
  const isNegative = trend === "down" || (change !== undefined && change < 0)

  return (
    <Card className={cn("relative overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {Icon && (
          <div className="text-muted-foreground">
            <Icon className="h-4 w-4" />
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
        {(trendValue || change !== undefined) && (
          <div className="mt-2 flex items-center gap-1">
            {isPositive && <TrendingUp className="h-4 w-4 text-green-600" />}
            {isNegative && <TrendingDown className="h-4 w-4 text-red-600" />}
            {!isPositive && !isNegative && <Minus className="h-4 w-4 text-muted-foreground" />}
            {change !== undefined && (
              <span
                className={cn(
                  "text-sm font-medium",
                  isPositive && "text-green-600",
                  isNegative && "text-red-600",
                  !isPositive && !isNegative && "text-muted-foreground",
                )}
              >
                {change > 0 ? "+" : ""}
                {change}%
              </span>
            )}
            {trendValue && <span className="text-xs text-muted-foreground">{trendValue}</span>}
            {changeLabel && <span className="text-sm text-muted-foreground">{changeLabel}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export { KpiCard as KPICard }
