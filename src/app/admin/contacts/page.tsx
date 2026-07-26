'use client';

import React, { Suspense } from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useContact } from './useContact';
import { ContactHeader } from '@/app/admin/contacts/_contact-components/ContactHeader';
import { ContactFilters } from '@/app/admin/contacts/_contact-components/ContactFilters';
import { ContactTable } from '@/app/admin/contacts/_contact-components/ContactTable';
import { ContactDetailsModal } from '@/app/admin/contacts/_contact-components/ContactDetailsModal';
import { DeleteContactModal } from '@/app/admin/contacts/_contact-components/DeleteContactModal';

function ContactsAdminContent() {
  const {
    currentUser,
    alert,
    contactsData,
    contactsPage,
    setContactsPage,
    contactsTotalPages,
    contactsTotalCount,
    contactsStatusFilter,
    setContactsStatusFilter,
    contactSearch,
    setContactSearch,
    contactLoading,
    showContactDetailsModal,
    setShowContactDetailsModal,
    showDeleteContactModal,
    setShowDeleteContactModal,
    selectedContact,
    setSelectedContact,
    updateContactStatusPending,
    handleUpdateContactStatusSubmit,
    handleCancelContact,
    confirmDeleteContact,
  } = useContact();

  return (
    <div className='space-y-6 relative'>
      

      {/* TIÊU ĐỀ TRANG DYNAMIC */}
      <ContactHeader />

      {/* DANH SÁCH LIÊN HỆ */}
      <Card className='border-slate-200/50 shadow-sm rounded-2xl overflow-hidden'>
        {/* Bộ lọc trạng thái ngang và tổng phản hồi */}
        <ContactFilters
          contactsStatusFilter={contactsStatusFilter}
          setContactsStatusFilter={setContactsStatusFilter}
          contactSearch={contactSearch}
          setContactSearch={setContactSearch}
          contactsTotalCount={contactsTotalCount}
        />

        {/* Bảng danh sách phiếu khiếu nại */}
        <ContactTable
          contactLoading={contactLoading}
          contactsData={contactsData}
          contactsPage={contactsPage}
          contactsTotalPages={contactsTotalPages}
          contactsTotalCount={contactsTotalCount}
          setContactsPage={setContactsPage}
          onOpenDetails={(c) => {
            setSelectedContact(c);
            setShowContactDetailsModal(true);
          }}
        />
      </Card>

      {/* MODALS HỘP THOẠI */}
      <ContactDetailsModal
        isOpen={showContactDetailsModal}
        selectedContact={selectedContact}
        currentUser={currentUser}
        onClose={() => setShowContactDetailsModal(false)}
        onSubmit={handleUpdateContactStatusSubmit}
        onCancelContact={handleCancelContact}
        onDeleteContact={() => setShowDeleteContactModal(true)}
        updateContactStatusPending={updateContactStatusPending}
      />

      <DeleteContactModal
        isOpen={showDeleteContactModal}
        selectedContact={selectedContact}
        onClose={() => setShowDeleteContactModal(false)}
        onConfirm={confirmDeleteContact}
      />
    </div>
  );
}

export default function ContactsAdminPage() {
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
      <ContactsAdminContent />
    </Suspense>
  );
}
