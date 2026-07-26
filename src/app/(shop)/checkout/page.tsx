'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  CheckCircle,
  AlertCircle,
  ShieldCheck,
  ChevronRight,
  Ticket,
  Truck,
  RotateCcw,
} from 'lucide-react';
import { useCartStore } from '@/app/(shop)/cart/useCartStore';
import VoucherList from '../cart/_components/VoucherList';
import {
  fetchVouchers,
  findVoucherByCode,
  calcVoucherValue,
  applyVoucherServer,
} from '../cart/cart-actions';
import { createMoMoPayment, createVNPayPayment, calculateShippingFee } from './checkout-actions';
import { VIETNAM_PROVINCES, getBranchRegion } from './_components/checkout-utils';
import AddressModal from './_components/AddressModal';

import CheckoutAddressForm from './_components/CheckoutAddressForm';
import CheckoutProductList from './_components/CheckoutProductList';
import BranchSelector from './_components/BranchSelector';
import PaymentMethods from './_components/PaymentMethods';
import PaymentSummary from './_components/PaymentSummary';
import { useCheckoutState } from './useCheckoutState';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

const formatVND = (num: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(num);
};

function CheckoutContent() {
  const state = useCheckoutState();

  const {
    cartItems,
    selectedTotalPrice,
    profile, setProfile,
    loading, mounted,
    fullName, setFullName,
    phone, setPhone,
    province, setProvince,
    district, setDistrict,
    ward, setWard,
    streetAddress, setStreetAddress,
    branches,
    selectedBranchId, setSelectedBranchId, selectedBranch,
    paymentMethod, setPaymentMethod,
    vouchers,
    appliedVoucher, setAppliedVoucher,
    discountAmount, setDiscountAmount,
    bestVoucherCode, setBestVoucherCode,
    showVoucherModal, setShowVoucherModal,
    voucherCode, setVoucherCode,
    voucherLoading,
    showAddressModal, setShowAddressModal,
    productDetails,
    submitting,
    isOrderCompleted,
    shippingLoading,
    estimatedDelivery,
    shippingPrice,
    alert, setAlert,
    grandTotal,
    handleApplyVoucher,
    applyVoucherByCode,
    handlePlaceOrder,
    applicableVouchers
  } = state;

  if (!mounted || loading) {
    return (
      <div className='min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8'>
        <div className='relative flex items-center justify-center'>
          <div className='h-12 w-12 animate-spin rounded-full border-3 border-didongviet-red border-t-transparent' />
          <div className='absolute text-[9px] font-bold text-didongviet-red uppercase tracking-wider animate-pulse'>
            DĐV
          </div>
        </div>
        <p className='mt-3 text-xs font-medium text-slate-500 animate-pulse'>
          Đang chuẩn bị trang thanh toán...
        </p>
      </div>
    );
  }

  if (cartItems.length === 0) return null;

  return (
    <div className='min-h-screen bg-slate-50 font-sans text-slate-700 pb-16 animate-in fade-in duration-200'>
      {/* Alert toast */}
      {alert && (
        <div
          className={`fixed bottom-4 right-4 z-50 p-3.5 rounded-xl shadow-lg border flex items-center gap-2 max-w-sm animate-in fade-in slide-in-from-bottom-5 duration-300
          ${alert.type === 'success' ? 'bg-green-50/95 border-green-200 text-green-800' : 'bg-red-50/95 border-red-200 text-red-800'}`}
        >
          {alert.type === 'success' ? (
            <CheckCircle size={16} className='text-green-600 flex-shrink-0' />
          ) : (
            <AlertCircle size={16} className='text-red-600 flex-shrink-0' />
          )}
          <span className='text-xs font-semibold'>{alert.message}</span>
        </div>
      )}

      {/* BREADCRUMB */}
      <nav className='bg-white border-b border-slate-100 py-2.5 shadow-xs'>
        <div className='max-w-[1400px] mx-auto px-[30px] flex items-center gap-1.5 text-[10px] text-gray-400 font-semibold'>
          <Link
            href='/'
            className='hover:text-didongviet-red transition-colors'
          >
            Trang chủ
          </Link>
          <ChevronRight size={10} />
          <Link
            href='/cart'
            className='hover:text-didongviet-red transition-colors'
          >
            Giỏ hàng
          </Link>
          <ChevronRight size={10} />
          <span className='text-slate-800 font-bold'>Thanh toán đơn hàng</span>
        </div>
      </nav>

      {/* CỐT BỐ CỤC CHÍNH */}
      <div className='max-w-[1400px] mx-auto px-[30px] py-6 space-y-6'>
        {/* Header Title */}
        <div className='flex items-center gap-2.5'>
          <div className='h-8 w-8 rounded-lg bg-slate-800 text-white flex items-center justify-center shadow-sm'>
            <ShieldCheck size={16} />
          </div>
          <div>
            <h1 className='text-base sm:text-lg font-black text-slate-800 uppercase tracking-tight'>
              Thanh toán an toàn
            </h1>
            <p className='text-[10px] text-slate-400 font-medium'>
              Hoàn tất thông tin để nhận hàng siêu tốc
            </p>
          </div>
        </div>

        {/* Layout Grid 2 cột */}
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-6 items-start'>
          {/* CỘT BÊN TRÁI (CHIẾM 1 NỬA) */}
          <div className='lg:col-span-5 space-y-5'>
            {/* 1. ĐỊA CHỈ NHẬN HÀNG */}
            <CheckoutAddressForm
              fullName={fullName}
              setFullName={setFullName}
              phone={phone}
              setPhone={setPhone}
              province={province}
              setProvince={setProvince}
              district={district}
              setDistrict={setDistrict}
              ward={ward}
              setWard={setWard}
              streetAddress={streetAddress}
              setStreetAddress={setStreetAddress}
              profile={profile}
              setShowAddressModal={setShowAddressModal}
            />

            {/* 2. CHỌN CHI NHÁNH ĐẶT HÀNG */}
            <BranchSelector
              branches={branches}
              selectedBranchId={selectedBranchId}
              setSelectedBranchId={setSelectedBranchId}
              selectedBranch={selectedBranch}
            />

            {/* 3. PHƯƠNG THỨC THANH TOÁN */}
            <PaymentMethods
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
            />
          </div>

          {/* CỘT BÊN PHẢI */}
          <div className='lg:col-span-7 space-y-5'>
            {/* 1. ĐƠN HÀNG */}
            <CheckoutProductList
              cartItems={cartItems}
              formatVND={formatVND}
              branches={branches}
              productDetails={productDetails}
              selectedBranchId={selectedBranchId}
            />

            {/* 2. CHỌN MÃ GIẢM GIÁ (VOUCHER) */}
            <div className='bg-white rounded-2xl border border-slate-100 shadow-2xs p-4 flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <Ticket size={16} className='text-didongviet-red' />
                <span className='text-xs font-bold text-slate-800'>
                  Mã giảm giá (Voucher)
                </span>
              </div>
              <div className='flex items-center gap-3'>
                {appliedVoucher ? (
                  <span className='bg-green-50 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-green-200 flex items-center gap-1'>
                    <span>{appliedVoucher.code}</span>
                    <button
                      onClick={() => {
                        setAppliedVoucher(null);
                        setDiscountAmount(0);
                      }}
                      className='text-green-500 hover:text-green-700 font-black ml-1 text-xs'
                    >
                      ×
                    </button>
                  </span>
                ) : bestVoucherCode ? (
                  <span className='text-[10px] text-didongviet-red bg-red-50 px-2 py-0.5 rounded font-bold animate-pulse'>
                    Có mã tốt nhất!
                  </span>
                ) : null}
                <button
                  onClick={() => setShowVoucherModal(true)}
                  className='text-xs font-extrabold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer bg-transparent border-none'
                >
                  {appliedVoucher ? 'Thay đổi' : 'Chọn mã'}
                </button>
              </div>
            </div>

            {/* 3. TÍNH PHÍ VẬN CHUYỂN & THANH TOÁN */}
            <PaymentSummary
              selectedTotalPrice={selectedTotalPrice}
              shippingPrice={shippingPrice}
              discountAmount={discountAmount}
              grandTotal={grandTotal}
              submitting={submitting}
              handlePlaceOrder={handlePlaceOrder}
              formatVND={formatVND}
              paymentMethod={paymentMethod}
            />

            {/* Cam kết & Chính sách */}
            <div className='bg-white rounded-2xl border border-slate-100 shadow-xs p-4 space-y-4'>
              <div className='flex items-start gap-3'>
                <ShieldCheck size={20} className='text-emerald-600 flex-shrink-0' />
                <div>
                  <h4 className='text-[10px] font-bold text-slate-800 uppercase'>
                    Thanh toán bảo mật 100%
                  </h4>
                  <p className='text-[9px] text-slate-400 mt-0.5 leading-relaxed font-semibold'>
                    Hệ thống bảo mật SSL đạt chuẩn quốc tế. Thông tin cá nhân của bạn được cam kết mã hóa tuyệt đối.
                  </p>
                </div>
              </div>

              <div className='flex items-start gap-3 pt-3 border-t border-slate-50'>
                <Truck size={20} className='text-blue-600 flex-shrink-0' />
                <div>
                  <h4 className='text-[10px] font-bold text-slate-800 uppercase'>
                    Giao hàng siêu tốc
                  </h4>
                  <p className='text-[9px] text-slate-400 mt-0.5 leading-relaxed font-semibold'>
                    Dự kiến từ 2 - 5 ngày làm việc, hỗ trợ giao hỏa tốc trong nội thành.
                  </p>
                </div>
              </div>

              <div className='flex items-start gap-3 pt-3 border-t border-slate-50'>
                <RotateCcw size={20} className='text-orange-600 flex-shrink-0' />
                <div>
                  <h4 className='text-[10px] font-bold text-slate-800 uppercase'>Đổi trả tận tâm</h4>
                  <p className='text-[9px] text-slate-400 mt-0.5 leading-relaxed font-semibold'>Lỗi là đổi mới trong vòng 7 ngày nếu có lỗi từ nhà sản xuất.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Pop-up Voucher selection modal */}
      {showVoucherModal && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs animate-in fade-in duration-200'>
          <div className='bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl border border-slate-100 flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-200'>
            <div className='flex items-center justify-between border-b border-slate-100 pb-3 mb-4 flex-shrink-0'>
              <h3 className='text-sm font-black text-slate-800 uppercase tracking-tight'>
                Chọn mã giảm giá (Voucher)
              </h3>
              <button
                onClick={() => setShowVoucherModal(false)}
                className='text-slate-400 hover:text-slate-600 text-lg font-bold p-1 bg-transparent border-none cursor-pointer'
              >
                ×
              </button>
            </div>

            <div className='flex-1 overflow-y-auto pr-1'>
              <VoucherList
                applicableVouchers={applicableVouchers}
                vouchers={vouchers}
                bestVoucherCode={bestVoucherCode}
                appliedVoucher={appliedVoucher}
                onApplyVoucher={(v: any) => applyVoucherByCode(v.code)}
                onManualApply={(code: string) => {
                  setVoucherCode(code);
                  setTimeout(() => handleApplyVoucher(), 50);
                }}
                loading={voucherLoading}
              />
            </div>
          </div>
        </div>
      )}

      {/* Pop-up Address selection modal */}
      <AddressModal
        showAddressModal={showAddressModal}
        setShowAddressModal={setShowAddressModal}
        profile={profile}
        setProfile={setProfile}
        setProvince={setProvince}
        setDistrict={setDistrict}
        setWard={setWard}
        setStreetAddress={setStreetAddress}
        setAlert={setAlert}
      />
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className='min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8'>
        <div className='relative flex items-center justify-center'>
          <div className='h-12 w-12 animate-spin rounded-full border-3 border-didongviet-red border-t-transparent' />
          <div className='absolute text-[9px] font-bold text-didongviet-red uppercase tracking-wider animate-pulse'>
            DĐV
          </div>
        </div>
        <p className='mt-3 text-xs font-medium text-slate-500 animate-pulse'>
          Đang chuẩn bị trang thanh toán...
        </p>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
