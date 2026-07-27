'use client';

import { Suspense } from 'react';
import { useInventory } from '@/features/admin/hooks/useInventory';
import InventoryHeader from '@/features/admin/components/inventory/InventoryHeader';
import InventoryFilters from '@/features/admin/components/inventory/InventoryFilters';
import InventoryTable from '@/features/admin/components/inventory/InventoryTable';
import UpdateStockModal from '@/features/admin/components/inventory/UpdateStockModal';
import CreateReceiptModal from '@/features/admin/components/inventory/CreateReceiptModal';
import ReceiptsListModal from '@/features/admin/components/inventory/ReceiptsListModal';
import ThresholdEditModal from '@/features/admin/components/inventory/ThresholdEditModal';
import { CheckCircle, AlertCircle } from 'lucide-react';

function InventoryAdminContent() {
  const {
    alert,
    inventoryLoading,
    receiptsLoading,
    productsData,
    branchesData,
    receiptsData,
    currentThreshold,
    thresholdFilter,
    setThresholdFilter,

    // Bộ lọc nâng cao
    stockFilterType,
    setStockFilterType,
    categoriesData,
    selectedCategoryFilter,
    setSelectedCategoryFilter,

    // Phân trang
    currentPage,
    setCurrentPage,
    totalPages,
    totalItems,
    receiptsPage,
    setReceiptsPage,
    receiptsTotalPages,
    receiptsTotalCount,
    fetchReceipts,

    // Bộ lọc
    searchQuery,
    setSearchQuery,
    selectedBranchFilter,
    setSelectedBranchFilter,

    // Modals
    showUpdateStockModal,
    setShowUpdateStockModal,
    showCreateReceiptModal,
    setShowCreateReceiptModal,
    showReceiptsListModal,
    setShowReceiptsListModal,
    showThresholdEditModal,
    setShowThresholdEditModal,

    // Target items
    selectedProduct,
    selectedVariantIndex,
    selectedBranchId,
    selectedStockValue,

    // Pendings
    isUpdatePending,
    isReceiptPending,
    isThresholdPending,

    // Actions
    openUpdateStock,
    openCreateReceipt,
    openReceiptsList,
    openThresholdEdit,
    handleUpdateStockSubmit,
    handleCreateReceiptSubmit,
    handleUpdateThresholdSubmit,
    handleCancelReceipt,
  } = useInventory();

  return (
    <div className='space-y-6 relative'>
      

      {/* Header Phân hệ kho */}
      <InventoryHeader
        currentThreshold={currentThreshold}
        onOpenThresholdEdit={openThresholdEdit}
        onOpenReceiptsList={openReceiptsList}
      />

      {/* KHỐI CARD CHUNG CHỨA BỘ LỌC TÌM KIẾM & BẢNG TỒN KHO */}
      <div className='border border-slate-200/50 shadow-sm rounded-2xl overflow-hidden bg-white dark:bg-slate-900'>
        {/* Thanh bộ lọc */}
        <InventoryFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedBranchFilter={selectedBranchFilter}
          setSelectedBranchFilter={setSelectedBranchFilter}
          branches={branchesData}
          thresholdFilter={thresholdFilter}
          setThresholdFilter={setThresholdFilter}
          currentThreshold={currentThreshold}
          stockFilterType={stockFilterType}
          setStockFilterType={setStockFilterType}
          categories={categoriesData}
          selectedCategoryFilter={selectedCategoryFilter}
          setSelectedCategoryFilter={setSelectedCategoryFilter}
        />

        {/* Bảng tồn kho dạng cây cao cấp */}
        <InventoryTable
          products={productsData}
          branches={branchesData}
          currentThreshold={currentThreshold}
          thresholdFilter={thresholdFilter}
          loading={inventoryLoading}
          onOpenUpdateStock={openUpdateStock}
          onOpenCreateReceipt={openCreateReceipt}
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          onPageChange={setCurrentPage}
          selectedBranchFilter={selectedBranchFilter}
        />
      </div>

      {/* 1. Modal Điều chỉnh số lượng tồn trực tiếp */}
      <UpdateStockModal
        isOpen={showUpdateStockModal}
        onClose={() => setShowUpdateStockModal(false)}
        product={selectedProduct}
        variantIndex={selectedVariantIndex}
        branchId={selectedBranchId}
        branches={branchesData}
        currentStock={selectedStockValue}
        isPending={isUpdatePending}
        onSubmit={handleUpdateStockSubmit}
      />

      {/* 2. Modal Tạo phiếu nhập kho bổ sung */}
      <CreateReceiptModal
        isOpen={showCreateReceiptModal}
        onClose={() => setShowCreateReceiptModal(false)}
        product={selectedProduct}
        variantIndex={selectedVariantIndex}
        branchId={selectedBranchId}
        branches={branchesData}
        isPending={isReceiptPending}
        onSubmit={handleCreateReceiptSubmit}
      />

      {/* 3. Modal Xem lịch sử phiếu nhập kho */}
      <ReceiptsListModal
        isOpen={showReceiptsListModal}
        onClose={() => setShowReceiptsListModal(false)}
        receipts={receiptsData}
        loading={receiptsLoading}
        currentPage={receiptsPage}
        totalPages={receiptsTotalPages}
        totalCount={receiptsTotalCount}
        onPageChange={(page) => {
          setReceiptsPage(page);
          fetchReceipts(page);
        }}
        onCancelReceipt={handleCancelReceipt}
      />

      {/* 4. Modal Điều chỉnh cấu hình ngưỡng cảnh báo hệ thống */}
      <ThresholdEditModal
        isOpen={showThresholdEditModal}
        onClose={() => setShowThresholdEditModal(false)}
        currentThreshold={currentThreshold}
        isPending={isThresholdPending}
        onSubmit={handleUpdateThresholdSubmit}
      />
    </div>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className='flex flex-col items-center justify-center p-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/50 shadow-xs'>
          <div className='h-8 w-8 animate-spin rounded-full border-4 border-didongviet-red border-t-transparent' />
          <span className='text-xs text-slate-400 mt-2 font-medium'>
            Đang chuẩn bị bảng điều khiển tồn kho...
          </span>
        </div>
      }
    >
      <InventoryAdminContent />
    </Suspense>
  );
}
