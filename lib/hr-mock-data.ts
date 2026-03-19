import type {
  KeHoachNhanLuc,
  YeuCauTuyenDung,
  TieuChiTuyenDung,
  UngVien,
  LichPhongVan,
  PhieuDanhGiaUngVien,
  Offer,
  HopDongThuViec,
  DM_PhongBan,
  DM_ViTriCongViec,
} from "./hr-types";

// ─── Danh mục Phòng ban ──────────────────────────────────────────────────────

export const dm_phongBan: DM_PhongBan[] = [
  { maPhongBan: "PB-SX", tenPhongBan: "Phòng Sản xuất (GMP)", khoiChucNang: "san_xuat_gmp", truongPhongId: "user-sx-lead" },
  { maPhongBan: "PB-QA", tenPhongBan: "Phòng QA/QC/Kiểm nghiệm", khoiChucNang: "qa_qc", truongPhongId: "user-qa-lead" },
  { maPhongBan: "PB-RD", tenPhongBan: "Phòng R&D/RA", khoiChucNang: "rd_ra", truongPhongId: "user-rd-lead" },
  { maPhongBan: "PB-KHO", tenPhongBan: "Phòng Kho (GSP/GDP)", khoiChucNang: "kho_gsp", truongPhongId: "user-kho-lead" },
  { maPhongBan: "PB-KD", tenPhongBan: "Phòng Kinh doanh Dược", khoiChucNang: "kinh_doanh", truongPhongId: "user-kd-lead" },
  { maPhongBan: "PB-HC", tenPhongBan: "Phòng Hành chính - Nhân sự", khoiChucNang: "back_office", truongPhongId: "user-hc-lead" },
  { maPhongBan: "PB-KT", tenPhongBan: "Phòng Kế toán - Tài chính", khoiChucNang: "back_office", truongPhongId: "user-kt-lead" },
];

// ─── Danh mục Vị trí Công việc ───────────────────────────────────────────────

export const dm_viTriCongViec: DM_ViTriCongViec[] = [
  {
    maViTri: "VT-SX-001", tenViTri: "Kỹ thuật viên Sản xuất GMP", maPhongBan: "PB-SX",
    capBac: "Junior", yeuCauBangCap: "Cao đẳng Dược/Hóa", yeuCauKinhNghiem: 1,
    tieuChiDacThu: ["GMP", "ATVSLĐ"], mucLuongCoBan: 9000000,
  },
  {
    maViTri: "VT-SX-002", tenViTri: "Trưởng ca Sản xuất", maPhongBan: "PB-SX",
    capBac: "Lead", yeuCauBangCap: "Đại học Dược/Hóa", yeuCauKinhNghiem: 3,
    tieuChiDacThu: ["GMP", "HACCP", "ATVSLĐ"], mucLuongCoBan: 15000000,
  },
  {
    maViTri: "VT-QA-001", tenViTri: "Chuyên viên QA", maPhongBan: "PB-QA",
    capBac: "Senior", yeuCauBangCap: "Đại học Dược", yeuCauKinhNghiem: 2,
    tieuChiDacThu: ["GMP", "GLP", "ISO 9001", "CAPA"], mucLuongCoBan: 14000000,
  },
  {
    maViTri: "VT-QC-001", tenViTri: "Kiểm nghiệm viên QC", maPhongBan: "PB-QA",
    capBac: "Junior", yeuCauBangCap: "Đại học Dược/Hóa phân tích", yeuCauKinhNghiem: 1,
    tieuChiDacThu: ["GLP", "HPLC", "GC-MS", "Thiết bị phân tích"], mucLuongCoBan: 10000000,
  },
  {
    maViTri: "VT-RD-001", tenViTri: "Nghiên cứu viên R&D", maPhongBan: "PB-RD",
    capBac: "Senior", yeuCauBangCap: "Thạc sĩ Dược/Hóa", yeuCauKinhNghiem: 3,
    tieuChiDacThu: ["GLP", "Nghiên cứu công thức", "ICH Guidelines"], mucLuongCoBan: 18000000,
  },
  {
    maViTri: "VT-RA-001", tenViTri: "Chuyên viên Đăng ký thuốc (RA)", maPhongBan: "PB-RD",
    capBac: "Senior", yeuCauBangCap: "Đại học Dược", yeuCauKinhNghiem: 2,
    tieuChiDacThu: ["CTD/eCTD", "ICH", "Luật Dược Việt Nam"], mucLuongCoBan: 16000000,
  },
  {
    maViTri: "VT-KHO-001", tenViTri: "Thủ kho Dược phẩm (GSP)", maPhongBan: "PB-KHO",
    capBac: "Junior", yeuCauBangCap: "Cao đẳng Dược", yeuCauKinhNghiem: 1,
    tieuChiDacThu: ["GSP", "GDP", "FEFO", "Nhiệt ẩm kế"], mucLuongCoBan: 8500000,
  },
  {
    maViTri: "VT-KHO-002", tenViTri: "Trưởng kho GSP/GDP", maPhongBan: "PB-KHO",
    capBac: "Lead", yeuCauBangCap: "Đại học Dược", yeuCauKinhNghiem: 3,
    tieuChiDacThu: ["GSP", "GDP", "FEFO", "Quản lý kho lạnh"], mucLuongCoBan: 14000000,
  },
  {
    maViTri: "VT-KD-001", tenViTri: "Trình dược viên", maPhongBan: "PB-KD",
    capBac: "Junior", yeuCauBangCap: "Đại học Dược", yeuCauKinhNghiem: 0,
    tieuChiDacThu: ["Kỹ năng bán hàng Dược"], mucLuongCoBan: 12000000,
  },
  {
    maViTri: "VT-HC-001", tenViTri: "Chuyên viên Nhân sự", maPhongBan: "PB-HC",
    capBac: "Junior", yeuCauBangCap: "Đại học Quản trị/Luật", yeuCauKinhNghiem: 1,
    tieuChiDacThu: [], mucLuongCoBan: 10000000,
  },
];

// ─── Kế hoạch Nhân lực ──────────────────────────────────────────────────────

export const keHoachNhanLuc: KeHoachNhanLuc[] = [
  {
    maKeHoach: "KHNL-2026-001",
    nam: 2026, thang: 3,
    maPhongBan: "PB-SX", tenPhongBan: "Phòng Sản xuất (GMP)",
    maViTri: "VT-SX-001", tenViTri: "Kỹ thuật viên Sản xuất GMP",
    dinhBien: 20, hienCo: 16, duBaoNghiViec: 2, soLuongCanTuyen: 6,
    lyDo: "Mở rộng dây chuyền sản xuất viên nén số 3 theo kế hoạch Q2/2026",
    nguoiLap: "user-sx-lead", tenNguoiLap: "Nguyễn Minh Tuấn",
    trangThai: "da_duyet",
    ngayLap: "2026-02-10", ngayDuyet: "2026-02-15",
    nguoiDuyet: "user-8", tenNguoiDuyet: "Ngô Thị Hương",
  },
  {
    maKeHoach: "KHNL-2026-002",
    nam: 2026, thang: 3,
    maPhongBan: "PB-QA", tenPhongBan: "Phòng QA/QC/Kiểm nghiệm",
    maViTri: "VT-QC-001", tenViTri: "Kiểm nghiệm viên QC",
    dinhBien: 10, hienCo: 8, duBaoNghiViec: 1, soLuongCanTuyen: 3,
    lyDo: "Bổ sung nhân lực cho lab kiểm nghiệm theo yêu cầu GMP audit Q3/2026",
    nguoiLap: "user-qa-lead", tenNguoiLap: "Lê Thị Phương Anh",
    trangThai: "da_duyet",
    ngayLap: "2026-02-12", ngayDuyet: "2026-02-18",
    nguoiDuyet: "user-8", tenNguoiDuyet: "Ngô Thị Hương",
  },
  {
    maKeHoach: "KHNL-2026-003",
    nam: 2026, thang: 4,
    maPhongBan: "PB-KHO", tenPhongBan: "Phòng Kho (GSP/GDP)",
    maViTri: "VT-KHO-001", tenViTri: "Thủ kho Dược phẩm (GSP)",
    dinhBien: 8, hienCo: 7, duBaoNghiViec: 1, soLuongCanTuyen: 2,
    lyDo: "Thay thế nhân viên nghỉ thai sản + mở thêm kho lạnh GDP",
    nguoiLap: "user-kho-lead", tenNguoiLap: "Trần Văn Hải",
    trangThai: "cho_duyet",
    ngayLap: "2026-03-01",
  },
  {
    maKeHoach: "KHNL-2026-004",
    nam: 2026, thang: 4,
    maPhongBan: "PB-RD", tenPhongBan: "Phòng R&D/RA",
    maViTri: "VT-RA-001", tenViTri: "Chuyên viên Đăng ký thuốc (RA)",
    dinhBien: 5, hienCo: 3, duBaoNghiViec: 0, soLuongCanTuyen: 2,
    lyDo: "Mở rộng danh mục đăng ký theo chiến lược R&D 2026-2028",
    nguoiLap: "user-rd-lead", tenNguoiLap: "Phạm Thị Lan",
    trangThai: "cho_duyet",
    ngayLap: "2026-03-05",
  },
  {
    maKeHoach: "KHNL-2026-005",
    nam: 2026, thang: 5,
    maPhongBan: "PB-KD", tenPhongBan: "Phòng Kinh doanh Dược",
    maViTri: "VT-KD-001", tenViTri: "Trình dược viên",
    dinhBien: 30, hienCo: 25, duBaoNghiViec: 3, soLuongCanTuyen: 8,
    lyDo: "Mở rộng thị trường miền Trung và Tây Nguyên Q3/2026",
    nguoiLap: "user-kd-lead", tenNguoiLap: "Hoàng Đức Thịnh",
    trangThai: "nhap",
    ngayLap: "2026-03-10",
  },
  {
    maKeHoach: "KHNL-2026-006",
    nam: 2026, thang: 3,
    maPhongBan: "PB-QA", tenPhongBan: "Phòng QA/QC/Kiểm nghiệm",
    maViTri: "VT-QA-001", tenViTri: "Chuyên viên QA",
    dinhBien: 6, hienCo: 5, duBaoNghiViec: 1, soLuongCanTuyen: 2,
    lyDo: "Bổ sung để chuẩn bị GMP audit EU PIC/S",
    nguoiLap: "user-qa-lead", tenNguoiLap: "Lê Thị Phương Anh",
    trangThai: "tu_choi",
    ngayLap: "2026-01-20", ngayDuyet: "2026-01-28",
    nguoiDuyet: "user-8", tenNguoiDuyet: "Ngô Thị Hương",
    lyDoTuChoi: "Ngân sách Q1 không đủ, lùi sang Q2/2026",
  },
];

// ─── Yêu cầu Tuyển dụng ─────────────────────────────────────────────────────

export const yeuCauTuyenDung: YeuCauTuyenDung[] = [
  {
    maYeuCau: "YCTD-2026-001",
    maKeHoach: "KHNL-2026-001",
    maPhongBan: "PB-SX", tenPhongBan: "Phòng Sản xuất (GMP)",
    maViTri: "VT-SX-001", tenViTri: "Kỹ thuật viên Sản xuất GMP",
    soLuong: 6,
    moTaCongViec: "Vận hành máy móc thiết bị sản xuất viên nén theo qui trình GMP. Thực hiện vệ sinh thiết bị, khu vực sản xuất. Ghi chép hồ sơ sản xuất (batch record). Tuân thủ các SOP, GMP và quy định ATVSLĐ.",
    mucLuongMin: 8000000, mucLuongMax: 12000000,
    ngayCanNhanSu: "2026-04-01",
    trangThai: "dang_tuyen",
    nguoiTao: "user-sx-lead", tenNguoiTao: "Nguyễn Minh Tuấn",
    ngayTao: "2026-02-16",
    trangThaiDuyet: "da_duyet",
    lichSuDuyet: [
      { id: "bdd-01", nguoiDuyet: "user-sx-lead", tenNguoiDuyet: "Nguyễn Minh Tuấn", vaiTro: "Trưởng phòng SX", trangThai: "dong_y", ghiChu: "Đồng ý, cần gấp", thoiGian: "2026-02-16T09:00:00Z" },
      { id: "bdd-02", nguoiDuyet: "user-hr-mgr", tenNguoiDuyet: "Nguyễn Hr Quản lý", vaiTro: "HR Manager", trangThai: "dong_y", ghiChu: "Phù hợp định biên", thoiGian: "2026-02-17T14:00:00Z" },
      { id: "bdd-03", nguoiDuyet: "user-8", tenNguoiDuyet: "Ngô Thị Hương", vaiTro: "Ban Giám đốc", trangThai: "dong_y", ghiChu: "Đã duyệt", thoiGian: "2026-02-18T10:00:00Z" },
    ],
    tongUngVien: 18, tongDatYeuCau: 4,
  },
  {
    maYeuCau: "YCTD-2026-002",
    maKeHoach: "KHNL-2026-002",
    maPhongBan: "PB-QA", tenPhongBan: "Phòng QA/QC/Kiểm nghiệm",
    maViTri: "VT-QC-001", tenViTri: "Kiểm nghiệm viên QC",
    soLuong: 3,
    moTaCongViec: "Thực hiện kiểm nghiệm nguyên liệu đầu vào, bán thành phẩm và thành phẩm theo tiêu chuẩn GLP. Vận hành thiết bị phân tích HPLC, GC, UV-Vis. Lập phiếu kiểm nghiệm và lưu trữ hồ sơ theo GLP/GMP.",
    mucLuongMin: 9000000, mucLuongMax: 13000000,
    ngayCanNhanSu: "2026-04-15",
    trangThai: "dang_tuyen",
    nguoiTao: "user-qa-lead", tenNguoiTao: "Lê Thị Phương Anh",
    ngayTao: "2026-02-19",
    trangThaiDuyet: "da_duyet",
    lichSuDuyet: [
      { id: "bdd-04", nguoiDuyet: "user-qa-lead", tenNguoiDuyet: "Lê Thị Phương Anh", vaiTro: "Trưởng phòng QA", trangThai: "dong_y", thoiGian: "2026-02-19T08:00:00Z" },
      { id: "bdd-05", nguoiDuyet: "user-hr-mgr", tenNguoiDuyet: "Nguyễn HR Quản lý", vaiTro: "HR Manager", trangThai: "dong_y", thoiGian: "2026-02-20T11:00:00Z" },
      { id: "bdd-06", nguoiDuyet: "user-8", tenNguoiDuyet: "Ngô Thị Hương", vaiTro: "Ban Giám đốc", trangThai: "dong_y", thoiGian: "2026-02-21T09:00:00Z" },
    ],
    tongUngVien: 11, tongDatYeuCau: 2,
  },
  {
    maYeuCau: "YCTD-2026-003",
    maKeHoach: "KHNL-2026-003",
    maPhongBan: "PB-KHO", tenPhongBan: "Phòng Kho (GSP/GDP)",
    maViTri: "VT-KHO-001", tenViTri: "Thủ kho Dược phẩm (GSP)",
    soLuong: 2,
    moTaCongViec: "Tiếp nhận, lưu trữ, cấp phát và kiểm soát hàng hóa theo tiêu chuẩn GSP/GDP. Thực hiện FEFO trong xuất kho. Theo dõi điều kiện bảo quản (nhiệt độ, độ ẩm). Ghi chép phiếu nhập/xuất kho.",
    mucLuongMin: 7500000, mucLuongMax: 10000000,
    ngayCanNhanSu: "2026-05-01",
    trangThai: "mo",
    nguoiTao: "user-kho-lead", tenNguoiTao: "Trần Văn Hải",
    ngayTao: "2026-03-05",
    trangThaiDuyet: "cho_duyet",
    lichSuDuyet: [
      { id: "bdd-07", nguoiDuyet: "user-kho-lead", tenNguoiDuyet: "Trần Văn Hải", vaiTro: "Trưởng kho", trangThai: "dong_y", thoiGian: "2026-03-05T10:00:00Z" },
      { id: "bdd-08", nguoiDuyet: "user-hr-mgr", tenNguoiDuyet: "Nguyễn HR Quản lý", vaiTro: "HR Manager", trangThai: "cho", thoiGian: undefined },
    ],
    tongUngVien: 0, tongDatYeuCau: 0,
  },
  {
    maYeuCau: "YCTD-2026-004",
    maPhongBan: "PB-RD", tenPhongBan: "Phòng R&D/RA",
    maViTri: "VT-RD-001", tenViTri: "Nghiên cứu viên R&D",
    soLuong: 1,
    moTaCongViec: "Nghiên cứu và phát triển công thức bào chế mới. Thực hiện nghiên cứu độ ổn định theo ICH. Viết và review hồ sơ kỹ thuật (DMF, CTD). Phối hợp với RA trong quá trình đăng ký sản phẩm.",
    mucLuongMin: 16000000, mucLuongMax: 22000000,
    ngayCanNhanSu: "2026-05-15",
    trangThai: "mo",
    nguoiTao: "user-rd-lead", tenNguoiTao: "Phạm Thị Lan",
    ngayTao: "2026-03-08",
    trangThaiDuyet: "duyet_truong_bp",
    lichSuDuyet: [
      { id: "bdd-09", nguoiDuyet: "user-rd-lead", tenNguoiDuyet: "Phạm Thị Lan", vaiTro: "Trưởng phòng R&D", trangThai: "dong_y", thoiGian: "2026-03-08T09:00:00Z" },
      { id: "bdd-10", nguoiDuyet: "user-hr-mgr", tenNguoiDuyet: "Nguyễn HR Quản lý", vaiTro: "HR Manager", trangThai: "cho" },
    ],
    tongUngVien: 0, tongDatYeuCau: 0,
  },
];

// ─── Tiêu chí Tuyển dụng ────────────────────────────────────────────────────

export const tieuChiTuyenDung: TieuChiTuyenDung[] = [
  // YCTD-2026-001 SX GMP
  { maTieuChi: "TC-001", maYeuCau: "YCTD-2026-001", loai: "bat_buoc", noiDung: "Tốt nghiệp Cao đẳng Dược hoặc Hóa trở lên", trongSo: 10 },
  { maTieuChi: "TC-002", maYeuCau: "YCTD-2026-001", loai: "bat_buoc", noiDung: "Am hiểu quy trình GMP và ATVSLĐ", trongSo: 9 },
  { maTieuChi: "TC-003", maYeuCau: "YCTD-2026-001", loai: "uu_tien", noiDung: "Có kinh nghiệm vận hành máy dập viên, máy bao phim", trongSo: 7 },
  { maTieuChi: "TC-004", maYeuCau: "YCTD-2026-001", loai: "uu_tien", noiDung: "Có chứng chỉ GMP cơ bản", trongSo: 6 },

  // YCTD-2026-002 QC
  { maTieuChi: "TC-005", maYeuCau: "YCTD-2026-002", loai: "bat_buoc", noiDung: "Tốt nghiệp Đại học Dược hoặc Hóa phân tích", trongSo: 10 },
  { maTieuChi: "TC-006", maYeuCau: "YCTD-2026-002", loai: "bat_buoc", noiDung: "Am hiểu nguyên lý và vận hành HPLC", trongSo: 10 },
  { maTieuChi: "TC-007", maYeuCau: "YCTD-2026-002", loai: "bat_buoc", noiDung: "Am hiểu GLP và hệ thống quản lý chất lượng phòng lab", trongSo: 9 },
  { maTieuChi: "TC-008", maYeuCau: "YCTD-2026-002", loai: "uu_tien", noiDung: "Có kinh nghiệm vận hành GC-MS, UV-Vis, Karl Fischer", trongSo: 7 },
  { maTieuChi: "TC-009", maYeuCau: "YCTD-2026-002", loai: "uu_tien", noiDung: "Đọc hiểu tài liệu kỹ thuật tiếng Anh", trongSo: 5 },

  // YCTD-2026-003 KHO
  { maTieuChi: "TC-010", maYeuCau: "YCTD-2026-003", loai: "bat_buoc", noiDung: "Tốt nghiệp Cao đẳng Dược trở lên", trongSo: 10 },
  { maTieuChi: "TC-011", maYeuCau: "YCTD-2026-003", loai: "bat_buoc", noiDung: "Am hiểu GSP/GDP và nguyên tắc FEFO", trongSo: 10 },
  { maTieuChi: "TC-012", maYeuCau: "YCTD-2026-003", loai: "bat_buoc", noiDung: "Biết sử dụng thiết bị theo dõi nhiệt độ, độ ẩm", trongSo: 8 },
  { maTieuChi: "TC-013", maYeuCau: "YCTD-2026-003", loai: "uu_tien", noiDung: "Có kinh nghiệm quản lý kho lạnh (2-8°C, < -18°C)", trongSo: 7 },
];

// ─── Ứng viên ────────────────────────────────────────────────────────────────

export const ungVien: UngVien[] = [
  // === YCTD-2026-001: KTV SX GMP (6 cần tuyển) ===
  {
    maUngVien: "UV-001", hoTen: "Nguyễn Thành Đạt", sdt: "0901234567", email: "dat.nguyen@gmail.com",
    trinhDo: "Cao đẳng Dược", chuyenNganh: "Dược học", namKinhNghiem: 2,
    maYeuCau: "YCTD-2026-001", tenViTri: "KTV Sản xuất GMP", tenPhongBan: "Phòng Sản xuất",
    trangThaiPipeline: "offer", nguon: "website", ngayNop: "2026-02-20",
    hoSoHopLe: { cccd: true, bangCap: true, khamSucKhoe: true, lyLich: true },
  },
  {
    maUngVien: "UV-002", hoTen: "Trần Thị Mỹ Linh", sdt: "0912345678", email: "linh.tran@gmail.com",
    trinhDo: "Cao đẳng Dược", chuyenNganh: "Dược sĩ cao đẳng", namKinhNghiem: 1,
    maYeuCau: "YCTD-2026-001", tenViTri: "KTV Sản xuất GMP", tenPhongBan: "Phòng Sản xuất",
    trangThaiPipeline: "nhan_viec", nguon: "referral", ngayNop: "2026-02-21",
    hoSoHopLe: { cccd: true, bangCap: true, khamSucKhoe: true, lyLich: true },
  },
  {
    maUngVien: "UV-003", hoTen: "Lê Văn Bình", sdt: "0923456789", email: "binh.le@gmail.com",
    trinhDo: "Cao đẳng Hóa", chuyenNganh: "Hóa học", namKinhNghiem: 3,
    maYeuCau: "YCTD-2026-001", tenViTri: "KTV Sản xuất GMP", tenPhongBan: "Phòng Sản xuất",
    trangThaiPipeline: "pv_chuyen_mon", nguon: "truong_dh", ngayNop: "2026-02-22",
    hoSoHopLe: { cccd: true, bangCap: true, khamSucKhoe: false, lyLich: true },
  },
  {
    maUngVien: "UV-004", hoTen: "Phạm Thị Hoa", sdt: "0934567890", email: "hoa.pham@gmail.com",
    trinhDo: "Đại học Dược", chuyenNganh: "Dược học", namKinhNghiem: 1,
    maYeuCau: "YCTD-2026-001", tenViTri: "KTV Sản xuất GMP", tenPhongBan: "Phòng Sản xuất",
    trangThaiPipeline: "pv_hr", nguon: "linkedin", ngayNop: "2026-02-23",
    hoSoHopLe: { cccd: true, bangCap: false, khamSucKhoe: false, lyLich: false },
  },
  {
    maUngVien: "UV-005", hoTen: "Vũ Đức Mạnh", sdt: "0945678901", email: "manh.vu@gmail.com",
    trinhDo: "Cao đẳng Dược", chuyenNganh: "Dược sĩ cao đẳng", namKinhNghiem: 0,
    maYeuCau: "YCTD-2026-001", tenViTri: "KTV Sản xuất GMP", tenPhongBan: "Phòng Sản xuất",
    trangThaiPipeline: "test", nguon: "website", ngayNop: "2026-02-24",
    hoSoHopLe: { cccd: true, bangCap: true, khamSucKhoe: false, lyLich: false },
  },
  {
    maUngVien: "UV-006", hoTen: "Hoàng Thị Nhung", sdt: "0956789012", email: "nhung.hoang@gmail.com",
    trinhDo: "Trung cấp Dược", chuyenNganh: "Kỹ thuật dược", namKinhNghiem: 1,
    maYeuCau: "YCTD-2026-001", tenViTri: "KTV Sản xuất GMP", tenPhongBan: "Phòng Sản xuất",
    trangThaiPipeline: "loai", nguon: "website", ngayNop: "2026-02-25",
    lyDoLoai: "bang_cap_khong_phu_hop",
    hoSoHopLe: { cccd: true, bangCap: true, khamSucKhoe: false, lyLich: false },
  },
  {
    maUngVien: "UV-007", hoTen: "Đinh Quốc Tuấn", sdt: "0967890123", email: "tuan.dinh@gmail.com",
    trinhDo: "Cao đẳng Hóa", chuyenNganh: "Kỹ thuật hóa", namKinhNghiem: 2,
    maYeuCau: "YCTD-2026-001", tenViTri: "KTV Sản xuất GMP", tenPhongBan: "Phòng Sản xuất",
    trangThaiPipeline: "tham_dinh", nguon: "referral", ngayNop: "2026-02-26",
    hoSoHopLe: { cccd: true, bangCap: true, khamSucKhoe: true, lyLich: false },
  },

  // === YCTD-2026-002: KNV QC (3 cần tuyển) ===
  {
    maUngVien: "UV-008", hoTen: "Ngô Thị Thảo", sdt: "0978901234", email: "thao.ngo@gmail.com",
    trinhDo: "Đại học Dược", chuyenNganh: "Hóa dược - Kiểm nghiệm", namKinhNghiem: 2,
    maYeuCau: "YCTD-2026-002", tenViTri: "Kiểm nghiệm viên QC", tenPhongBan: "Phòng QA/QC",
    trangThaiPipeline: "offer", nguon: "linkedin", ngayNop: "2026-02-28",
    hoSoHopLe: { cccd: true, bangCap: true, khamSucKhoe: true, lyLich: true },
  },
  {
    maUngVien: "UV-009", hoTen: "Bùi Văn Long", sdt: "0989012345", email: "long.bui@gmail.com",
    trinhDo: "Đại học Hóa phân tích", chuyenNganh: "Hóa phân tích", namKinhNghiem: 3,
    maYeuCau: "YCTD-2026-002", tenViTri: "Kiểm nghiệm viên QC", tenPhongBan: "Phòng QA/QC",
    trangThaiPipeline: "pv_chuyen_mon", nguon: "head_hunter", ngayNop: "2026-03-01",
    hoSoHopLe: { cccd: true, bangCap: true, khamSucKhoe: true, lyLich: false },
  },
  {
    maUngVien: "UV-010", hoTen: "Lý Thị Mộng Tuyền", sdt: "0990123456", email: "tuyen.ly@gmail.com",
    trinhDo: "Đại học Dược", chuyenNganh: "Dược lý – Kiểm nghiệm", namKinhNghiem: 1,
    maYeuCau: "YCTD-2026-002", tenViTri: "Kiểm nghiệm viên QC", tenPhongBan: "Phòng QA/QC",
    trangThaiPipeline: "sang_loc", nguon: "truong_dh", ngayNop: "2026-03-05",
    hoSoHopLe: { cccd: true, bangCap: true, khamSucKhoe: false, lyLich: false },
  },
  {
    maUngVien: "UV-011", hoTen: "Trương Minh Khoa", sdt: "0901112233", email: "khoa.truong@gmail.com",
    trinhDo: "Đại học Dược", chuyenNganh: "Kiểm nghiệm Dược phẩm", namKinhNghiem: 4,
    maYeuCau: "YCTD-2026-002", tenViTri: "Kiểm nghiệm viên QC", tenPhongBan: "Phòng QA/QC",
    trangThaiPipeline: "nhan_viec", nguon: "head_hunter", ngayNop: "2026-03-02",
    hoSoHopLe: { cccd: true, bangCap: true, khamSucKhoe: true, lyLich: true },
  },
];

// ─── Lịch Phỏng vấn ──────────────────────────────────────────────────────────

export const lichPhongVan: LichPhongVan[] = [
  {
    maLich: "LPV-001", maUngVien: "UV-001", tenUngVien: "Nguyễn Thành Đạt", maYeuCau: "YCTD-2026-001",
    vongPV: "Vòng 2 - Chuyên môn", thoiGian: "2026-03-05T09:00:00Z", diaDiem: "Phòng họp A201",
    nguoiPV: ["user-sx-lead", "user-hr-mgr"], tenNguoiPV: ["Nguyễn Minh Tuấn", "HR Manager"],
    ketQua: "dat", nhanXet: "Ứng viên có kinh nghiệm thực tế, hiểu GMP tốt.", diemDanh: 82,
  },
  {
    maLich: "LPV-002", maUngVien: "UV-002", tenUngVien: "Trần Thị Mỹ Linh", maYeuCau: "YCTD-2026-001",
    vongPV: "Vòng 1 - HR", thoiGian: "2026-03-03T10:00:00Z", diaDiem: "Zoom Meeting",
    nguoiPV: ["user-hr-mgr"], tenNguoiPV: ["HR Manager"],
    ketQua: "dat", nhanXet: "Nhiệt tình, sẵn sàng học GMP. Phù hợp văn hóa.", diemDanh: 78,
  },
  {
    maLich: "LPV-003", maUngVien: "UV-003", tenUngVien: "Lê Văn Bình", maYeuCau: "YCTD-2026-001",
    vongPV: "Vòng 2 - Chuyên môn", thoiGian: "2026-03-10T14:00:00Z", diaDiem: "Phòng họp A201",
    nguoiPV: ["user-sx-lead", "user-hr-mgr"], tenNguoiPV: ["Nguyễn Minh Tuấn", "HR Manager"],
    ketQua: "cho_ket_qua",
  },
  {
    maLich: "LPV-004", maUngVien: "UV-008", tenUngVien: "Ngô Thị Thảo", maYeuCau: "YCTD-2026-002",
    vongPV: "Vòng 2 - Chuyên môn QC", thoiGian: "2026-03-08T09:30:00Z", diaDiem: "Lab Kiểm nghiệm",
    nguoiPV: ["user-qa-lead", "user-hr-mgr"], tenNguoiPV: ["Lê Thị Phương Anh", "HR Manager"],
    ketQua: "dat", nhanXet: "Kỹ năng HPLC tốt, có kinh nghiệm GLP thực tế.", diemDanh: 88,
  },
  {
    maLich: "LPV-005", maUngVien: "UV-009", tenUngVien: "Bùi Văn Long", maYeuCau: "YCTD-2026-002",
    vongPV: "Vòng 2 - Chuyên môn QC", thoiGian: "2026-03-12T10:00:00Z", diaDiem: "Lab Kiểm nghiệm",
    nguoiPV: ["user-qa-lead"], tenNguoiPV: ["Lê Thị Phương Anh"],
    ketQua: "cho_ket_qua",
  },
  {
    maLich: "LPV-006", maUngVien: "UV-011", tenUngVien: "Trương Minh Khoa", maYeuCau: "YCTD-2026-002",
    vongPV: "Vòng 1 - HR", thoiGian: "2026-03-04T14:00:00Z", diaDiem: "Zoom Meeting",
    nguoiPV: ["user-hr-mgr"], tenNguoiPV: ["HR Manager"],
    ketQua: "dat", nhanXet: "Kinh nghiệm phong phú, chủ động và tự tin.", diemDanh: 85,
  },
];

// ─── Phiếu Đánh giá ──────────────────────────────────────────────────────────

export const phieuDanhGia: PhieuDanhGiaUngVien[] = [
  {
    maPhieu: "PDG-001", maUngVien: "UV-001", tenUngVien: "Nguyễn Thành Đạt", maYeuCau: "YCTD-2026-001",
    nguoiCham: "user-sx-lead", tenNguoiCham: "Nguyễn Minh Tuấn",
    ngayCham: "2026-03-05",
    danhGiaTieuChi: [
      { maTieuChi: "TC-001", noiDung: "Bằng cấp", diem: 10, ghiChu: "Cao đẳng Dược" },
      { maTieuChi: "TC-002", noiDung: "Am hiểu GMP", diem: 8 },
      { maTieuChi: "TC-003", noiDung: "Kinh nghiệm máy móc", diem: 7 },
    ],
    tongDiem: 83, ketLuan: "dat", deXuatLuong: 10000000,
    lichSuSua: [],
  },
  {
    maPhieu: "PDG-002", maUngVien: "UV-008", tenUngVien: "Ngô Thị Thảo", maYeuCau: "YCTD-2026-002",
    nguoiCham: "user-qa-lead", tenNguoiCham: "Lê Thị Phương Anh",
    ngayCham: "2026-03-08",
    danhGiaTieuChi: [
      { maTieuChi: "TC-005", noiDung: "Bằng Đại học Dược", diem: 10 },
      { maTieuChi: "TC-006", noiDung: "Kỹ năng HPLC", diem: 9 },
      { maTieuChi: "TC-007", noiDung: "Am hiểu GLP", diem: 9 },
      { maTieuChi: "TC-008", noiDung: "GC-MS, UV-Vis", diem: 7 },
    ],
    tongDiem: 88, ketLuan: "dat", deXuatLuong: 12000000,
    lichSuSua: [
      { nguoiSua: "user-qa-lead", thoiGian: "2026-03-08T15:00:00Z", truocKhi: "Điểm GLP: 8", sauKhi: "Điểm GLP: 9" },
    ],
  },
];

// ─── Offer ────────────────────────────────────────────────────────────────────

export const offers: Offer[] = [
  {
    maOffer: "OFF-001", maUngVien: "UV-001", tenUngVien: "Nguyễn Thành Đạt",
    maYeuCau: "YCTD-2026-001", tenViTri: "KTV Sản xuất GMP", tenPhongBan: "Phòng Sản xuất",
    mucLuongChinh: 10000000, phuCap: 1500000, tongLuong: 11500000,
    ngayNhanViec: "2026-04-01", hanTraLoi: "2026-03-25",
    trangThai: "dong_y", ngayGui: "2026-03-12", ngayTraLoi: "2026-03-15",
    checklistHoSo: { cccd: true, bangCap: true, khamSucKhoe: true, lyLich: true, anhnThe: true },
  },
  {
    maOffer: "OFF-002", maUngVien: "UV-008", tenUngVien: "Ngô Thị Thảo",
    maYeuCau: "YCTD-2026-002", tenViTri: "Kiểm nghiệm viên QC", tenPhongBan: "Phòng QA/QC",
    mucLuongChinh: 12000000, phuCap: 2000000, tongLuong: 14000000,
    ngayNhanViec: "2026-04-15", hanTraLoi: "2026-03-28",
    trangThai: "gui", ngayGui: "2026-03-16",
    checklistHoSo: { cccd: true, bangCap: true, khamSucKhoe: true, lyLich: true, anhnThe: false, chungChiGMP: false, chungChiGSP: false },
  },
  {
    maOffer: "OFF-003", maUngVien: "UV-011", tenUngVien: "Trương Minh Khoa",
    maYeuCau: "YCTD-2026-002", tenViTri: "Kiểm nghiệm viên QC", tenPhongBan: "Phòng QA/QC",
    mucLuongChinh: 14000000, phuCap: 2000000, tongLuong: 16000000,
    ngayNhanViec: "2026-04-15", hanTraLoi: "2026-03-30",
    trangThai: "tu_choi", ngayGui: "2026-03-14", ngayTraLoi: "2026-03-20",
    ghiChu: "Ứng viên nhận offer từ công ty khác với mức lương cao hơn",
    checklistHoSo: { cccd: true, bangCap: true, khamSucKhoe: true, lyLich: true, anhnThe: true },
  },
];

// ─── Hợp đồng Thử việc ────────────────────────────────────────────────────────

export const hopDongThuViec: HopDongThuViec[] = [
  {
    maHD: "HDTV-2026-001", maNhanVien: "NV-2026-001", tenNhanVien: "Trần Thị Mỹ Linh",
    maViTri: "VT-SX-001", tenViTri: "KTV Sản xuất GMP",
    maPhongBan: "PB-SX", tenPhongBan: "Phòng Sản xuất (GMP)",
    tuNgay: "2026-03-01", denNgay: "2026-04-30",
    luong: 9500000,
    dieuKhoan: "Thử việc 2 tháng theo quy định. Sau thử việc đánh giá kết quả và ký hợp đồng chính thức. Nhân viên phải hoàn thành đào tạo GMP và ATVSLĐ trong tuần đầu tiên.",
    trangThai: "dat",
    checklistOnboarding: {
      daotaoGMP: true, daotaoATVSLD: true, daotaoPCCC: true, daotaoNhanVien: true,
      hopDongKy: true, theNhanVien: true, taiKhoanHeThong: true,
    },
  },
  {
    maHD: "HDTV-2026-002", maNhanVien: "NV-2026-002", tenNhanVien: "Nguyễn Thành Đạt",
    maViTri: "VT-SX-001", tenViTri: "KTV Sản xuất GMP",
    maPhongBan: "PB-SX", tenPhongBan: "Phòng Sản xuất (GMP)",
    tuNgay: "2026-04-01", denNgay: "2026-05-31",
    luong: 10000000,
    dieuKhoan: "Thử việc 2 tháng. Hoàn thành đào tạo GMP certified và ATVSLĐ trong 5 ngày làm việc đầu tiên là điều kiện bắt buộc.",
    trangThai: "dang_thu_viec",
    checklistOnboarding: {
      daotaoGMP: true, daotaoATVSLD: false, daotaoPCCC: false, daotaoNhanVien: true,
      hopDongKy: true, theNhanVien: false, taiKhoanHeThong: true,
    },
  },
];
