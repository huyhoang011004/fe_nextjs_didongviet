# 📱 FE_DIDONGVIET_NEXTJS — Frontend Hệ thống quản lý & bán hàng Di Động Việt

**Đồ án tốt nghiệp** — Giao diện người dùng cho hệ thống thương mại điện tử của chuỗi cửa hàng điện thoại Di Động Việt.  
Xây dựng bằng **Next.js 16 + React 19 + TypeScript + Tailwind CSS 4**.

> ⚠️ **Repository riêng**: Đây là mã nguồn **Frontend**. Repository Backend riêng tại:  
> `https://github.com/huyhoang011004/Be_Didongviet`

---

## 📋 Mục lục

- [Công nghệ sử dụng](#-công-nghệ-sử-dụng)
- [Cấu trúc thư mục (Feature-based Architecture)](#-cấu-trúc-thư-mục-feature-based-architecture)
- [Yêu cầu hệ thống](#-yêu-cầu-hệ-thống-prerequisites)
- [Hướng dẫn cài đặt](#-hướng-dẫn-cài-đặt)
- [Cấu hình biến môi trường](#-cấu-hình-biến-môi-trường)
- [Chạy dự án](#-chạy-dự-án)
- [Tính năng chính](#-tính-năng-chính)

---

## 🚀 Công nghệ sử dụng

| Công nghệ | Phiên bản | Mục đích |
|-----------|-----------|----------|
| Next.js | 16.x | React framework (App Router) |
| React | 19.x | UI library |
| TypeScript | 5.x | Kiểu dữ liệu tĩnh |
| Tailwind CSS | 4.x | Utility-first CSS |
| Shadcn/ui | — | UI components (Radix UI) |
| Zustand | 5.x | State management |
| Recharts | 3.x | Biểu đồ thống kê |
| Lucide React | — | Icon library |
| Google Gemini AI | — | Chatbot AI |
| jsPDF | — | Xuất PDF hóa đơn |
| xlsx-js-style | — | Xuất Excel báo cáo |

---

## 📁 Cấu trúc thư mục (Feature-based Architecture)

Dự án được thiết kế chuẩn theo kiến trúc **Feature-based** nhằm tối đa hóa khả năng bảo trì và tái sử dụng. Các thành phần được chia theo luồng nghiệp vụ riêng biệt thay vì gom chung toàn bộ vào `app/`.

```
fe_didongviet_nextjs/
├── src/
│   ├── app/                     # Chỉ dùng cho Routing & Layout
│   │   ├── (auth)/              # Routing: Đăng nhập, đăng ký
│   │   ├── (shop)/              # Routing: Trang mua sắm, Checkout, Home
│   │   ├── admin/               # Routing: Trang quản trị (Dashboard)
│   │   └── globals.css          # Global CSS Tailwind
│   ├── components/              # Global UI Components (dùng chung toàn app)
│   │   ├── ui/                  # Shadcn UI Components
│   │   └── ...                  # Header, Footer, Carousel
│   ├── features/                # Trái tim dự án: Chia theo nghiệp vụ
│   │   ├── admin/               # Feature: Admin Dashboard, Data tables, Actions
│   │   ├── auth/                # Feature: Xác thực, đăng nhập
│   │   ├── cart/                # Feature: Quản lý giỏ hàng
│   │   ├── checkout/            # Feature: Thanh toán, Đơn hàng
│   │   ├── home/                # Feature: Giao diện Trang chủ, FlashSale
│   │   ├── orders/              # Feature: Lịch sử đơn hàng, Trả hàng
│   │   ├── products/            # Feature: Chi tiết & Danh sách sản phẩm, Đánh giá
│   │   └── profile/             # Feature: Hồ sơ user, HSSV
│   ├── hooks/                   # Global Hooks (useHoverDelay, useMobile...)
│   ├── lib/                     # Global Utilities (api-client, utils)
│   └── types/                   # Type definitions
├── .env.example                 # Mẫu biến môi trường
├── SCRIPT_VIDEO_DEMO.md         # Kịch bản quay video demo
├── TESTCASES.md                 # Bảng Test Cases
├── components.json              # Cấu hình Shadcn
└── package.json
```

---

## ✅ Yêu cầu hệ thống (Prerequisites)

| Công cụ | Phiên bản tối thiểu | Tải về |
|---------|---------------------|--------|
| **Node.js** | ≥ 18.x (khuyến nghị 20.x LTS) | [nodejs.org](https://nodejs.org) |
| **npm** | ≥ 9.x (đi kèm Node.js) | — |
| **Git** | ≥ 2.x | [git-scm.com](https://git-scm.com) |

> **Lưu ý:** Để chạy Frontend, bạn cần **Backend** đang hoạt động tại `http://localhost:5000`.  
> Hãy clone và chạy Backend trước theo hướng dẫn tại:  
> `https://github.com/<your-username>/be_didongviet_expressjs`

---

## 📥 Hướng dẫn cài đặt

### 1. Clone dự án

```bash
git clone https://github.com/<your-username>/fe_didongviet_nextjs.git
cd fe_didongviet_nextjs
```

### 2. Cài đặt dependencies & tạo file .env.local

```bash
npm install
copy .env.example .env.local    # Trên Windows
# hoặc: cp .env.example .env.local   # Trên Linux/Mac
```

---

## 🔐 Cấu hình biến môi trường

Tạo file `.env.local` tại thư mục gốc:

| Biến | Mô tả | Giá trị mẫu |
|------|-------|-------------|
| `NEXT_PUBLIC_API_URL` | URL Backend API (bao gồm /api/v1) | `http://localhost:5000/api/v1` |
| `NEXT_PUBLIC_API_BASE_URL` | Base URL Backend (dùng cho ảnh) | `http://localhost:5000` |

---

## 🏃 Chạy dự án

### Môi trường Development

```bash
npm run dev
```

Server sẽ chạy tại: **http://localhost:3000**

> **Mở trình duyệt:**  
> - Trang chủ: `http://localhost:3000`  
> - Trang quản trị: `http://localhost:3000/admin` (đăng nhập với tài khoản admin)

### Môi trường Production

```bash
npm run build
npm run start
```

> **Lưu ý:** Đảm bảo Backend đang chạy trước khi khởi động Frontend.

---

## ✨ Tính năng chính

### 👤 Người dùng (Front-end)
- 🛍️ Xem danh mục sản phẩm, tìm kiếm, lọc sản phẩm theo thương hiệu & giá
- 📱 Xem chi tiết sản phẩm (nhiều màu sắc, dung lượng, RAM)
- 🛒 Giỏ hàng, áp dụng voucher giảm giá
- 💳 Thanh toán (COD, VNPAY, MOMO, Trả góp 0%)
- 📦 Tra cứu đơn hàng, hủy đơn, trả hàng (kèm upload ảnh/video)
- ⭐ Đánh giá sản phẩm
- 🎓 Xác thực sinh viên (ưu đãi D.Member)
- 🤖 Chatbot AI (Google Gemini) hỗ trợ tư vấn
- 📰 Tin tức công nghệ (Blog)

### 🔧 Quản trị (Admin)
- 📊 Dashboard thống kê (doanh thu, đơn hàng, tồn kho) — Recharts biểu đồ
- 📦 Quản lý sản phẩm (thêm/sửa/xóa, variants, hình ảnh)
- 🏷️ Quản lý danh mục
- 📋 Quản lý đơn hàng (State Machine: Xác nhận → Lấy hàng → Giao → Hoàn thành)
- 👥 Quản lý người dùng
- 🏪 Quản lý chi nhánh & tồn kho (tách biệt theo chi nhánh)
- 🎫 Quản lý voucher, flash sale
- 📝 Quản lý blog, đánh giá
- 📄 Xuất báo cáo (PDF, Excel)

---

> ⚡ **Tác giả:** Nguyễn Văn Huy Hoàng  
> **Đề tài:** Hệ thống quản lý và bán hàng trực tuyến cho chuỗi cửa hàng Di Động Việt  
> **Backend:** https://github.com/huyhoang011004/Be_Didongviet