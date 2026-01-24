
// ===== Warehouse Management Types =====

// Inventory categories for pharmaceutical production
export type InventoryCategory = "raw_material" | "semi_finished" | "finished_goods"

// Inventory movement types  
export type MovementType = "in" | "out" | "adjustment" | "transfer"

// FIFO/FEFO strategy
export type StockStrategy = "FIFO" | "FEFO"

// Batch status
export type BatchStatus = "available" | "reserved" | "quarantine" | "expired" | "consumed"

// Batch/Lot with expiry tracking
export interface ProductionBatch {
  id: string
  batchNumber: string
  materialId?: string
  medicineId?: string
  productName: string
  productCode: string
  category: InventoryCategory
  manufacturingDate: string
  expiryDate: string
  quantity: number
  originalQuantity: number
  unit: string
  location: string
  status: BatchStatus
  qualityStatus?: "pending" | "approved" | "rejected"
  supplierName?: string
  poNumber?: string
  productionPlanId?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

// Stock movement transaction
export interface StockTransaction {
  id: string
  transactionNumber: string
  batchId: string
  batchNumber: string
  productId: string
  productName: string
  productCode: string
  category: InventoryCategory
  movementType: MovementType
  quantity: number
  unit: string
  beforeQuantity: number
  afterQuantity: number
  location: string
  fromLocation?: string
  toLocation?: string
  referenceType?: "production_plan" | "sales_order" | "purchase_order" | "manual" | "adjustment"
  referenceId?: string
  referenceCode?: string
  performedBy: string
  performedByName: string
  performedAt: string
  notes?: string
}

// Enhanced inventory with batch tracking
export interface BatchInventory {
  productId: string
  productName: string
  productCode: string
  category: InventoryCategory
  totalQuantity: number
  availableQuantity: number
  reservedQuantity: number
  consumedQuantity: number
  unit: string
  batches: ProductionBatch[]
  reorderPoint?: number
  locations: string[]
  lastUpdated: string
}

// Stock allocation using FIFO/FEFO
export interface StockAllocation {
  id: string
  requestId: string
  requestType: "production" | "sales"
  productId: string
  productName: string
  requestedQuantity: number
  unit: string
  strategy: StockStrategy
  allocations: {
    batchId: string
    batchNumber: string
    allocatedQuantity: number
    expiryDate: string
    location: string
  }[]
  status: "pending" | "allocated" | "issued" | "cancelled"
  createdAt: string
  allocatedBy?: string
  issuedAt?: string
}
