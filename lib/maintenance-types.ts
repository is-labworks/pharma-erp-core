// Equipment Maintenance Management Types

export type EquipmentStatus = "operational" | "maintenance" | "breakdown" | "idle";
export type MaintenanceType = "preventive" | "corrective" | "calibration";
export type MaintenancePriority = "low" | "medium" | "high" | "critical";

export interface Equipment {
  id: string;
  code: string; // EQ-MIX-001
  name: string; // "Máy trộn nguyên liệu 500L"
  category: string; // "Mixing", "Drying", "Packaging"
  location: string;
  manufacturer: string;
  model: string;
  serialNumber: string;
  purchaseDate: string;
  warrantyExpiry?: string;
  status: EquipmentStatus;
  lastMaintenanceDate?: string;
  nextMaintenanceDate?: string;
  operatingHours: number;
  documents: MaintenanceDocument[];
}

export interface MaintenanceSchedule {
  id: string;
  code: string; // MS-2025-0001
  equipmentId: string;
  equipmentCode: string;
  equipmentName: string;
  type: MaintenanceType;
  frequency: string; // "Hàng tháng", "Mỗi 3 tháng", "Hàng năm"
  frequencyDays: number; // 30, 90, 365
  lastPerformed?: string;
  nextDue: string;
  estimatedDuration: number; // hours
  assignedTo?: string;
  checklist: MaintenanceTask[];
  isActive: boolean;
}

export interface MaintenanceTask {
  id: string;
  description: string;
  isCompleted: boolean;
  completedBy?: string;
  completedAt?: string;
}

export interface MaintenanceRecord {
  id: string;
  code: string; // MR-2025-0001
  equipmentId: string;
  equipmentCode: string;
  equipmentName: string;
  scheduleId?: string; // if preventive
  type: MaintenanceType;
  priority: MaintenancePriority;
  description: string;
  reportedBy: string;
  reportedAt: string;
  assignedTo: string;
  scheduledDate: string;
  startedAt?: string;
  completedAt?: string;
  status: "scheduled" | "in_progress" | "completed" | "cancelled";
  tasks: MaintenanceTask[];
  spareParts: SparePart[];
  laborHours: number;
  cost: number;
  notes?: string;
  documents: MaintenanceDocument[];
}

export interface SparePart {
  id: string;
  materialId: string;
  materialName: string;
  quantity: number;
  unitCost: number;
}

export interface MaintenanceDocument {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadedAt: string;
}
