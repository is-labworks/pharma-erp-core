// Production Costing Types

export type CostCategory = "material" | "labor" | "overhead";
export type CostStatus = "draft" | "calculating" | "completed" | "approved";

// Material cost for a batch
export interface MaterialCost {
  id: string;
  materialId: string;
  materialCode: string;
  materialName: string;
  quantity: number;
  unit: string;
  unitCost: number; // weighted average
  totalCost: number;
  batchNumber: string;
  category: "raw_material" | "packaging";
}

// Direct labor cost
export interface LaborCost {
  id: string;
  employeeName: string;
  position: string;
  shiftDate: string;
  hours: number;
  hourlyRate: number;
  totalCost: number;
  productionPlanId: string;
}

// Manufacturing overhead allocation
export interface OverheadCost {
  id: string;
  category: string; // "Khấu hao máy móc", "Điện nước", "Nhân công gián tiếp"
  totalAmount: number;
  allocationBase: "machine_hours" | "direct_labor_hours" | "units_produced";
  allocationRate: number;
  allocatedAmount: number;
}

// Complete batch costing
export interface BatchCosting {
  id: string;
  code: string; // BC-2025-0001
  productionBatchId: string;
  batchNumber: string;
  medicineName: string;
  medicineCode: string;
  quantityProduced: number;
  unit: string;
  productionStartDate: string;
  productionEndDate: string;
  
  // Cost breakdown
  materialCosts: MaterialCost[];
  laborCosts: LaborCost[];
  overheadCosts: OverheadCost[];
  
  // Totals
  totalMaterialCost: number;
  totalLaborCost: number;
  totalOverheadCost: number;
  totalCost: number;
  
  // Unit cost
  costPerUnit: number;
  
  status: CostStatus;
  calculatedBy?: string;
  calculatedAt?: string;
  approvedBy?: string;
  approvedAt?: string;
  notes?: string;
}

// Cost allocation settings
export interface CostAllocationRule {
  id: string;
  overheadCategory: string;
  allocationBase: "machine_hours" | "direct_labor_hours" | "units_produced";
  rate: number; // VND per hour or per unit
  isActive: boolean;
}
