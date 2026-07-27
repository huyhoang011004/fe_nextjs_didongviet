'use client';

import { Suspense } from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useAccount } from '@/features/admin/hooks/useAccount';
import { AccountHeader } from '@/features/admin/components/accounts/AccountHeader';
import { AccountFilters } from '@/features/admin/components/accounts/AccountFilters';
import { AccountTable } from '@/features/admin/components/accounts/AccountTable';
import { CreateUserModal } from '@/features/admin/components/accounts/CreateUserModal';
import { EditUserModal } from '@/features/admin/components/accounts/EditUserModal';
import { LockUserModal } from '@/features/admin/components/accounts/LockUserModal';
import { DeleteUserModal } from '@/features/admin/components/accounts/DeleteUserModal';

function AccountsAdminContent() {
  const {
    alert,
    usersData,
    usersPage,
    setUsersPage,
    usersTotalPages,
    usersTotalCount,
    usersFilter,
    setUsersFilter,
    usersSearch,
    setUsersSearch,
    userLoading,
    showCreateUserModal,
    setShowCreateUserModal,
    createUserPending,
    showEditUserModal,
    setShowEditUserModal,
    selectedUser,
    setSelectedUser,
    editUserPending,
    showLockUserModal,
    setShowLockUserModal,
    userToLock,
    setUserToLock,
    showDeleteUserModal,
    setShowDeleteUserModal,
    userToDelete,
    setUserToDelete,
    handleCreateUserSubmit,
    handleEditUserSubmit,
    confirmLockUser,
    confirmDeleteUser,
  } = useAccount();

  return (
    <div className='space-y-6 relative'>
      

      {/* TIÊU ĐỀ TRANG */}
      <AccountHeader onAddAccount={() => setShowCreateUserModal(true)} />

      {/* BẢNG DANH SÁCH & BỘ LỌC */}
      <Card className='border-slate-200/50 shadow-sm rounded-2xl overflow-hidden'>
        <AccountFilters
          usersFilter={usersFilter}
          setUsersFilter={setUsersFilter}
          usersSearch={usersSearch}
          setUsersSearch={setUsersSearch}
          setUsersPage={setUsersPage}
          usersTotalCount={usersTotalCount}
        />
        <AccountTable
          userLoading={userLoading}
          usersData={usersData}
          usersPage={usersPage}
          usersTotalPages={usersTotalPages}
          usersTotalCount={usersTotalCount}
          setUsersPage={setUsersPage}
          onEdit={(user) => {
            setSelectedUser(user);
            setShowEditUserModal(true);
          }}
          onLock={(user) => {
            setUserToLock(user);
            setShowLockUserModal(true);
          }}
          onDelete={(user) => {
            setUserToDelete(user);
            setShowDeleteUserModal(true);
          }}
        />
      </Card>

      {/* MODALS HỘP THOẠI */}
      <CreateUserModal
        isOpen={showCreateUserModal}
        onClose={() => setShowCreateUserModal(false)}
        onSubmit={handleCreateUserSubmit}
        createUserPending={createUserPending}
      />

      <EditUserModal
        isOpen={showEditUserModal}
        selectedUser={selectedUser}
        onClose={() => setShowEditUserModal(false)}
        onSubmit={handleEditUserSubmit}
        editUserPending={editUserPending}
      />

      <LockUserModal
        isOpen={showLockUserModal}
        userToLock={userToLock}
        onClose={() => setShowLockUserModal(false)}
        onConfirm={confirmLockUser}
      />

      <DeleteUserModal
        isOpen={showDeleteUserModal}
        userToDelete={userToDelete}
        onClose={() => setShowDeleteUserModal(false)}
        onConfirm={confirmDeleteUser}
      />
    </div>
  );
}

export default function AccountsAdminPage() {
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
      <AccountsAdminContent />
    </Suspense>
  );
}
