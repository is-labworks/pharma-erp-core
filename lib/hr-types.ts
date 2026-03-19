// HR Planning & Recruitment Types for Pharmaceutical ERP

// ─── Enums / Union Types ───────────────────────────────────────────────────

export type TrangThaiKeHoach = "nhap" | "cho_duyet" | "da_duyet" | "tu_choi";

export type TrangThaiYeuCau = "mo" | "dang_tuyen" | "dong";

export type PipelineStage =
  | "ho_so" // Nhận hồ sơ
  | "sang_loc" // Sàng lọc
  | "test" // Test năng lực
  | "pv_hr" // Phỏng vấn HR
  | "pv_chuyen_mon" // Phỏng vấn chuyên môn
  | "tham_dinh" // Thẩm định
  | "offer" // Gửi offer
  | "nhan_viec" // Nhận việc
  | "loai"; // Loại

export type KetQuaPhongVan = "dat" | "khong_dat" | "cho_ket_qua";

export type TrangThaiOffer = "gui" | "dong_y" | "tu_choi";

export type LoaiTieuChi = "bat_buoc" | "uu_tien";

export type KhaNangPhongBan =
  | "san_xuat_gmp" // Sản xuất (GMP)
  | "qa_qc" // QA/QC/Kiểm nghiệm
  | "rd_ra" // R&D/RA
  | "kho_gsp" // Kho GSP/GDP
  | "kinh_doanh" // Kinh doanh dược
  | "back_office"; // Back-office

export type NguonUngVien =
  | "website"
  | "linkedin"
  | "referral"
  | "truong_dh"
  | "head_hunter"
  | "khac";

export type LyDoLoai =
  | "khong_du_tieu_chuan"
  | "luong_khong_phu_hop"
  | "kinh_nghiem_thieu"
  | "bang_cap_khong_phu_hop"
  | "ky_nang_chuyen_mon_yeu"
  | "tu_choi_offer"
  | "khac";

// ─── Danh mục ───────────────────────────────────────────────────────────────

export interface DM_PhongBan {
  maPhongBan: string;
  tenPhongBan: string;
  khoiChucNang: KhaNangPhongBan;
  truongPhongId: string;
}

export interface DM_ViTriCongViec {
  maViTri: string;
  tenViTri: string;
  maPhongBan: string;
  capBac: string; // Junior / Senior / Lead / Manager
  yeuCauBangCap: string;
  yeuCauKinhNghiem: number; // Năm
  tieuChiDacThu: string[]; // GMP, GLP, GSP, GDP, ...
  mucLuongCoBan: number;
}

// ─── Kế hoạch Nhân lực ──────────────────────────────────────────────────────

export interface KeHoachNhanLuc {
  maKeHoach: string;
  nam: number;
  thang: number;
  maPhongBan: string;
  tenPhongBan: string;
  maViTri: string;
  tenViTri: string;
  dinhBien: number; // Tổng định biên
  hienCo: number; // Hiện đang có
  duBaoNghiViec: number; // Dự báo nghỉ việc
  soLuongCanTuyen: number; // = dinhBien - hienCo + duBaoNghiViec
  lyDo: string; // Mở rộng / Thay thế / ...
  nguoiLap: string; // userId
  tenNguoiLap: string;
  trangThai: TrangThaiKeHoach;
  ghiChu?: string;
  ngayLap: string;
  ngayDuyet?: string;
  nguoiDuyet?: string;
  tenNguoiDuyet?: string;
  lyDoTuChoi?: string;
}

// ─── Yêu cầu Tuyển dụng ─────────────────────────────────────────────────────

export interface YeuCauTuyenDung {
  maYeuCau: string;
  maKeHoach?: string; // FK → KeHoachNhanLuc (nếu từ kế hoạch)
  maPhongBan: string;
  tenPhongBan: string;
  maViTri: string;
  tenViTri: string;
  soLuong: number;
  moTaCongViec: string; // JD
  mucLuongMin: number;
  mucLuongMax: number;
  ngayCanNhanSu: string;
  trangThai: TrangThaiYeuCau;
  nguoiTao: string;
  tenNguoiTao: string;
  ngayTao: string;
  // Approval flow
  trangThaiDuyet: "cho_duyet" | "duyet_truong_bp" | "duyet_hr" | "da_duyet" | "tu_choi";
  lichSuDuyet: BuocDuyet[];
  // Stats
  tongUngVien?: number;
  tongDatYeuCau?: number;
}

export interface BuocDuyet {
  id: string;
  nguoiDuyet: string;
  tenNguoiDuyet: string;
  vaiTro: string;
  trangThai: "cho" | "dong_y" | "tu_choi";
  ghiChu?: string;
  thoiGian?: string;
}

// ─── Tiêu chí Tuyển dụng ────────────────────────────────────────────────────

export interface TieuChiTuyenDung {
  maTieuChi: string;
  maYeuCau: string;
  loai: LoaiTieuChi;
  noiDung: string;
  trongSo: number; // 1-10
}

// ─── Ứng viên ────────────────────────────────────────────────────────────────

export interface UngVien {
  maUngVien: string;
  hoTen: string;
  sdt: string;
  email: string;
  trinhDo: string; // Đại học / Thạc sĩ / Tiến sĩ
  chuyenNganh: string;
  namKinhNghiem: number;
  cvFile?: string; // File path or URL
  maYeuCau: string; // FK → YeuCauTuyenDung
  tenViTri: string;
  tenPhongBan: string;
  trangThaiPipeline: PipelineStage;
  nguon: NguonUngVien;
  ngayNop: string;
  lyDoLoai?: LyDoLoai;
  ghiChuLoai?: string;
  // Compliance docs
  hoSoHopLe: {
    cccd: boolean;
    bangCap: boolean;
    khamSucKhoe: boolean;
    lyLich: boolean;
  };
}

// ─── Lịch Phỏng vấn ──────────────────────────────────────────────────────────

export interface LichPhongVan {
  maLich: string;
  maUngVien: string;
  tenUngVien: string;
  maYeuCau: string;
  vongPV: string; // "Vòng 1 - HR" / "Vòng 2 - Chuyên môn"
  thoiGian: string; // ISO datetime
  diaDiem: string;
  nguoiPV: string[]; // userId[]
  tenNguoiPV: string[];
  ketQua: KetQuaPhongVan;
  nhanXet?: string;
  diemDanh?: number; // 0-100
}

// ─── Phiếu Đánh giá Ứng viên ─────────────────────────────────────────────────

export interface PhieuDanhGiaUngVien {
  maPhieu: string;
  maUngVien: string;
  tenUngVien: string;
  maYeuCau: string;
  nguoiCham: string;
  tenNguoiCham: string;
  ngayCham: string;
  danhGiaTieuChi: DanhGiaTieuChi[];
  tongDiem: number; // 0-100
  ketLuan: "dat" | "khong_dat";
  deXuatLuong?: number;
  ghiChu?: string;
  // Audit trail (GMP compliance)
  lichSuSua: LichSuSuaDanhGia[];
}

export interface DanhGiaTieuChi {
  maTieuChi: string;
  noiDung: string;
  diem: number; // 0-10
  ghiChu?: string;
}

export interface LichSuSuaDanhGia {
  nguoiSua: string;
  thoiGian: string;
  truocKhi: string;
  sauKhi: string;
}

// ─── Offer ────────────────────────────────────────────────────────────────────

export interface Offer {
  maOffer: string;
  maUngVien: string;
  tenUngVien: string;
  maYeuCau: string;
  tenViTri: string;
  tenPhongBan: string;
  mucLuongChinh: number;
  phuCap: number;
  tongLuong: number;
  ngayNhanViec: string;
  hanTraLoi: string;
  trangThai: TrangThaiOffer;
  ngayGui: string;
  ngayTraLoi?: string;
  ghiChu?: string;
  // Compliance checklist khi nhận việc
  checklistHoSo: ChecklistHoSo;
}

export interface ChecklistHoSo {
  cccd: boolean;
  bangCap: boolean;
  khamSucKhoe: boolean;
  lyLich: boolean;
  anhnThe: boolean;
  // Vị trí đặc thù
  chungChiGMP?: boolean;
  chungChiGSP?: boolean;
  chungChiGDP?: boolean;
}

// ─── Hợp đồng Thử việc ────────────────────────────────────────────────────────

export interface HopDongThuViec {
  maHD: string;
  maNhanVien: string;
  tenNhanVien: string;
  maViTri: string;
  tenViTri: string;
  maPhongBan: string;
  tenPhongBan: string;
  tuNgay: string;
  denNgay: string;
  luong: number;
  dieuKhoan: string;
  fileScan?: string;
  trangThai: "dang_thu_viec" | "dat" | "khong_dat" | "nghi_giua_chung";
  checklistOnboarding: ChecklistOnboarding;
}

export interface ChecklistOnboarding {
  // Đào tạo bắt buộc
  daotaoGMP: boolean;
  daotaoATVSLD: boolean;
  daotaoPCCC: boolean;
  daotaoNhanVien: boolean;
  // Hồ sơ hoàn thiện
  hopDongKy: boolean;
  theNhanVien: boolean;
  taiKhoanHeThong: boolean;
  // Đặc thù vị trí
  daotaoGSP?: boolean;
  daotaoGDP?: boolean;
  daotaoGLP?: boolean;
}

// ─── Báo cáo ──────────────────────────────────────────────────────────────────

export interface TuyenDungFunnel {
  giaiDoan: string;
  soLuong: number;
  tiLe: number; // %
}

export interface SLATuyenDung {
  maYeuCau: string;
  tenViTri: string;
  tenPhongBan: string;
  ngayTao: string;
  ngayCanNhanSu: string;
  soNgayTuyenDung: number;
  trangThai: TrangThaiYeuCau;
  soUngVien: number;
}
