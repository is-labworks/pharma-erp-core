// ===== PAYROLL MODULE TYPES =====

export interface LuongNhanVien {
  id: number;
  maNhanVien: string;
  hoTen: string;
  luongCoBan: number;
  phanTramHuongLuong: number;
  soNguoiPhuThuoc: number;
  phongBan: string;
  chucVu: string;
  ngayVaoLam: string;
  email: string;
  trangThai: "chinh_thuc" | "thu_viec" | "nghi_viec";
}

export interface DanhMucKhoan {
  id: number;
  tenKhoan: string;
  loaiKhoan: 1 | 2;
  coDongBaoHiem: boolean;
  coTinhThue: boolean;
  moTa: string;
}

export interface BangLuong {
  id: number;
  tenKyLuong: string;
  thang: number;
  nam: number;
  ngayChotLuong: string;
  trangThai: 0 | 1 | 2;
  khoaSo?: boolean; // Payroll lock after approval
  nguoiTao: string;
  nguoiDuyet?: string;
  ngayDuyet?: string;
  nguoiGiamDoc?: string;
  ngayGiamDocDuyet?: string;
  ghiChu?: string;
  tongQuyLuong?: number;
  tongDaPhanBo?: number;
}

export interface PhieuLuongChiTiet {
  id: number;
  idKyLuong: number;
  idNhanVien: number;
  idKhoan: number;
  soTien: number;
  ghiChuTinh: string;
}

export interface PhieuLuongNhanVien {
  nhanVien: LuongNhanVien;
  kyLuong: BangLuong;
  luongThoiGian: number;
  thuongKPI: number;
  phuCapAnTrua: number;
  phuCapXangXe: number;
  tongThuNhap: number;
  bhxhNhanVien: number;
  bhytNhanVien: number;
  bhtnNhanVien: number;
  tongBaoHiem: number;
  giamTruBanThan: number;
  giamTruPhuThuoc: number;
  thuNhapTinhThue: number;
  thueTNCN: number;
  luongThucLinh: number;
}

// ===== EXTENDED TYPES (hr-accounting.md) =====

export interface PhanBoQuyLuong {
  id: number;
  idKyLuong: number;
  tenQuy: string; // "Quỹ lương cơ bản" | "Quỹ khen thưởng" | "Quỹ phụ cấp"
  tyLePhanBo: number; // % phân bổ
  tongTien: number;
  phongBan?: string; // Optional — phân bổ theo phòng ban
  mauSac?: string; // Chart color
}

export interface TrichNopBaoHiem {
  id: number;
  idNhanVien: number;
  idKyLuong: number;
  thuNhapChiuThue: number;
  giamTruGiaCanh: number;
  thueTNCN: number;
  bhxhNLD: number; // 8%
  bhytNLD: number; // 1.5%
  bhtnNLD: number; // 1%
  // Doanh nghiệp đóng
  bhxhDN: number;  // 17.5%
  bhytDN: number;  // 3%
  bhtnDN: number;  // 1%
}

export interface HachToanKeToan {
  id: number;
  idKyLuong: number;
  maPhongBan: string;
  tenPhongBan: string;
  taiKhoanNo: string;  // 622, 641, 642
  taiKhoanCo: string;  // 334, 3383, 3384, 3385, 3335
  soTien: number;
  dienGiai: string;
  ngayHachToan: string;
}

export interface BaoCaoThongKeThang {
  thang: number;
  nam: number;
  tongGross: number;
  tongNet: number;
  tongBaoHiemNV: number;
  tongBaoHiemDN: number;
  tongThueTNCN: number;
  tongNhanVien: number;
}
