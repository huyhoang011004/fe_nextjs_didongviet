'use client';

import React, { Suspense } from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useStudentVerification } from './useStudentVerification';
import { StudentVerificationHeader } from '@/app/admin/student-verifications/_student-verification-components/StudentVerificationHeader';
import { StudentVerificationFilters } from '@/app/admin/student-verifications/_student-verification-components/StudentVerificationFilters';
import { StudentVerificationTable } from '@/app/admin/student-verifications/_student-verification-components/StudentVerificationTable';
import { StudentVerificationDetailsModal } from '@/app/admin/student-verifications/_student-verification-components/StudentVerificationDetailsModal';

function StudentVerificationsAdminContent() {
  const {
    alert,
    pendingProfiles,
    searchQuery,
    setSearchQuery,
    filteredProfiles,
    loading,
    showDetailsModal,
    setShowDetailsModal,
    selectedProfile,
    setSelectedProfile,
    verifyPending,
    handleVerifySubmit,
  } = useStudentVerification();

  return (
    <div className='space-y-6 relative'>
      

      {/* TIÊU ĐỀ TRANG DYNAMIC */}
      <StudentVerificationHeader />

      {/* DANH SÁCH HỒ SƠ CHỜ DUYỆT */}
      <Card className='border-slate-200/50 shadow-sm rounded-2xl overflow-hidden'>
        {/* Bộ lọc số lượng chờ duyệt & Thanh tìm kiếm */}
        <StudentVerificationFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          pendingCount={pendingProfiles.length}
        />

        {/* Bảng danh sách hồ sơ HSSV */}
        <StudentVerificationTable
          loading={loading}
          profilesData={filteredProfiles}
          onOpenDetails={(p) => {
            setSelectedProfile(p);
            setShowDetailsModal(true);
          }}
        />
      </Card>

      {/* MODALS HỘP THOẠI XÉT DUYỆT */}
      <StudentVerificationDetailsModal
        isOpen={showDetailsModal}
        selectedProfile={selectedProfile}
        onClose={() => setShowDetailsModal(false)}
        onSubmit={handleVerifySubmit}
        verifyPending={verifyPending}
      />
    </div>
  );
}

export default function StudentVerificationsAdminPage() {
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
      <StudentVerificationAdminContent />
    </Suspense>
  );
}

// Rename component inside file to match correctly
const StudentVerificationAdminContent = StudentVerificationsAdminContent;
