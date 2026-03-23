export interface YtdMetrics {
  totalSpend: number;
  budgetCompletion: number; // percentage
  totalSavings: number;
  apiPercentage: number; // percentage
}

export const ytdMetrics: YtdMetrics = {
  totalSpend: 145000000000, // 145 Tỷ
  budgetCompletion: 85.5,
  totalSavings: 4200000000, // 4.2 Tỷ
  apiPercentage: 62.3, // 62.3% of total spend is API
};

export const spendTrends = [
  { month: "Jan", actual: 12000, budget: 13000 },
  { month: "Feb", actual: 14500, budget: 15000 },
  { month: "Mar", actual: 13200, budget: 14000 },
  { month: "Apr", actual: 16800, budget: 16000 },
  { month: "May", actual: 15500, budget: 16000 },
  { month: "Jun", actual: 18200, budget: 17500 },
];

export const spendByMaterial = [
  { name: "API (Hoạt chất)", value: 90335, color: "#3b82f6" },     // ~62.3%
  { name: "Tá dược", value: 24650, color: "#10b981" },            // ~17%
  { name: "Bao bì cấp 1 (Màng nhôm, Vỉ)", value: 15950, color: "#f59e0b" }, // ~11%
  { name: "Bao bì cấp 2 (Hộp giấy)", value: 10150, color: "#8b5cf6" }, // ~7%
  { name: "Vật tư phụ & Khác", value: 3915, color: "#64748b" },       // ~2.7%
];

export const topSuppliers = [
  { id: "SUP-001", name: "Zhejiang Runda Pharma", category: "API", spend: 45000000000, percentage: 31.0, riskLevel: "Low", trend: "+5%" },
  { id: "SUP-002", name: "Anhui Xinhua", category: "API", spend: 32000000000, percentage: 22.0, riskLevel: "Medium", trend: "-2%" },
  { id: "SUP-003", name: "Roquette Frères", category: "Tá dược", spend: 15000000000, percentage: 10.3, riskLevel: "Low", trend: "+1%" },
  { id: "SUP-004", name: "Amcor Flexibles", category: "Bao bì", spend: 12500000000, percentage: 8.6, riskLevel: "High", trend: "+12%" },
  { id: "SUP-005", name: "Colorcon", category: "Màng bao", spend: 8500000000, percentage: 5.8, riskLevel: "Low", trend: "-1%" },
];

export const expenseByDepartment = [
  { name: "Sản xuất thuốc viên", spend: 85000000000 },
  { name: "Sản xuất thuốc nước", spend: 42000000000 },
  { name: "Khối R&D", spend: 12000000000 },
  { name: "Khối QA/QC", spend: 6000000000 },
];

export const supplierKPIs = {
  activeStrategic: 12,
  otifRate: 94.5, // On-Time In-Full
  qualityPassRate: 98.2, // Tỷ lệ đạt QA/QC
  singleSourceApis: 3, // Cảnh báo đỏ: 3 hoạt chất quan trọng chỉ có 1 NCC
};

export const supplierScorecard = [
  { id: "SUP-001", name: "Zhejiang Runda Pharma", category: "API", quality: 98, delivery: 95, cost: 90, service: 88, overall: 94, status: "Preferred" },
  { id: "SUP-002", name: "Anhui Xinhua", category: "API", quality: 96, delivery: 92, cost: 95, service: 85, overall: 92, status: "Approved" },
  { id: "SUP-003", name: "Roquette Frères", category: "Tá dược", quality: 99, delivery: 98, cost: 80, service: 95, overall: 93, status: "Preferred" },
  { id: "SUP-004", name: "Amcor Flexibles", category: "Bao bì", quality: 95, delivery: 85, cost: 88, service: 90, overall: 89, status: "Watchlist" },
  { id: "SUP-005", name: "Colorcon", category: "Màng bao", quality: 99, delivery: 96, cost: 85, service: 92, overall: 93, status: "Preferred" },
];

export const coreApiSourcing = [
  {
    api: "Paracetamol",
    totalVol: "150 Tấn",
    vendors: [
      { name: "Anhui Xinhua", share: 65, color: "#3b82f6" },
      { name: "Hebei Jiheng", share: 35, color: "#94a3b8" }
    ]
  },
  {
    api: "Amoxicillin Trihydrate",
    totalVol: "80 Tấn",
    vendors: [
      { name: "CSPC Pharma", share: 100, color: "#ef4444", warning: true } // Single source
    ]
  },
  {
    api: "Ibuprofen",
    totalVol: "45 Tấn",
    vendors: [
      { name: "Zhejiang Runda", share: 50, color: "#10b981" },
      { name: "Shandong Xinhua", share: 50, color: "#3b82f6" }
    ]
  }
];

// For a Scatter chart or customized dot chart
export const supplierRiskMatrix = [
  { name: "Anhui Xinhua", spend: 32, risk: 40, category: "API" },
  { name: "Zhejiang Runda", spend: 45, risk: 20, category: "API" },
  { name: "CSPC Pharma", spend: 60, risk: 85, category: "API", warning: true }, // High spend, high risk (single source)
  { name: "Amcor Flexibles", spend: 12, risk: 70, category: "Bao bì" },
  { name: "Roquette", spend: 15, risk: 10, category: "Tá dược" },
  { name: "Colorcon", spend: 8, risk: 15, category: "Màng bao" },
];

export const highValueApprovals = [
  {
    id: "APP-PO-1049",
    type: "PO",
    title: "Nhập khẩu máy dập viên nén quay tròn (Tablet Press)",
    department: "Sản xuất thuốc viên",
    value: 4500000000,
    budgetStatus: "Trong ngân sách",
    date: "2026-03-20",
    description: "Nâng cấp dây chuyền sản xuất viên nén số 3. Đã so sánh 3 báo giá từ Đức, Ấn Độ, TQ.",
    urgency: "High",
    status: "Pending"
  },
  {
    id: "APP-PO-1052",
    type: "PO",
    title: "Hợp đồng nguyên tắc API Paracetamol Quý 3/2026",
    department: "Mua hàng",
    value: 12000000000,
    budgetStatus: "Vượt 5.2%",
    date: "2026-03-22",
    description: "Chốt giá sớm 20 tấn Paracetamol do dự báo biến động giá nguyên liệu từ Trung Quốc.",
    urgency: "Medium",
    status: "Pending"
  },
  {
    id: "APP-VD-082",
    type: "VENDOR",
    title: "Phê duyệt NCC Dược liệu: Sâm Ngọc Linh Kon Tum",
    department: "QA/QC & Mua hàng",
    value: 0,
    budgetStatus: "N/A",
    date: "2026-03-21",
    description: "Nhà cung cấp đạt chuẩn GACP-WHO. Điểm Audit QA 98/100. Đề xuất đưa vào danh sách Approved Vendor List (AVL).",
    urgency: "Medium",
    status: "Pending"
  },
  {
    id: "APP-RSK-015",
    type: "RISK",
    title: "Xử lý đứt gãy cung ứng màng nhôm ép vỉ",
    department: "Chuỗi cung ứng",
    value: 850000000,
    budgetStatus: "Phát sinh ngoài kế hoạch",
    date: "2026-03-23",
    description: "NCC chính (Amcor) hoãn giao hàng 3 tuần. Đề xuất mua khẩn cấp từ NCC phụ (Tân Phú) với giá cao hơn 18% để không dừng dây chuyền đóng gói.",
    urgency: "Critical",
    status: "Pending"
  }
];
