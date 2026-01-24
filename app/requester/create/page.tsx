"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { materials } from "@/lib/mock-data"
import { Plus, Trash2, Save, ArrowLeft, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface FormItem {
  id: string
  materialId: string
  quantity: number
  note: string
}

export default function CreateRequisitionPage() {
  const router = useRouter()
  const [purpose, setPurpose] = React.useState("")
  const [requiredDate, setRequiredDate] = React.useState("")
  const [items, setItems] = React.useState<FormItem[]>([{ id: "1", materialId: "", quantity: 0, note: "" }])
  const [errors, setErrors] = React.useState<Record<string, string>>({})

  const addItem = () => {
    setItems([...items, { id: Date.now().toString(), materialId: "", quantity: 0, note: "" }])
  }

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id))
    }
  }

  const updateItem = (id: string, field: keyof FormItem, value: string | number) => {
    setItems(items.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
  }

  const getMaterial = (materialId: string) => materials.find((m) => m.id === materialId)

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!purpose.trim()) newErrors.purpose = "Vui lòng nhập mục đích sử dụng"
    if (!requiredDate) newErrors.requiredDate = "Vui lòng chọn thời gian cần"
    items.forEach((item, index) => {
      if (!item.materialId) newErrors[`item-${index}-material`] = "Vui lòng chọn vật tư"
      if (item.quantity <= 0) newErrors[`item-${index}-quantity`] = "Số lượng phải lớn hơn 0"
    })
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      // Submit logic here
      router.push("/requester/list")
    }
  }

  return (
    <DashboardLayout
      role="requester"
      breadcrumbs={[{ label: "Danh sách phiếu", href: "/requester/list" }, { label: "Tạo phiếu mới" }]}
    >
      <div className="space-y-6">
        <PageHeader title="Tạo phiếu đề nghị mua hàng" description="Điền thông tin chi tiết để tạo phiếu đề nghị mới">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>
        </PageHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin chung</CardTitle>
              <CardDescription>Nhập thông tin cơ bản của phiếu đề nghị</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="purpose">
                    Mục đích sử dụng <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="purpose"
                    placeholder="Nhập mục đích sử dụng vật tư..."
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    className={errors.purpose ? "border-destructive" : ""}
                  />
                  {errors.purpose && <p className="text-sm text-destructive">{errors.purpose}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="requiredDate">
                    Thời gian cần <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="requiredDate"
                    type="date"
                    value={requiredDate}
                    onChange={(e) => setRequiredDate(e.target.value)}
                    className={errors.requiredDate ? "border-destructive" : ""}
                  />
                  {errors.requiredDate && <p className="text-sm text-destructive">{errors.requiredDate}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Danh sách vật tư</CardTitle>
                <CardDescription>Thêm các vật tư cần mua</CardDescription>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={addItem}>
                <Plus className="mr-2 h-4 w-4" />
                Thêm vật tư
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item, index) => {
                const material = getMaterial(item.materialId)
                const isLowStock = material && material.currentStock < material.minStock

                return (
                  <div key={item.id} className="rounded-lg border p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Vật tư #{index + 1}</span>
                      {items.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                      <div className="space-y-2">
                        <Label>
                          Vật tư <span className="text-destructive">*</span>
                        </Label>
                        <Select value={item.materialId} onValueChange={(v) => updateItem(item.id, "materialId", v)}>
                          <SelectTrigger className={errors[`item-${index}-material`] ? "border-destructive" : ""}>
                            <SelectValue placeholder="Chọn vật tư" />
                          </SelectTrigger>
                          <SelectContent>
                            {materials.map((m) => (
                              <SelectItem key={m.id} value={m.id}>
                                {m.code} - {m.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors[`item-${index}-material`] && (
                          <p className="text-sm text-destructive">{errors[`item-${index}-material`]}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label>
                          Số lượng <span className="text-destructive">*</span>
                        </Label>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity || ""}
                            onChange={(e) => updateItem(item.id, "quantity", Number.parseInt(e.target.value) || 0)}
                            className={errors[`item-${index}-quantity`] ? "border-destructive" : ""}
                          />
                          <span className="text-sm text-muted-foreground w-16">{material?.unit || ""}</span>
                        </div>
                        {errors[`item-${index}-quantity`] && (
                          <p className="text-sm text-destructive">{errors[`item-${index}-quantity`]}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label>Ghi chú</Label>
                        <Input
                          placeholder="Ghi chú thêm..."
                          value={item.note}
                          onChange={(e) => updateItem(item.id, "note", e.target.value)}
                        />
                      </div>
                    </div>

                    {material && (
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-muted-foreground">
                          Tồn kho: <strong>{material.currentStock}</strong> {material.unit}
                        </span>
                        <span className="text-muted-foreground">
                          Tồn tối thiểu: <strong>{material.minStock}</strong> {material.unit}
                        </span>
                        {isLowStock && (
                          <Alert variant="destructive" className="py-1 px-2 inline-flex items-center gap-2">
                            <AlertCircle className="h-3 w-3" />
                            <AlertDescription className="text-xs">Tồn kho thấp!</AlertDescription>
                          </Alert>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Hủy
            </Button>
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" />
              Tạo phiếu đề nghị
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
