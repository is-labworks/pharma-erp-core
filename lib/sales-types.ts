// Sales Order Management Types for Dược Hậu Giang

// Customer Management Types
export type CustomerCategory =
  | "pharmacy" // Nhà thuốc
  | "hospital" // Bệnh viện
  | "distributor"; // Đại lý

export type DebtStatus =
  | "good" // Tốt - Thanh toán đúng hạn
  | "warning" // Cảnh báo - Gần hạn mức
  | "overdue" // Quá hạn
  | "blocked"; // Khóa - Vượt hạn mức

export interface Customer {
  id: string;
  code: string; // Mã khách hàng
  name: string;
  category: CustomerCategory;
  taxCode: string;
  address: string;
  district: string;
  city: string;
  phone: string;
  email: string;
  contactPerson: string; // Người liên hệ
  contactPhone: string;
  debtLimit: number; // Hạn mức công nợ
  currentDebt: number; // Công nợ hiện tại
  debtStatus: DebtStatus;
  paymentTerms: string; // Điều kiện thanh toán
  status: "active" | "inactive" | "suspended";
  registrationDate: string;
  lastOrderDate?: string;
  totalOrders: number;
  totalRevenue: number;
  notes?: string;
}

// Product/Medicine with Pricing
export interface ProductPrice {
  id: string;
  medicineId: string;
  customerCategory: CustomerCategory;
  unitPrice: number;
  discountPercent: number; // Chiết khấu theo loại KH
  effectiveFrom: string;
  effectiveTo?: string;
}

export interface InventoryBatch {
  id: string;
  batchNumber: string;
  quantity: number;
  expiryDate: string;
  manufactureDate: string;
  location: string;
  status: "available" | "reserved" | "expired" | "recalled";
}

// Extended Sales Order Types
export type OrderStatus =
  | "draft" // Nháp
  | "pending_approval" // Chờ phê duyệt
  | "approved" // Đã phê duyệt
  | "rejected" // Từ chối
  | "processing" // Đang xử lý
  | "ready_to_ship" // Sẵn sàng giao hàng
  | "shipped" // Đã xuất kho
  | "delivered" // Đã giao hàng
  | "invoiced" // Đã lập hóa đơn
  | "completed" // Hoàn thành
  | "cancelled"; // Đã hủy

export type PaymentMethod =
  | "cash" // Tiền mặt
  | "transfer" // Chuyển khoản
  | "credit"; // Công nợ

export interface SalesOrderItemExtended {
  id: string;
  medicineId: string;
  medicineName: string;
  medicineCode: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  discountPercent: number;
  discountAmount: number;
  subtotal: number; // Thành tiền trước VAT
  vatPercent: number;
  vatAmount: number;
  total: number; // Tổng cộng
  availableStock: number;
  notes?: string;
}

export interface SalesOrderExtended {
  id: string;
  code: string;
  customerId: string;
  customer: Customer;
  salesStaffId: string;
  salesStaffName: string;
  items: SalesOrderItemExtended[];
  orderDate: string;
  requiredDeliveryDate: string;
  status: OrderStatus;
  priority: "low" | "medium" | "high" | "urgent";
  // Pricing
  subtotal: number; // Tổng trước VAT và chiết khấu
  totalDiscount: number;
  vatAmount: number;
  totalAmount: number; // Tổng thanh toán
  // Payment
  paymentMethod: PaymentMethod;
  paymentTerms: string;
  // Approval
  approvalHistory: OrderApproval[];
  approvedBy?: string;
  approvedAt?: string;
  rejectedBy?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  // Delivery
  deliveryAddress?: string;
  deliveryNote?: string;
  estimatedDeliveryDate?: string;
  actualDeliveryDate?: string;
  // System
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  notes?: string;
}

// Order Approval Workflow
export interface OrderApproval {
  id: string;
  orderId: string;
  orderCode: string;
  approverId: string;
  approverName: string;
  approverRole: string;
  action: "approved" | "rejected" | "requested_changes";
  comment?: string;
  timestamp: string;
  validationChecks: ValidationCheck[];
}

export interface ValidationCheck {
  checkType:
    | "inventory" // Kiểm tra tồn kho
    | "debt_limit" // Kiểm tra hạn mức công nợ
    | "pricing" // Kiểm tra giá
    | "payment_terms" // Kiểm tra điều kiện thanh toán
    | "customer_status"; // Kiểm tra trạng thái KH
  status: "passed" | "warning" | "failed";
  message: string;
  details?: any;
}

// Warehouse Export & Delivery
export type DeliveryStatus =
  | "pending" // Chờ xuất kho
  | "preparing" // Đang soạn hàng
  | "ready" // Sẵn sàng giao
  | "in_transit" // Đang giao
  | "delivered" // Đã giao
  | "failed" // Giao thất bại
  | "returned"; // Trả hàng

export interface WarehouseExport {
  id: string;
  code: string; // Mã phiếu xuất kho
  orderId: string;
  orderCode: string;
  customerId: string;
  customerName: string;
  items: WarehouseExportItem[];
  exportDate: string;
  exportedBy: string;
  exportedByName: string;
  warehouseLocation: string;
  status: "draft" | "confirmed" | "completed";
  notes?: string;
}

export interface WarehouseExportItem {
  id: string;
  medicineId: string;
  medicineName: string;
  medicineCode: string;
  batchNumber: string;
  quantity: number;
  unit: string;
  expiryDate: string;
  location: string;
}

export interface Delivery {
  id: string;
  code: string; // Mã phiếu giao hàng
  orderId: string;
  orderCode: string;
  warehouseExportId: string;
  warehouseExportCode: string;
  customerId: string;
  customerName: string;
  deliveryAddress: string;
  deliveryDate: string;
  deliveryStatus: DeliveryStatus;
  deliveredBy?: string; // Người giao hàng
  receivedBy?: string; // Người nhận hàng
  receivedAt?: string;
  transportMethod: string; // Phương thức vận chuyển
  trackingNumber?: string;
  notes?: string;
}

// Invoice & Payment
export interface Invoice {
  id: string;
  code: string; // Số hóa đơn
  orderId: string;
  orderCode: string;
  customerId: string;
  customer: Customer;
  deliveryId: string;
  invoiceDate: string;
  items: InvoiceItem[];
  subtotal: number;
  vatAmount: number;
  totalAmount: number;
  status: "draft" | "issued" | "paid" | "overdue" | "cancelled";
  dueDate: string;
  paidAmount: number;
  remainingAmount: number;
  paymentStatus: "unpaid" | "partial" | "paid";
  createdBy: string;
  createdAt: string;
  issuedBy?: string;
  issuedAt?: string;
  notes?: string;
}

export interface InvoiceItem {
  id: string;
  medicineId: string;
  medicineName: string;
  medicineCode: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  discountPercent: number;
  discountAmount: number;
  subtotal: number;
  vatPercent: number;
  vatAmount: number;
  total: number;
}

export interface Payment {
  id: string;
  code: string; // Mã phiếu thu
  invoiceId: string;
  invoiceCode: string;
  customerId: string;
  customerName: string;
  paymentDate: string;
  paymentMethod: PaymentMethod;
  amount: number;
  receivedBy: string;
  receivedByName: string;
  bankAccount?: string;
  bankName?: string;
  transactionRef?: string;
  notes?: string;
  status: "pending" | "confirmed" | "cancelled";
  confirmedBy?: string;
  confirmedAt?: string;
}

// Customer Care
export type FeedbackType =
  | "complaint" // Khiếu nại
  | "suggestion" // Đề xuất
  | "praise" // Khen ngợi
  | "question"; // Thắc mắc

export type FeedbackStatus =
  | "new" // Mới
  | "in_progress" // Đang xử lý
  | "resolved" // Đã giải quyết
  | "closed"; // Đã đóng

export interface CustomerFeedback {
  id: string;
  code: string;
  customerId: string;
  customerName: string;
  type: FeedbackType;
  subject: string;
  description: string;
  status: FeedbackStatus;
  priority: "low" | "medium" | "high" | "urgent";
  orderId?: string;
  orderCode?: string;
  reportedDate: string;
  reportedBy: string;
  assignedTo?: string;
  assignedToName?: string;
  resolvedDate?: string;
  resolution?: string;
  notes?: string;
  rating?: number; // Customer satisfaction rating (1-5)
  response?: string; // Response to the feedback
  respondedBy?: string; // Name of person who responded
  createdAt?: string; // Timestamp when feedback was created
}

export interface CustomerCareSchedule {
  id: string;
  customerId: string;
  customerName: string;
  careType: "call" | "visit" | "email" | "promotion";
  subject: string;
  scheduledDate: string;
  assignedTo: string;
  assignedToName: string;
  status: "scheduled" | "completed" | "cancelled" | "rescheduled";
  completedDate?: string;
  outcome?: string;
  notes?: string;
}

export interface PromotionCampaign {
  id: string;
  code: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  targetCustomerCategories: CustomerCategory[];
  discountType: "percentage" | "fixed_amount" | "free_shipping";
  discountValue: number;
  minOrderAmount?: number;
  applicableProducts?: string[]; // Medicine IDs
  status: "draft" | "active" | "ended" | "cancelled";
  participantCount: number;
  totalRevenue: number;
  createdBy: string;
  createdAt: string;
}

// Reports & Statistics
export interface SalesReport {
  periodType: "daily" | "weekly" | "monthly" | "quarterly" | "yearly" | "custom";
  startDate: string;
  endDate: string;
  totalOrders: number;
  totalRevenue: number;
  totalCost: number;
  totalProfit: number;
  averageOrderValue: number;
  topProducts: ProductSalesStats[];
  topCustomers: CustomerSalesStats[];
  salesByCategory: CategorySalesStats[];
  salesByRegion: RegionSalesStats[];
}

export interface ProductSalesStats {
  medicineId: string;
  medicineName: string;
  medicineCode: string;
  quantitySold: number;
  revenue: number;
  orderCount: number;
}

export interface CustomerSalesStats {
  customerId: string;
  customerName: string;
  category: CustomerCategory;
  orderCount: number;
  revenue: number;
  averageOrderValue: number;
  lastOrderDate: string;
}

export interface CategorySalesStats {
  category: string;
  orderCount: number;
  revenue: number;
  percentageOfTotal: number;
}

export interface RegionSalesStats {
  city: string;
  orderCount: number;
  revenue: number;
  customerCount: number;
}

export interface InventoryExpiryAlert {
  medicineId: string;
  medicineName: string;
  medicineCode: string;
  batchNumber: string;
  quantity: number;
  expiryDate: string;
  daysUntilExpiry: number;
  location: string;
  alertLevel: "info" | "warning" | "critical";
}

export interface DebtAgingReport {
  customerId: string;
  customerName: string;
  category: CustomerCategory;
  totalDebt: number;
  current: number; // 0-30 ngày
  days30: number; // 31-60 ngày
  days60: number; // 61-90 ngày
  days90Plus: number; // >90 ngày
  debtStatus: DebtStatus;
  lastPaymentDate?: string;
}
