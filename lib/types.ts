// Types for the Pharmaceutical Procurement Management System
export * from "./quality-types";
export * from "./maintenance-types";
export * from "./costing-types";


export type UserRole =
  | "requester" // Nhân viên đề xuất
  | "department_head" // Trưởng bộ phận
  | "procurement" // Phòng Mua hàng
  | "procurement_manager" // Quản lý Mua hàng
  | "qa_qc" // QA/QC
  | "warehouse" // Thủ kho
  | "accounting" // Kế toán
  | "director" // Ban Giám đốc
  | "admin" // Quản trị hệ thống
  | "production_planner"; // Hoạch định Sản xuất

export type RequestStatus =
  | "pending" // Chờ duyệt
  | "approved" // Đã duyệt
  | "rejected" // Từ chối
  | "processing" // Đang xử lý
  | "completed"; // Hoàn thành

export type QualityStatus =
  | "waiting" // Chờ kiểm nghiệm
  | "passed" // Đạt
  | "failed"; // Không đạt

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  avatar?: string;
}

export interface PurchaseRequisition {
  id: string;
  code: string;
  requesterId: string;
  requesterName: string;
  department: string;
  items: RequisitionItem[];
  purpose: string;
  requiredDate: string;
  status: RequestStatus;
  createdAt: string;
  updatedAt: string;
  approvalHistory: ApprovalStep[];
}

export interface RequisitionItem {
  id: string;
  materialId: string;
  materialName: string;
  materialCode: string;
  unit: string;
  quantity: number;
  currentStock: number;
  note?: string;
}

export interface ApprovalStep {
  id: string;
  approverId: string;
  approverName: string;
  role: string;
  status: RequestStatus;
  comment?: string;
  timestamp: string;
}

export interface Supplier {
  id: string;
  code: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  taxCode: string;
  gmpCertificate?: string;
  gmpExpiry?: string;
  coCertificate?: string;
  cqCertificate?: string;
  rating: number;
  status: "active" | "inactive" | "pending";
  transactionHistory: Transaction[];
}

export interface Transaction {
  id: string;
  poCode: string;
  date: string;
  amount: number;
  status: RequestStatus;
}

export interface RFQ {
  id: string;
  code: string;
  requisitionId: string;
  suppliers: string[];
  items: RFQItem[];
  deadline: string;
  status: "draft" | "sent" | "received" | "closed";
  createdAt: string;
}

export interface RFQItem {
  materialId: string;
  materialName: string;
  quantity: number;
  unit: string;
}

export interface Quotation {
  id: string;
  rfqId: string;
  supplierId: string;
  supplierName: string;
  items: QuotationItem[];
  deliveryTime: number;
  paymentTerms: string;
  validUntil: string;
  totalAmount: number;
  submittedAt: string;
}

export interface QuotationItem {
  materialId: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

export interface PurchaseOrder {
  id: string;
  code: string;
  supplierId: string;
  supplierName: string;
  requisitionId: string;
  quotationId: string;
  items: POItem[];
  totalAmount: number;
  status: RequestStatus;
  deliveryDate: string;
  paymentTerms: string;
  createdAt: string;
  approvedAt?: string;
  receivedAt?: string;
}

export interface POItem {
  materialId: string;
  materialName: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
}

export interface QualityInspection {
  id: string;
  code: string;
  poId: string;
  poCode: string;
  supplierId: string;
  supplierName: string;
  batchNumber: string;
  items: InspectionItem[];
  status: QualityStatus;
  inspectedBy?: string;
  inspectedAt?: string;
  documents: Document[];
}

export interface InspectionItem {
  materialId: string;
  materialName: string;
  quantity: number;
  result?: QualityStatus;
  notes?: string;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadedAt: string;
}

export interface InventoryItem {
  id: string;
  materialId: string;
  materialCode: string;
  materialName: string;
  batchNumber: string;
  quantity: number;
  unit: string;
  location: string;
  expiryDate: string;
  receivedDate: string;
  supplierId: string;
  supplierName: string;
  poId: string;
}

export interface Material {
  id: string;
  code: string;
  name: string;
  category: string;
  unit: string;
  minStock: number;
  currentStock: number;
  description?: string;
}

// Production Planning Types

export type ProductionLineType =
  | "tablet" // Viên nén
  | "capsule" // Viên nang
  | "liquid" // Thuốc nước
  | "syrup" // Xi-rô
  | "injection" // Thuốc tiêm
  | "ointment"; // Thuốc mềm

export type ShiftType =
  | "morning" // Ca sáng (6h-14h)
  | "afternoon" // Ca chiều (14h-22h)
  | "night"; // Ca đêm (22h-6h)

export type ProductionStatus =
  | "draft" // Bản nháp
  | "approved" // Đã duyệt
  | "in_progress" // Đang sản xuất
  | "completed" // Hoàn thành
  | "cancelled" // Đã hủy
  | "on_hold"; // Tạm dừng

export interface Medicine {
  id: string;
  code: string;
  name: string;
  type: ProductionLineType;
  dosage: string;
  unit: string;
  description?: string;
  registrationNumber?: string;
  materials: MedicineMaterial[];
}

export interface MedicineMaterial {
  materialId: string;
  materialName: string;
  quantityPerUnit: number;
  unit: string;
}

export interface SalesOrder {
  id: string;
  code: string;
  customerName: string;
  items: SalesOrderItem[];
  orderDate: string;
  requiredDate: string;
  status: "pending" | "planned" | "in_production" | "completed" | "cancelled";
  priority: "low" | "medium" | "high" | "urgent";
  createdAt: string;
  notes?: string;
}

export interface SalesOrderItem {
  id: string;
  medicineId: string;
  medicineName: string;
  medicineCode: string;
  quantity: number;
  unit: string;
}

export interface ProductionPlan {
  id: string;
  code: string;
  salesOrderId: string;
  salesOrderCode: string;
  plannerId: string;
  plannerName: string;
  items: ProductionPlanItem[];
  startDate: string;
  endDate: string;
  status: ProductionStatus;
  createdAt: string;
  updatedAt: string;
  approvedBy?: string;
  approvedAt?: string;
  notes?: string;
}

export interface ProductionPlanItem {
  id: string;
  medicineId: string;
  medicineName: string;
  medicineCode: string;
  medicineType: ProductionLineType;
  plannedQuantity: number;
  unit: string;
  productionLineId: string;
  estimatedDuration: number;
}

export interface ProductionLine {
  id: string;
  code: string;
  name: string;
  type: ProductionLineType;
  capacityPerShift: number;
  capacityUnit: string;
  status: "active" | "maintenance" | "inactive";
  description?: string;
}

export interface ProductionLineSchedule {
  id: string;
  productionLineId: string;
  productionLineName: string;
  productionPlanId: string;
  productionPlanCode: string;
  medicineId: string;
  medicineName: string;
  quantity: number;
  date: string;
  shift: ShiftType;
  status: ProductionStatus;
  assignedWorkers: number;
  actualQuantity?: number;
  notes?: string;
}

export interface ResourceAllocation {
  id: string;
  productionLineId: string;
  productionLineName: string;
  date: string;
  shift: ShiftType;
  assignedWorkers: number;
  requiredWorkers: number;
  machineryStatus: "operational" | "maintenance" | "faulty";
  utilizationRate: number;
  notes?: string;
}

export interface ProductionCapacity {
  productionLineId: string;
  productionLineName: string;
  type: ProductionLineType;
  dailyCapacity: number;
  weeklyCapacity: number;
  monthlyCapacity: number;
  unit: string;
  currentUtilization: number;
}

export interface ProductionScheduleDetail {
  date: string;
  schedules: ProductionLineSchedule[];
  totalPlanned: number;
  capacityUtilization: number;
}

// BOM (Bill of Materials) Management Types

export type MaterialCategory =
  | "raw_material" // Nguyên liệu chính
  | "excipient" // Tá dược
  | "packaging"; // Bao bì

export type FormulaStatus =
  | "draft" // Bản nháp
  | "active" // Đang áp dụng
  | "inactive" // Ngừng sử dụng
  | "obsolete"; // Lỗi thời

export interface BOMItem {
  id: string;
  materialId: string;
  materialCode: string;
  materialName: string;
  category: MaterialCategory;
  quantityPerUnit: number; // Định mức cho 1 đơn vị sản phẩm
  unit: string;
  wastagePercent: number; // Tỷ lệ hao hụt (%)
  notes?: string;
}

export interface BOMFormula {
  id: string;
  code: string;
  medicineId: string;
  medicineName: string;
  medicineCode: string;
  version: string; // e.g., "1.0", "2.0", "2.1"
  versionNumber: number; // For sorting
  status: FormulaStatus;
  bomItems: BOMItem[];
  batchSize: number; // Quy mô mẻ sản xuất (số lượng đơn vị)
  batchUnit: string;
  effectiveDate: string;
  expiryDate?: string;
  createdBy: string;
  createdAt: string;
  approvedBy?: string;
  approvedAt?: string;
  changeReason?: string; // Lý do thay đổi công thức
  notes?: string;
}

export interface FormulaVersion {
  id: string;
  formulaId: string;
  version: string;
  versionNumber: number;
  status: FormulaStatus;
  changeDate: string;
  changedBy: string;
  changeReason: string;
  changes: FormulaChange[];
}

export interface FormulaChange {
  type: "added" | "removed" | "modified";
  materialName: string;
  oldValue?: string;
  newValue?: string;
  description: string;
}

export interface MaterialRequirement {
  id: string;
  productionPlanId: string;
  productionPlanCode: string;
  medicineId: string;
  medicineName: string;
  formulaId: string;
  formulaVersion: string;
  plannedQuantity: number;
  requirements: MaterialRequirementItem[];
  totalMaterialCost?: number;
  calculatedAt: string;
}

export interface MaterialRequirementItem {
  materialId: string;
  materialCode: string;
  materialName: string;
  category: MaterialCategory;
  requiredQuantity: number; // Tổng số lượng cần (bao gồm hao hụt)
  unit: string;
  currentStock: number;
  shortage: number; // Số lượng thiếu (nếu < 0 thì đủ)
  unitCost?: number;
  totalCost?: number;
  suggestedPurchaseQuantity: number;
}

export interface BOMComparison {
  formulaId: string;
  medicineName: string;
  version1: string;
  version2: string;
  addedItems: BOMItem[];
  removedItems: BOMItem[];
  modifiedItems: {
    material: string;
    oldQuantity: number;
    newQuantity: number;
    difference: number;
  }[];
}
