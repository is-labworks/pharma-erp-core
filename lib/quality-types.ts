// Quality Management Types

export type InspectionType = "incoming" | "in_process" | "final" | "batch_release";
export type TestStatus = "pending" | "in_progress" | "passed" | "failed";

// In-process quality check
export interface ProcessQualityCheck {
  id: string;
  code: string; // PQC-2025-0001
  productionPlanId: string;
  productionPlanCode: string;
  processStage: string; // "Phối trộn", "Sấy khô", "Đóng gói"
  batchNumber: string;
  checkDate: string;
  inspector: string;
  tests: QualityTest[];
  status: TestStatus;
  notes?: string;
}

// Final product inspection
export interface FinalInspection {
  id: string;
  code: string; // FI-2025-0001
  productionBatchId: string;
  batchNumber: string;
  medicineName: string;
  medicineCode: string;
  quantity: number;
  unit: string;
  inspectionDate: string;
  inspector: string;
  tests: QualityTest[];
  overallStatus: TestStatus;
  releaseApproved: boolean;
  approvedBy?: string;
  approvedAt?: string;
  documents: QualityDocument[];
}

// Quality test details
export interface QualityTest {
  id: string;
  testName: string; // "Độ ẩm", "Hàm lượng hoạt chất", "Vi sinh"
  testMethod: string;
  specification: string; // "≤ 5%"
  result: string; // "3.2%"
  status: TestStatus;
  testedBy: string;
  testedAt: string;
}

// Quality documents (CoA, etc)
export interface QualityDocument {
  id: string;
  type: "test_report" | "coa" | "batch_record" | "specification";
  name: string;
  url: string;
  uploadedBy: string;
  uploadedAt: string;
}
