'use client';

import { Suspense } from 'react';
import { useProduct } from '@/features/admin/hooks/useProduct';
import { ProductHeader } from '@/features/admin/components/products/ProductHeader';
import { ProductFilters } from '@/features/admin/components/products/ProductFilters';
import { ProductTable } from '@/features/admin/components/products/ProductTable';
import { CreateProductModal } from '@/features/admin/components/products/CreateProductModal';
import { EditProductModal } from '@/features/admin/components/products/EditProductModal';
import { DeleteProductModal } from '@/features/admin/components/products/DeleteProductModal';
import { CheckCircle, AlertCircle } from 'lucide-react';

function ProductsAdminContent() {
  const {
    currentUser,
    alert,
    productsData,
    productsPage,
    setProductsPage,
    productsTotalPages,
    productsTotalCount,
    productsSearch,
    setProductsSearch,
    selectedCategoryFilter,
    setSelectedCategoryFilter,
    selectedBranchFilter,
    setSelectedBranchFilter,
    productLoading,
    showCreateProductModal,
    setShowCreateProductModal,
    showEditProductModal,
    setShowEditProductModal,
    showDeleteProductModal,
    setShowDeleteProductModal,
    selectedProduct,
    setSelectedProduct,
    productToDelete,
    setProductToDelete,
    productVariants,
    setProductVariants,
    createProductPending,
    editProductPending,
    branchesData,
    categoriesData,
    mediaLoading,
    handleToggleProductStatus,
    confirmDeleteProduct,
    handleCreateProductSubmit,
    handleEditProductSubmit,
    handleReplaceProductImage,
    handleDeleteProductImage,
    handleSetProductThumbnail,
    handleReorderProductImages,
  } = useProduct();

  return (
    <div className='space-y-6 relative'>
      

      {/* TIÊU ĐỀ TRANG VÀ NÚT TẠO MỚI */}
      <ProductHeader
        onAddClick={() => {
          setSelectedProduct(null);
          setProductVariants([
            {
              color: '',
              ram: '',
              rom: '',
              price: '',
              salePrice: '',
              sku: '',
              variantImage: '',
              inventory: [],
            },
          ]);
          setShowCreateProductModal(true);
        }}
      />

      {/* BẢNG TỒN KHO & BỘ LỌC TÌM KIẾM */}
      <div className='border border-slate-200/50 shadow-sm rounded-2xl overflow-hidden bg-white dark:bg-slate-900'>
        <ProductFilters
          searchQuery={productsSearch}
          onSearchChange={setProductsSearch}
          filteredCount={productsData.length}
          totalCount={productsTotalCount}
          categories={categoriesData}
          selectedCategoryFilter={selectedCategoryFilter}
          onCategorySelect={setSelectedCategoryFilter}
          branches={branchesData}
          selectedBranchFilter={selectedBranchFilter}
          onBranchSelect={setSelectedBranchFilter}
        />

        <ProductTable
          products={productsData}
          loading={productLoading}
          currentPage={productsPage}
          totalPages={productsTotalPages}
          totalProducts={productsTotalCount}
          onPageChange={setProductsPage}
          onToggleStatus={handleToggleProductStatus}
          onEditClick={(p) => {
            setSelectedProduct(p);
            setProductVariants(p.variants || []);
            setShowEditProductModal(true);
          }}
          onDeleteClick={(p) => {
            setProductToDelete(p);
            setShowDeleteProductModal(true);
          }}
          currentUserRole={currentUser?.role}
          selectedBranchFilter={selectedBranchFilter}
          branches={branchesData}
        />
      </div>

      {/* MODAL 1: THÊM MỚI SẢN PHẨM */}
      <CreateProductModal
        isOpen={showCreateProductModal}
        onClose={() => setShowCreateProductModal(false)}
        onSubmit={handleCreateProductSubmit}
        categories={categoriesData}
        branches={branchesData}
        variants={productVariants}
        setVariants={setProductVariants}
        pending={createProductPending}
      />

      {/* MODAL 2: HIỆU CHỈNH SẢN PHẨM & MEDIA NÂNG CAO */}
      <EditProductModal
        isOpen={showEditProductModal}
        onClose={() => setShowEditProductModal(false)}
        onSubmit={handleEditProductSubmit}
        product={selectedProduct}
        categories={categoriesData}
        branches={branchesData}
        variants={productVariants}
        setVariants={setProductVariants}
        pending={editProductPending}
        mediaLoading={mediaLoading}
        onReplaceImage={handleReplaceProductImage}
        onDeleteImage={handleDeleteProductImage}
        onSetThumbnail={handleSetProductThumbnail}
        onReorderImages={handleReorderProductImages}
      />

      {/* MODAL 3: XÁC NHẬN XÓA VĨNH VIỄN */}
      <DeleteProductModal
        isOpen={showDeleteProductModal}
        onClose={() => setShowDeleteProductModal(false)}
        onConfirm={confirmDeleteProduct}
        productName={productToDelete?.name || ''}
      />
    </div>
  );
}

export default function ProductsAdminPage() {
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
      <ProductsAdminContent />
    </Suspense>
  );
}
