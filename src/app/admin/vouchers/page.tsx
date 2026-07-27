'use client';

import { Suspense } from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useVoucher } from '@/features/admin/hooks/useVoucher';
import { VoucherFilters } from '@/features/admin/components/vouchers/VoucherFilters';
import { VoucherHeader } from '@/features/admin/components/vouchers/VoucherHeader';
import { VoucherTable } from '@/features/admin/components/vouchers/VoucherTable';
import { CreateVoucherModal } from '@/features/admin/components/vouchers/CreateVoucherModal';
import { EditVoucherModal } from '@/features/admin/components/vouchers/EditVoucherModal';
import { DeleteVoucherModal } from '@/features/admin/components/vouchers/DeleteVoucherModal';

function VouchersAdminContent() {
  const {
    alert,
    vouchersData,
    voucherSearch,
    setVoucherSearch,
    vouchersFilter,
    setVouchersFilter,
    filteredVouchers,
    voucherLoading,
    showCreateVoucherModal,
    setShowCreateVoucherModal,
    showEditVoucherModal,
    setShowEditVoucherModal,
    showDeleteVoucherModal,
    setShowDeleteVoucherModal,
    selectedVoucher,
    setSelectedVoucher,
    createVoucherPending,
    editVoucherPending,
    voucherDiscountType,
    setVoucherDiscountType,
    hssvTiers,
    setHssvTiers,
    handleCreateVoucherSubmit,
    handleEditVoucherSubmit,
    confirmDeleteVoucher,
  } = useVoucher();

  return (
    <div className='space-y-6 relative'>
      

      {/* TIÊU ĐỀ TRANG DYNAMIC */}
      <VoucherHeader
        onAddVoucher={() => {
          setSelectedVoucher(null);
          setVoucherDiscountType('fixed');
          setHssvTiers([{ minOrderValue: 0, discountAmount: 0 }]);
          setShowCreateVoucherModal(true);
        }}
      />

      {/* DANH SÁCH VOUCHERS */}
      <Card className='border-slate-200/50 shadow-sm rounded-2xl overflow-hidden'>
        <VoucherFilters
          vouchersFilter={vouchersFilter}
          setVouchersFilter={setVouchersFilter}
          voucherSearch={voucherSearch}
          setVoucherSearch={setVoucherSearch}
          filteredCount={filteredVouchers.length}
          totalCount={vouchersData.length}
        />

        <VoucherTable
          voucherLoading={voucherLoading}
          vouchersData={filteredVouchers}
          onEdit={(v) => {
            setSelectedVoucher(v);
            setVoucherDiscountType(v.discountType);
            setHssvTiers(v.hssvTiers || []);
            setShowEditVoucherModal(true);
          }}
          onDelete={(v) => {
            setSelectedVoucher(v);
            setShowDeleteVoucherModal(true);
          }}
        />
      </Card>

      {/* MODALS HỘP THOẠI */}
      <CreateVoucherModal
        isOpen={showCreateVoucherModal}
        onClose={() => setShowCreateVoucherModal(false)}
        onSubmit={handleCreateVoucherSubmit}
        createVoucherPending={createVoucherPending}
        voucherDiscountType={voucherDiscountType}
        setVoucherDiscountType={setVoucherDiscountType}
        hssvTiers={hssvTiers}
        setHssvTiers={setHssvTiers}
      />

      <EditVoucherModal
        isOpen={showEditVoucherModal}
        selectedVoucher={selectedVoucher}
        onClose={() => setShowEditVoucherModal(false)}
        onSubmit={handleEditVoucherSubmit}
        editVoucherPending={editVoucherPending}
        voucherDiscountType={voucherDiscountType}
        setVoucherDiscountType={setVoucherDiscountType}
        hssvTiers={hssvTiers}
        setHssvTiers={setHssvTiers}
      />

      <DeleteVoucherModal
        isOpen={showDeleteVoucherModal}
        selectedVoucher={selectedVoucher}
        onClose={() => setShowDeleteVoucherModal(false)}
        onConfirm={confirmDeleteVoucher}
      />
    </div>
  );
}

export default function VouchersAdminPage() {
  return (
    <Suspense
      fallback={
        <div className='flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-slate-200/50 shadow-xs'>
          <div className='h-8 w-8 animate-spin rounded-full border-4 border-didongviet-red border-t-transparent' />
          <span className='text-xs text-slate-400 mt-2 font-medium'>
            Đang chuẩn bị bảng điều khiển...
          </span>
        </div>
      }
    >
      <VouchersAdminContent />
    </Suspense>
  );
}
