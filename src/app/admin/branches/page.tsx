'use client';

import { Suspense } from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useBranch } from '@/features/admin/hooks/useBranch';
import { BranchHeader } from '@/features/admin/components/branches/BranchHeader';
import { BranchFilters } from '@/features/admin/components/branches/BranchFilters';
import { BranchTable } from '@/features/admin/components/branches/BranchTable';
import { CreateBranchModal } from '@/features/admin/components/branches/CreateBranchModal';
import { EditBranchModal } from '@/features/admin/components/branches/EditBranchModal';
import { DeleteBranchModal } from '@/features/admin/components/branches/DeleteBranchModal';

function BranchesAdminContent() {
  const {
    alert,
    branchesData,
    branchLoading,
    branchSearch,
    setBranchSearch,
    branchFilter,
    setBranchFilter,
    filteredBranches,
    showCreateModal,
    setShowCreateModal,
    showEditModal,
    setShowEditModal,
    showDeleteModal,
    setShowDeleteModal,
    selectedBranch,
    setSelectedBranch,
    createPending,
    editPending,
    handleCreateSubmit,
    handleEditSubmit,
    confirmDelete,
  } = useBranch();

  return (
    <div className='space-y-6 relative'>
      

      {/* TIÊU ĐỀ TRANG */}
      <BranchHeader onAddClick={() => setShowCreateModal(true)} />

      {/* BẢNG CHI NHÁNH */}
      <Card className='border-slate-200/50 shadow-sm rounded-2xl overflow-hidden'>
        <BranchFilters
          branchSearch={branchSearch}
          setBranchSearch={setBranchSearch}
          branchFilter={branchFilter}
          setBranchFilter={setBranchFilter}
          filteredCount={filteredBranches.length}
          totalCount={branchesData.length}
        />

        <BranchTable
          branches={filteredBranches}
          loading={branchLoading}
          onEdit={(branch) => {
            setSelectedBranch(branch);
            setShowEditModal(true);
          }}
          onDelete={(branch) => {
            setSelectedBranch(branch);
            setShowDeleteModal(true);
          }}
        />
      </Card>

      {/* MODAL TẠO MỚI */}
      <CreateBranchModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateSubmit}
        pending={createPending}
      />

      {/* MODAL CHỈNH SỬA */}
      <EditBranchModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSubmit={handleEditSubmit}
        pending={editPending}
        branch={selectedBranch}
      />

      {/* MODAL XÁC NHẬN XÓA */}
      <DeleteBranchModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        branchName={selectedBranch?.name || ''}
      />
    </div>
  );
}

export default function BranchesAdminPage() {
  return (
    <Suspense
      fallback={
        <div className='flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-slate-200/50 shadow-xs'>
          <div className='h-8 w-8 animate-spin rounded-full border-4 border-didongviet-red border-t-transparent' />
          <span className='text-xs text-slate-400 mt-2 font-medium'>
            Đang chuẩn bị bảng điều khiển chi nhánh...
          </span>
        </div>
      }
    >
      <BranchesAdminContent />
    </Suspense>
  );
}
