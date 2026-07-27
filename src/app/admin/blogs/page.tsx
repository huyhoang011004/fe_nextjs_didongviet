'use client';

import React, { Suspense } from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useBlog } from '@/features/admin/hooks/useBlog';
import { BlogHeader } from '@/features/admin/components/blogs/BlogHeader';
import { BlogFilters } from '@/features/admin/components/blogs/BlogFilters';
import { BlogTable } from '@/features/admin/components/blogs/BlogTable';
import { CreateBlogModal } from '@/features/admin/components/blogs/CreateBlogModal';
import { EditBlogModal } from '@/features/admin/components/blogs/EditBlogModal';
import { DeleteBlogModal } from '@/features/admin/components/blogs/DeleteBlogModal';

function BlogsAdminContent() {
  const {
    currentUser,
    alert,
    blogsData,
    blogsPage,
    setBlogsPage,
    blogsTotalPages,
    blogsTotalCount,
    blogsCategoryFilter,
    setBlogsCategoryFilter,
    blogsSearch,
    setBlogsSearch,
    blogLoading,
    showCreateBlogModal,
    setShowCreateBlogModal,
    showEditBlogModal,
    setShowEditBlogModal,
    showDeleteBlogModal,
    setShowDeleteBlogModal,
    selectedBlog,
    setSelectedBlog,
    createBlogPending,
    editBlogPending,
    handleCreateBlogSubmit,
    handleEditBlogSubmit,
    handleToggleBlogActive,
    confirmDeleteBlog,
  } = useBlog();

  return (
    <div className='space-y-6 relative'>
      

      {/* TIÊU ĐỀ TRANG DYNAMIC */}
      <BlogHeader
        onAddBlog={() => {
          setSelectedBlog(null);
          setShowCreateBlogModal(true);
        }}
      />

      {/* DANH SÁCH BÀI VIẾT */}
      <Card className='border-slate-200/50 shadow-sm rounded-2xl overflow-hidden'>
        {/* Bộ lọc chuyên mục, tìm kiếm và thống kê số bài */}
        <BlogFilters
          blogsCategoryFilter={blogsCategoryFilter}
          setBlogsCategoryFilter={setBlogsCategoryFilter}
          blogsSearch={blogsSearch}
          setBlogsSearch={setBlogsSearch}
          blogsTotalCount={blogsTotalCount}
        />

        {/* Bảng danh sách bài viết */}
        <BlogTable
          blogLoading={blogLoading}
          blogsData={blogsData}
          blogsPage={blogsPage}
          blogsTotalPages={blogsTotalPages}
          blogsTotalCount={blogsTotalCount}
          setBlogsPage={setBlogsPage}
          onToggleActive={handleToggleBlogActive}
          onEdit={(b) => {
            setSelectedBlog(b);
            setShowEditBlogModal(true);
          }}
          onDelete={(b) => {
            setSelectedBlog(b);
            setShowDeleteBlogModal(true);
          }}
        />
      </Card>

      {/* MODALS HỘP THOẠI */}
      <CreateBlogModal
        isOpen={showCreateBlogModal}
        onClose={() => setShowCreateBlogModal(false)}
        onSubmit={handleCreateBlogSubmit}
        createBlogPending={createBlogPending}
      />

      <EditBlogModal
        isOpen={showEditBlogModal}
        selectedBlog={selectedBlog}
        onClose={() => setShowEditBlogModal(false)}
        onSubmit={handleEditBlogSubmit}
        editBlogPending={editBlogPending}
      />

      <DeleteBlogModal
        isOpen={showDeleteBlogModal}
        selectedBlog={selectedBlog}
        onClose={() => setShowDeleteBlogModal(false)}
        onConfirm={confirmDeleteBlog}
      />
    </div>
  );
}

export default function BlogsAdminPage() {
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
      <BlogsAdminContent />
    </Suspense>
  );
}
