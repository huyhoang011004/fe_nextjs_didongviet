'use client';

import { Suspense } from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useOrder } from '@/features/admin/hooks/useOrder';
import { OrderHeader } from '@/features/admin/components/orders/OrderHeader';
import { OrderFilters } from '@/features/admin/components/orders/OrderFilters';
import { OrderTable } from '@/features/admin/components/orders/OrderTable';
import { OrderDetailsModal } from '@/features/admin/components/orders/OrderDetailsModal';
import { DeleteOrderModal } from '@/features/admin/components/orders/DeleteOrderModal';

function OrdersAdminContent() {
  const {
    alert,
    ordersData,
    orderLoading,
    filteredOrders,
    selectedOrder,
    setSelectedOrder,
    showOrderDetailsModal,
    setShowOrderDetailsModal,
    showDeleteOrderModal,
    setShowDeleteOrderModal,
    orderSearch,
    setOrderSearch,
    orderStatusFilter,
    setOrderStatusFilter,
    handleUpdateOrderStatus,
    confirmDeleteOrder,
  } = useOrder();

  return (
    <div className='space-y-6 relative'>
      

      {/* TIÊU ĐỀ TRANG */}
      <OrderHeader />

      {/* BẢNG ĐƠN HÀNG */}
      <Card className='border-slate-200/50 shadow-sm rounded-2xl overflow-hidden'>
        <OrderFilters
          orderSearch={orderSearch}
          setOrderSearch={setOrderSearch}
          orderStatusFilter={orderStatusFilter}
          setOrderStatusFilter={setOrderStatusFilter}
          filteredCount={filteredOrders.length}
          totalCount={ordersData.length}
          orders={ordersData}
        />

        <OrderTable
          orders={filteredOrders}
          loading={orderLoading}
          onViewOrder={(order) => {
            setSelectedOrder(order);
            setShowOrderDetailsModal(true);
          }}
          onUpdateStatus={handleUpdateOrderStatus}
        />
      </Card>

      {/* MODAL CHI TIẾT ĐƠN HÀNG */}
      <OrderDetailsModal
        isOpen={showOrderDetailsModal}
        order={selectedOrder}
        onClose={() => setShowOrderDetailsModal(false)}
        onUpdateStatus={handleUpdateOrderStatus}
        onDeleteClick={() => setShowDeleteOrderModal(true)}
      />

      {/* MODAL XÁC NHẬN XÓA */}
      <DeleteOrderModal
        isOpen={showDeleteOrderModal}
        onClose={() => setShowDeleteOrderModal(false)}
        onConfirm={confirmDeleteOrder}
        orderId={selectedOrder?._id || ''}
      />
    </div>
  );
}

export default function OrdersAdminPage() {
  return (
    <Suspense
      fallback={
        <div className='flex flex-col items-center justify-center p-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/50 shadow-xs'>
          <div className='h-8 w-8 animate-spin rounded-full border-4 border-didongviet-red border-t-transparent' />
          <span className='text-xs text-slate-400 mt-2 font-medium'>
            Đang chuẩn bị bảng quản lý đơn hàng...
          </span>
        </div>
      }
    >
      <OrdersAdminContent />
    </Suspense>
  );
}
