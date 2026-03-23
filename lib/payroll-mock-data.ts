import type { LuongNhanVien, DanhMucKhoan, BangLuong, PhieuLuongNhanVien, PhanBoQuyLuong, TrichNopBaoHiem, HachToanKeToan, BaoCaoThongKeThang } from "./payroll-types";

// ===== NHÂN VIÊN =====
export const luongNhanVien: LuongNhanVien[] = [
  {
    id: 1, maNhanVien: "NV001", hoTen: "Nguyễn Văn An",
    luongCoBan: 12_000_000, phanTramHuongLuong: 100,
    soNguoiPhuThuoc: 2, phongBan: "Sản xuất (GMP)", chucVu: "Trưởng ca sản xuất",
    ngayVaoLam: "2021-03-01", email: "an.nguyen@pharma.vn", trangThai: "chinh_thuc",
  },
  {
    id: 2, maNhanVien: "NV002", hoTen: "Trần Thị Bình",
    luongCoBan: 15_000_000, phanTramHuongLuong: 100,
    soNguoiPhuThuoc: 1, phongBan: "QA/QC", chucVu: "Chuyên viên QC",
    ngayVaoLam: "2020-07-15", email: "binh.tran@pharma.vn", trangThai: "chinh_thuc",
  },
  {
    id: 3, maNhanVien: "NV003", hoTen: "Lê Minh Cường",
    luongCoBan: 18_000_000, phanTramHuongLuong: 100,
    soNguoiPhuThuoc: 3, phongBan: "Kinh doanh", chucVu: "Trưởng phòng Kinh doanh",
    ngayVaoLam: "2019-01-10", email: "cuong.le@pharma.vn", trangThai: "chinh_thuc",
  },
  {
    id: 4, maNhanVien: "NV004", hoTen: "Phạm Hồng Dung",
    luongCoBan: 11_000_000, phanTramHuongLuong: 100,
    soNguoiPhuThuoc: 0, phongBan: "Kho (GSP)", chucVu: "Thủ kho",
    ngayVaoLam: "2022-06-01", email: "dung.pham@pharma.vn", trangThai: "chinh_thuc",
  },
  {
    id: 5, maNhanVien: "NV005", hoTen: "Hoàng Thế Đức",
    luongCoBan: 22_000_000, phanTramHuongLuong: 100,
    soNguoiPhuThuoc: 2, phongBan: "R&D", chucVu: "Trưởng phòng R&D",
    ngayVaoLam: "2018-09-05", email: "duc.hoang@pharma.vn", trangThai: "chinh_thuc",
  },
  {
    id: 6, maNhanVien: "NV006", hoTen: "Vũ Thị Phương",
    luongCoBan: 10_000_000, phanTramHuongLuong: 85,
    soNguoiPhuThuoc: 0, phongBan: "Kế toán", chucVu: "Nhân viên Kế toán (thử việc)",
    ngayVaoLam: "2026-01-15", email: "phuong.vu@pharma.vn", trangThai: "thu_viec",
  },
  {
    id: 7, maNhanVien: "NV007", hoTen: "Đặng Quang Huy",
    luongCoBan: 13_500_000, phanTramHuongLuong: 100,
    soNguoiPhuThuoc: 1, phongBan: "Sản xuất (GMP)", chucVu: "Nhân viên vận hành máy",
    ngayVaoLam: "2023-02-01", email: "huy.dang@pharma.vn", trangThai: "chinh_thuc",
  },
  {
    id: 8, maNhanVien: "NV008", hoTen: "Bùi Thị Lan",
    luongCoBan: 20_000_000, phanTramHuongLuong: 100,
    soNguoiPhuThuoc: 2, phongBan: "Mua hàng", chucVu: "Trưởng phòng Mua hàng",
    ngayVaoLam: "2017-05-20", email: "lan.bui@pharma.vn", trangThai: "chinh_thuc",
  },
];

// ===== DANH MỤC KHOẢN =====
export const danhMucKhoan: DanhMucKhoan[] = [
  { id: 1, tenKhoan: "Lương thời gian", loaiKhoan: 1, coDongBaoHiem: true, coTinhThue: true, moTa: "Lương cơ bản x % hưởng x số công/22" },
  { id: 2, tenKhoan: "Lương tăng ca", loaiKhoan: 1, coDongBaoHiem: false, coTinhThue: true, moTa: "Giờ tăng ca x 150% đơn giá" },
  { id: 3, tenKhoan: "Phụ cấp ăn trưa", loaiKhoan: 1, coDongBaoHiem: false, coTinhThue: false, moTa: "730,000đ/tháng (cố định)" },
  { id: 4, tenKhoan: "Phụ cấp xăng xe", loaiKhoan: 1, coDongBaoHiem: false, coTinhThue: false, moTa: "500,000đ/tháng (cố định)" },
  { id: 5, tenKhoan: "Thưởng KPI", loaiKhoan: 1, coDongBaoHiem: false, coTinhThue: true, moTa: "Căn cứ KPI tháng" },
  { id: 6, tenKhoan: "BHXH Nhân viên (8%)", loaiKhoan: 2, coDongBaoHiem: true, coTinhThue: false, moTa: "8% lương cơ bản" },
  { id: 7, tenKhoan: "BHYT Nhân viên (1.5%)", loaiKhoan: 2, coDongBaoHiem: true, coTinhThue: false, moTa: "1.5% lương cơ bản" },
  { id: 8, tenKhoan: "BHTN Nhân viên (1%)", loaiKhoan: 2, coDongBaoHiem: true, coTinhThue: false, moTa: "1% lương cơ bản" },
  { id: 9, tenKhoan: "Thuế TNCN", loaiKhoan: 2, coDongBaoHiem: false, coTinhThue: false, moTa: "Biểu thuế lũy tiến 7 bậc" },
];

// ===== BẢNG LƯƠNG (KỲ LƯƠNG) =====
export const bangLuong: BangLuong[] = [
  {
    id: 1, tenKyLuong: "Lương tháng 02/2026", thang: 2, nam: 2026,
    ngayChotLuong: "2026-02-25", trangThai: 2,
    nguoiTao: "Nguyễn Kế Toán", nguoiDuyet: "Trần Kế Toán Trưởng", ngayDuyet: "2026-02-27",
    nguoiGiamDoc: "Nguyễn Văn Giám Đốc", ngayGiamDocDuyet: "2026-02-28",
    ghiChu: "Đã chuyển khoản ngân hàng ngày 28/02/2026",
  },
  {
    id: 2, tenKyLuong: "Lương tháng 03/2026", thang: 3, nam: 2026,
    ngayChotLuong: "2026-03-25", trangThai: 0,
    nguoiTao: "Nguyễn Kế Toán",
    ghiChu: "Đang tính toán – chưa phê duyệt",
  },
];

// ===== HÀM TÍNH THUẾ TNCN LŨY TIẾN =====
// Biểu thuế 2024 (áp dụng cho Thu nhập tính thuế / tháng)
export function tinhThueTNCN(thuNhapTinhThue: number): number {
  if (thuNhapTinhThue <= 0) return 0;
  const bacThue = [
    { den: 5_000_000, thue: 0.05 },
    { den: 10_000_000, thue: 0.10 },
    { den: 18_000_000, thue: 0.15 },
    { den: 32_000_000, thue: 0.20 },
    { den: 52_000_000, thue: 0.25 },
    { den: 80_000_000, thue: 0.30 },
    { den: Infinity,   thue: 0.35 },
  ];
  let thue = 0;
  let con = thuNhapTinhThue;
  let tru = 0;
  for (const bac of bacThue) {
    const khung = bac.den - tru;
    if (con <= 0) break;
    const chiu = Math.min(con, khung);
    thue += chiu * bac.thue;
    con -= chiu;
    tru = bac.den;
  }
  return Math.round(thue);
}

// ===== HÀM TÍNH PHIẾU LƯƠNG =====
export function tinhPhieuLuong(
  nv: LuongNhanVien,
  ky: BangLuong,
  soNgayCong: number = 22,
  gioCa: number = 0,
  thuongKPIAmount: number = 0
): PhieuLuongNhanVien {
  const GIAM_TRU_BAN_THAN = 11_000_000;
  const GIAM_TRU_PHU_THUOC = 4_400_000;
  const PC_AN_TRUA = 730_000;
  const PC_XANG_XE = 500_000;

  // Lương thời gian
  const donGiaMotNgay = (nv.luongCoBan * nv.phanTramHuongLuong) / 100 / 26;
  const luongThoiGian = Math.round(donGiaMotNgay * soNgayCong);

  // Tăng ca
  const donGiaMotGioTC = donGiaMotNgay / 8;
  const luongTangCa = Math.round(donGiaMotGioTC * gioCa * 1.5);

  const tongThuNhap = luongThoiGian + luongTangCa + PC_AN_TRUA + PC_XANG_XE + thuongKPIAmount;

  // BHXH/BHYT/BHTN tính trên lương cơ bản
  const bhxhNhanVien = Math.round(nv.luongCoBan * 0.08);
  const bhytNhanVien = Math.round(nv.luongCoBan * 0.015);
  const bhtnNhanVien = Math.round(nv.luongCoBan * 0.01);
  const tongBaoHiem = bhxhNhanVien + bhytNhanVien + bhtnNhanVien;

  // Thu nhập chịu thuế = gross - (PC không chịu thuế) - BH NV
  const thuNhapChiuThue = luongThoiGian + luongTangCa + thuongKPIAmount - tongBaoHiem;

  // Thu nhập tính thuế
  const giamTruBanThan = GIAM_TRU_BAN_THAN;
  const giamTruPhuThuoc = GIAM_TRU_PHU_THUOC * nv.soNguoiPhuThuoc;
  const thuNhapTinhThue = Math.max(0, thuNhapChiuThue - giamTruBanThan - giamTruPhuThuoc);
  const thueTNCN = tinhThueTNCN(thuNhapTinhThue);

  const luongThucLinh = tongThuNhap - tongBaoHiem - thueTNCN;

  return {
    nhanVien: nv,
    kyLuong: ky,
    luongThoiGian,
    thuongKPI: thuongKPIAmount,
    phuCapAnTrua: PC_AN_TRUA,
    phuCapXangXe: PC_XANG_XE,
    tongThuNhap,
    bhxhNhanVien,
    bhytNhanVien,
    bhtnNhanVien,
    tongBaoHiem,
    giamTruBanThan,
    giamTruPhuThuoc,
    thuNhapTinhThue,
    thueTNCN,
    luongThucLinh,
  };
}

// ===== DỮ LIỆU MẪU CHO KỲ LƯƠNG 03/2026 =====
const kyThang3 = bangLuong[1]; // tháng 03/2026

// Số ngày công & KPI từng NV (dữ liệu chấm công giả lập)
const chamCong = [
  { idNV: 1, soNgayCong: 22, gioTC: 8, kpi: 1_000_000 },
  { idNV: 2, soNgayCong: 21, gioTC: 0, kpi: 2_000_000 },
  { idNV: 3, soNgayCong: 22, gioTC: 0, kpi: 5_000_000 },
  { idNV: 4, soNgayCong: 22, gioTC: 4, kpi: 0 },
  { idNV: 5, soNgayCong: 22, gioTC: 0, kpi: 3_000_000 },
  { idNV: 6, soNgayCong: 20, gioTC: 0, kpi: 0 },
  { idNV: 7, soNgayCong: 22, gioTC: 16, kpi: 500_000 },
  { idNV: 8, soNgayCong: 22, gioTC: 0, kpi: 2_500_000 },
];

export const phieuLuongThang3: PhieuLuongNhanVien[] = luongNhanVien.map((nv) => {
  const cc = chamCong.find((c) => c.idNV === nv.id)!;
  return tinhPhieuLuong(nv, kyThang3, cc.soNgayCong, cc.gioTC, cc.kpi);
});

// KỲ THÁNG 2 — đã thanh toán
const kyThang2 = bangLuong[0];
const chamCongT2 = [
  { idNV: 1, soNgayCong: 20, gioTC: 0, kpi: 0 },
  { idNV: 2, soNgayCong: 20, gioTC: 0, kpi: 1_500_000 },
  { idNV: 3, soNgayCong: 20, gioTC: 0, kpi: 4_000_000 },
  { idNV: 4, soNgayCong: 20, gioTC: 0, kpi: 0 },
  { idNV: 5, soNgayCong: 20, gioTC: 0, kpi: 2_500_000 },
  { idNV: 6, soNgayCong: 18, gioTC: 0, kpi: 0 },
  { idNV: 7, soNgayCong: 20, gioTC: 8, kpi: 0 },
  { idNV: 8, soNgayCong: 20, gioTC: 0, kpi: 1_800_000 },
];

export const phieuLuongThang2: PhieuLuongNhanVien[] = luongNhanVien.map((nv) => {
  const cc = chamCongT2.find((c) => c.idNV === nv.id)!;
  return tinhPhieuLuong(nv, kyThang2, cc.soNgayCong, cc.gioTC, cc.kpi);
});


const tongQuyT3 = phieuLuongThang3.reduce((s, p) => s + p.tongThuNhap, 0);
const tongQuyT2 = phieuLuongThang2.reduce((s, p) => s + p.tongThuNhap, 0);

export const phanBoQuyLuong: PhanBoQuyLuong[] = [
  { id: 1, idKyLuong: 2, tenQuy: "Quỹ lương cơ bản", tyLePhanBo: 72, tongTien: Math.round(tongQuyT3 * 0.72), mauSac: "#3b82f6" },
  { id: 2, idKyLuong: 2, tenQuy: "Quỹ Khen thưởng KPI", tyLePhanBo: 18, tongTien: Math.round(tongQuyT3 * 0.18), mauSac: "#10b981" },
  { id: 3, idKyLuong: 2, tenQuy: "Quỹ Phụ cấp", tyLePhanBo: 10, tongTien: Math.round(tongQuyT3 * 0.10), mauSac: "#f59e0b" },
];

export const phanBoTheoPhongBan: PhanBoQuyLuong[] = [
  { id: 10, idKyLuong: 2, tenQuy: "Sản xuất (GMP)", phongBan: "Sản xuất (GMP)", tyLePhanBo: 0, tongTien: phieuLuongThang3.filter(p => p.nhanVien.phongBan === "Sản xuất (GMP)").reduce((s,p) => s + p.tongThuNhap, 0), mauSac: "#6366f1" },
  { id: 11, idKyLuong: 2, tenQuy: "QA/QC", phongBan: "QA/QC", tyLePhanBo: 0, tongTien: phieuLuongThang3.filter(p => p.nhanVien.phongBan === "QA/QC").reduce((s,p) => s + p.tongThuNhap, 0), mauSac: "#ec4899" },
  { id: 12, idKyLuong: 2, tenQuy: "Kinh doanh", phongBan: "Kinh doanh", tyLePhanBo: 0, tongTien: phieuLuongThang3.filter(p => p.nhanVien.phongBan === "Kinh doanh").reduce((s,p) => s + p.tongThuNhap, 0), mauSac: "#f97316" },
  { id: 13, idKyLuong: 2, tenQuy: "R&D", phongBan: "R&D", tyLePhanBo: 0, tongTien: phieuLuongThang3.filter(p => p.nhanVien.phongBan === "R&D").reduce((s,p) => s + p.tongThuNhap, 0), mauSac: "#14b8a6" },
  { id: 14, idKyLuong: 2, tenQuy: "Khác", phongBan: "Khác", tyLePhanBo: 0, tongTien: phieuLuongThang3.filter(p => !["Sản xuất (GMP)","QA/QC","Kinh doanh","R&D"].includes(p.nhanVien.phongBan)).reduce((s,p) => s + p.tongThuNhap, 0), mauSac: "#8b5cf6" },
];

// ===== TRÍCH NỘP BẢO HIỂM & THUẾ =====
export const trichNopData: TrichNopBaoHiem[] = phieuLuongThang3.map((pl, i) => ({
  id: i + 1,
  idNhanVien: pl.nhanVien.id,
  idKyLuong: 2,
  thuNhapChiuThue: pl.thuNhapTinhThue + pl.giamTruBanThan + pl.giamTruPhuThuoc,
  giamTruGiaCanh: pl.giamTruBanThan + pl.giamTruPhuThuoc,
  thueTNCN: pl.thueTNCN,
  bhxhNLD: pl.bhxhNhanVien,
  bhytNLD: pl.bhytNhanVien,
  bhtnNLD: pl.bhtnNhanVien,
  // Doanh nghiệp đóng
  bhxhDN: Math.round(pl.nhanVien.luongCoBan * 0.175),
  bhytDN: Math.round(pl.nhanVien.luongCoBan * 0.03),
  bhtnDN: Math.round(pl.nhanVien.luongCoBan * 0.01),
}));

// ===== BÚT TOÁN HẠCH TOÁN KẾ TOÁN =====
const ngayHT = "2026-03-31";
export const hachToanEntries: HachToanKeToan[] = [
  // Hạch toán lương CN sản xuất: Nợ TK622 / Có TK334
  { id: 1, idKyLuong: 2, maPhongBan: "SX", tenPhongBan: "Sản xuất (GMP)", taiKhoanNo: "622", taiKhoanCo: "334", soTien: phieuLuongThang3.filter(p => p.nhanVien.phongBan === "Sản xuất (GMP)").reduce((s,p) => s + p.tongThuNhap, 0), dienGiai: "Hạch toán chi phí lương CN sản xuất tháng 03/2026", ngayHachToan: ngayHT },
  // Lương bán hàng: Nợ TK641 / Có TK334
  { id: 2, idKyLuong: 2, maPhongBan: "BH", tenPhongBan: "Kinh doanh", taiKhoanNo: "641", taiKhoanCo: "334", soTien: phieuLuongThang3.filter(p => p.nhanVien.phongBan === "Kinh doanh").reduce((s,p) => s + p.tongThuNhap, 0), dienGiai: "Hạch toán chi phí lương bán hàng tháng 03/2026", ngayHachToan: ngayHT },
  // Lương QLDN (các phòng còn lại): Nợ TK642 / Có TK334
  { id: 3, idKyLuong: 2, maPhongBan: "QLDN", tenPhongBan: "QLDN (QA/QC, Kho, KT, R&D, MH)", taiKhoanNo: "642", taiKhoanCo: "334", soTien: phieuLuongThang3.filter(p => !["Sản xuất (GMP)","Kinh doanh"].includes(p.nhanVien.phongBan)).reduce((s,p) => s + p.tongThuNhap, 0), dienGiai: "Hạch toán chi phí lương QLDN tháng 03/2026", ngayHachToan: ngayHT },
  // BHXH toàn bộ NV đóng: Nợ TK334 / Có TK3383
  { id: 4, idKyLuong: 2, maPhongBan: "ALL", tenPhongBan: "Toàn công ty", taiKhoanNo: "334", taiKhoanCo: "3383", soTien: trichNopData.reduce((s,t) => s + t.bhxhNLD + t.bhytNLD + t.bhtnNLD, 0), dienGiai: "Trích BHXH/BHYT/BHTN NLĐ đóng tháng 03/2026", ngayHachToan: ngayHT },
  // BHXH DN đóng: Nợ TK622/641/642 / Có TK3383
  { id: 5, idKyLuong: 2, maPhongBan: "ALL", tenPhongBan: "Toàn công ty", taiKhoanNo: "622", taiKhoanCo: "3383", soTien: trichNopData.reduce((s,t) => s + t.bhxhDN + t.bhytDN + t.bhtnDN, 0), dienGiai: "Trích BHXH/BHYT/BHTN doanh nghiệp đóng tháng 03/2026", ngayHachToan: ngayHT },
  // Thuế TNCN: Nợ TK334 / Có TK3335
  { id: 6, idKyLuong: 2, maPhongBan: "ALL", tenPhongBan: "Toàn công ty", taiKhoanNo: "334", taiKhoanCo: "3335", soTien: trichNopData.reduce((s,t) => s + t.thueTNCN, 0), dienGiai: "Khấu trừ thuế TNCN tại nguồn tháng 03/2026", ngayHachToan: ngayHT },
];

// ===== DỮ LIỆU THỐNG KÊ NHIỀU THÁNG (cho analytics chart) =====
export const lichSuThongKe: BaoCaoThongKeThang[] = [
  { thang: 11, nam: 2025, tongGross: 285_000_000, tongNet: 248_000_000, tongBaoHiemNV: 28_000_000, tongBaoHiemDN: 55_000_000, tongThueTNCN: 9_200_000, tongNhanVien: 8 },
  { thang: 12, nam: 2025, tongGross: 312_000_000, tongNet: 271_000_000, tongBaoHiemNV: 30_500_000, tongBaoHiemDN: 59_000_000, tongThueTNCN: 10_800_000, tongNhanVien: 8 },
  { thang: 1, nam: 2026, tongGross: 270_000_000, tongNet: 235_000_000, tongBaoHiemNV: 27_000_000, tongBaoHiemDN: 52_000_000, tongThueTNCN: 8_000_000, tongNhanVien: 8 },
  { thang: 2, nam: 2026, tongGross: tongQuyT2, tongNet: phieuLuongThang2.reduce((s,p) => s + p.luongThucLinh, 0), tongBaoHiemNV: phieuLuongThang2.reduce((s,p) => s + p.tongBaoHiem, 0), tongBaoHiemDN: Math.round(tongQuyT2 * 0.215), tongThueTNCN: phieuLuongThang2.reduce((s,p) => s + p.thueTNCN, 0), tongNhanVien: 8 },
  { thang: 3, nam: 2026, tongGross: tongQuyT3, tongNet: phieuLuongThang3.reduce((s,p) => s + p.luongThucLinh, 0), tongBaoHiemNV: phieuLuongThang3.reduce((s,p) => s + p.tongBaoHiem, 0), tongBaoHiemDN: Math.round(tongQuyT3 * 0.215), tongThueTNCN: phieuLuongThang3.reduce((s,p) => s + p.thueTNCN, 0), tongNhanVien: 8 },
];
