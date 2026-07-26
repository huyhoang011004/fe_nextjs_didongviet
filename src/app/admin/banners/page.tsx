'use client';
import toast from 'react-hot-toast';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Image as ImageIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  getBannersAction,
  createBannerAction,
  updateBannerAction,
  deleteBannerAction,
} from './banner-actions';

interface Banner {
  _id: string;
  title: string;
  imageUrl: string;
  link: string;
  position:
    | 'carousel'
    | 'right'
    | 'horizontal'
    | 'grid'
    | 'customer_gallery'
    | 'partner_logos';
  isActive: boolean;
  order: number;
}

export default function BannersAdminPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    imageUrl: '',
    link: '/',
    position: 'carousel',
    isActive: true,
    order: 1,
  });

  const [uploading, setUploading] = useState(false);

  const loadBanners = async () => {
    setLoading(true);
    try {
      const res = await getBannersAction();
      if (res.success) {
        setBanners(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBanners();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const form = new FormData();
    form.append('file', file);

    try {
      const res = await fetch('/api/banners/upload', {
        method: 'POST',
        body: form,
      });
      const data = await res.json();
      if (data.success) {
        setFormData((prev) => ({ ...prev, imageUrl: data.url }));
      } else {
        toast.error(data.message || 'Lỗi khi upload ảnh');
      }
    } catch (err) {
      console.error(err);
      toast.error('Lỗi kết nối khi upload ảnh');
    } finally {
      setUploading(false);
    }
  };

  const handleOpenAdd = (position: string) => {
    setFormData({
      title: '',
      imageUrl: '',
      link: '/',
      position: position,
      isActive: true,
      order: 1,
    });
    setEditingId(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (banner: Banner) => {
    setFormData({
      title: banner.title,
      imageUrl: banner.imageUrl,
      link: banner.link,
      position: banner.position,
      isActive: banner.isActive,
      order: banner.order,
    });
    setEditingId(banner._id);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa banner này?')) return;

    try {
      const res = await deleteBannerAction(id);
      if (res.success) {
        // Cập nhật lại UI ngay lập tức
        setBanners((prev) => prev.filter((b) => b._id !== id));
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.imageUrl && formData.position !== 'partner_logos') {
      toast.error('Vui lòng upload ảnh banner!');
      return;
    }

    try {
      let res;
      if (editingId) {
        res = await updateBannerAction(editingId, formData);
      } else {
        res = await createBannerAction(formData);
      }

      if (res.success) {
        setIsFormOpen(false);
        loadBanners(); // Reload to get updated data
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      console.error(err);
      toast.error('Lỗi hệ thống khi lưu banner');
    }
  };

  // ----------------------------------------------------
  // SUB-COMPONENTS CHO VISUAL EDITOR
  // ----------------------------------------------------

  // 1. Khung hiển thị từng ảnh Banner
  const VisualBannerItem = ({
    banner,
    className = '',
  }: {
    banner: Banner;
    className?: string;
  }) => (
    <div
      className={`relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center ${className}`}
    >
      {banner.imageUrl ? (
        <img
          src={banner.imageUrl}
          alt={banner.title}
          className='w-full h-full object-cover'
        />
      ) : (
        <span className='text-[10px] font-bold text-slate-400 p-2 text-center'>
          {banner.title || '(Chưa có tiêu đề)'}
        </span>
      )}

      {/* Overlay Hover */}
      <div className='absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3'>
        <button
          onClick={() => handleOpenEdit(banner)}
          className='p-2 bg-white text-slate-800 rounded-full hover:bg-slate-200 transition'
          title='Sửa banner'
        >
          <Edit2 size={16} />
        </button>
        <button
          onClick={() => handleDelete(banner._id)}
          className='p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition'
          title='Xóa banner'
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Hiển thị link (Nút mờ ở góc dưới) */}
      <div className='absolute bottom-2 right-2 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur-sm truncate max-w-[80%] opacity-0 group-hover:opacity-100'>
        {banner.link}
      </div>
    </div>
  );

  // 2. Nút bấm Thêm Banner (Placeholder)
  const AddBannerPlaceholder = ({
    position,
    className = '',
  }: {
    position: string;
    className?: string;
  }) => (
    <button
      onClick={() => handleOpenAdd(position)}
      className={`border-2 border-dashed border-slate-300 hover:border-didongviet-red hover:bg-red-50/50 rounded-xl flex flex-col items-center justify-center text-slate-400 hover:text-didongviet-red transition-all gap-2 min-h-[80px] w-full h-full ${className}`}
    >
      <Plus size={24} />
      <span className='text-[10px] sm:text-xs font-bold px-2 text-center'>
        Thêm Banner
      </span>
    </button>
  );

  return (
    <div className='space-y-6 pb-20'>
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-5'>
        <div>
          <h1 className='text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2'>
            <ImageIcon className='text-didongviet-red' size={24} />
            <span>Visual Banner Editor</span>
          </h1>
          <p className='text-xs text-slate-500 font-medium mt-1'>
            Quản lý trực quan các ảnh quảng cáo, banner các vị trí hiển thị trên
            trang chủ
          </p>
        </div>
      </div>

      {/* FORM MODAL (Sửa/Thêm) */}
      {isFormOpen && (
        <div className='fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm'>
          <div className='bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto'>
            <div className='flex justify-between items-center mb-6'>
              <h2 className='text-lg font-black text-slate-800 uppercase tracking-tight'>
                {editingId ? 'Sửa Banner' : 'Thêm Banner Mới'}
              </h2>
              <button
                onClick={() => setIsFormOpen(false)}
                className='text-slate-400 hover:text-slate-800 transition'
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className='space-y-5'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                <div className='space-y-1.5 md:col-span-2'>
                  <label className='text-xs font-bold text-slate-700'>
                    Tiêu đề (Alt text / Tên hiển thị) *
                  </label>
                  <input
                    required
                    type='text'
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className='w-full text-sm p-3 border rounded-xl outline-none focus:border-didongviet-red bg-slate-50 focus:bg-white transition'
                  />
                </div>

                <div className='space-y-1.5 md:col-span-2'>
                  <label className='text-xs font-bold text-slate-700'>
                    Link điều hướng (URL)
                  </label>
                  <input
                    type='text'
                    value={formData.link}
                    onChange={(e) =>
                      setFormData({ ...formData, link: e.target.value })
                    }
                    className='w-full text-sm p-3 border rounded-xl outline-none focus:border-didongviet-red bg-slate-50 focus:bg-white transition'
                  />
                </div>

                <div className='space-y-1.5'>
                  <label className='text-xs font-bold text-slate-700'>
                    Vị trí hiển thị (Đã khóa)
                  </label>
                  <input
                    type='text'
                    disabled
                    value={formData.position}
                    className='w-full text-sm font-bold p-3 border border-slate-200 rounded-xl bg-slate-100 text-slate-500 cursor-not-allowed uppercase'
                  />
                </div>

                <div className='space-y-1.5'>
                  <label className='text-xs font-bold text-slate-700'>
                    Thứ tự hiển thị (Từ 1 trở lên)
                  </label>
                  <input
                    type='number'
                    min='1'
                    value={formData.order}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        order: Math.max(1, Number(e.target.value)),
                      })
                    }
                    className='w-full text-sm p-3 border rounded-xl outline-none focus:border-didongviet-red bg-slate-50 focus:bg-white transition'
                  />
                </div>

                <div className='space-y-1.5 md:col-span-2 border-t pt-4 border-slate-100'>
                  <label className='text-xs font-bold text-slate-700 block mb-3'>
                    Hình ảnh *
                  </label>
                  <div className='flex flex-col sm:flex-row items-center gap-5'>
                    {formData.imageUrl ? (
                      <div className='relative group rounded-xl overflow-hidden border w-40 h-24 flex-shrink-0 bg-slate-100'>
                        <img
                          src={formData.imageUrl}
                          alt='preview'
                          className='w-full h-full object-cover'
                        />
                      </div>
                    ) : (
                      <div className='w-40 h-24 rounded-xl border-2 border-dashed flex items-center justify-center text-slate-400 bg-slate-50 flex-shrink-0'>
                        Chưa có ảnh
                      </div>
                    )}

                    <div className='w-full'>
                      <input
                        type='file'
                        id='upload-banner'
                        accept='image/*'
                        onChange={handleFileUpload}
                        className='hidden'
                      />
                      <label
                        htmlFor='upload-banner'
                        className='bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-3 px-6 rounded-xl cursor-pointer inline-flex items-center gap-2 border border-slate-200 transition'
                      >
                        <ImageIcon size={16} />
                        {uploading
                          ? 'Đang tải lên...'
                          : formData.imageUrl
                            ? 'Thay đổi ảnh'
                            : 'Chọn ảnh từ máy'}
                      </label>
                      <p className='text-[10px] text-slate-500 mt-2'>
                        Ảnh sẽ được lưu vào thư mục public của hệ thống.
                      </p>
                    </div>
                  </div>
                </div>

                <div className='flex items-center gap-2 md:col-span-2'>
                  <input
                    type='checkbox'
                    id='isActive'
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                    className='h-5 w-5 rounded border-slate-300 text-didongviet-red focus:ring-didongviet-red cursor-pointer'
                  />
                  <label
                    htmlFor='isActive'
                    className='text-sm font-bold text-slate-700 cursor-pointer select-none'
                  >
                    Hiển thị ra ngoài trang chủ
                  </label>
                </div>
              </div>

              <div className='flex justify-end gap-3 pt-6 mt-6 border-t border-slate-100'>
                <Button
                  type='button'
                  onClick={() => setIsFormOpen(false)}
                  variant='outline'
                  className='rounded-xl font-bold py-5 px-6'
                >
                  Hủy
                </Button>
                <Button
                  type='submit'
                  className='bg-didongviet-red hover:bg-didongviet-dark-red text-white rounded-xl font-bold py-5 px-8'
                >
                  {editingId ? 'Cập nhật Banner' : 'Lưu Banner'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* HIỂN THỊ TRỰC QUAN GIAO DIỆN */}
      {loading ? (
        <div className='py-20 text-center text-slate-400 font-medium'>
          Đang tải cấu hình giao diện...
        </div>
      ) : (
        <div className='space-y-12 bg-slate-100/50 p-6 rounded-3xl border border-slate-200'>
          {/* SECTION 1: Banner Chính & Cột Phải */}
          <section>
            <h2 className='text-sm font-black uppercase text-slate-700 mb-4 tracking-tight flex items-center gap-2'>
              <span className='w-2 h-2 rounded-full bg-didongviet-red'></span>
              Banner Cuộn (Chính) & Cột Phải
            </h2>
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
              {/* Carousel (Chiếm 2/3) */}
              <div className='lg:col-span-2 bg-white p-3 rounded-2xl shadow-sm border border-slate-200'>
                <div className='text-[10px] font-bold text-slate-400 uppercase mb-2'>
                  Vị trí: carousel
                </div>
                <div className='grid grid-cols-2 gap-3'>
                  {banners
                    .filter((b) => b.position === 'carousel')
                    .map((banner) => (
                      <VisualBannerItem
                        key={banner._id}
                        banner={banner}
                        className='aspect-[21/9]'
                      />
                    ))}
                  <AddBannerPlaceholder
                    position='carousel'
                    className='aspect-[21/9]'
                  />
                </div>
              </div>

              {/* Right Banners (Chiếm 1/3) */}
              <div className='bg-white p-3 rounded-2xl shadow-sm border border-slate-200'>
                <div className='text-[10px] font-bold text-slate-400 uppercase mb-2'>
                  Vị trí: right
                </div>
                <div className='grid grid-cols-2 gap-3'>
                  {banners
                    .filter((b) => b.position === 'right')
                    .map((banner) => (
                      <VisualBannerItem
                        key={banner._id}
                        banner={banner}
                        className='aspect-[21/9]'
                      />
                    ))}
                  <AddBannerPlaceholder
                    position='right'
                    className='aspect-[21/9]'
                  />
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 2: Lưới 4 Banner */}
          <section>
            <h2 className='text-sm font-black uppercase text-slate-700 mb-4 tracking-tight flex items-center gap-2'>
              <span className='w-2 h-2 rounded-full bg-blue-500'></span>
              Lưới 4 Banner Đặc Quyền
            </h2>
            <div className='bg-white p-3 rounded-2xl shadow-sm border border-slate-200'>
              <div className='text-[10px] font-bold text-slate-400 uppercase mb-2'>
                Vị trí: grid (Tối đa 4)
              </div>
              <div className='grid grid-cols-2 md:grid-cols-4 gap-3 h-[150px]'>
                {banners
                  .filter((b) => b.position === 'grid')
                  .map((banner) => (
                    <VisualBannerItem
                      key={banner._id}
                      banner={banner}
                      className='h-full'
                    />
                  ))}
                {banners.filter((b) => b.position === 'grid').length < 4 && (
                  <AddBannerPlaceholder position='grid' />
                )}
              </div>
            </div>
          </section>

          {/* SECTION 3: Banner Ngang */}
          <section>
            <h2 className='text-sm font-black uppercase text-slate-700 mb-4 tracking-tight flex items-center gap-2'>
              <span className='w-2 h-2 rounded-full bg-emerald-500'></span>
              Banner Ngang Dài
            </h2>
            <div className='bg-white p-3 rounded-2xl shadow-sm border border-slate-200'>
              <div className='text-[10px] font-bold text-slate-400 uppercase mb-2'>
                Vị trí: horizontal
              </div>
              <div className='flex flex-col gap-3'>
                {banners
                  .filter((b) => b.position === 'horizontal')
                  .map((banner) => (
                    <VisualBannerItem
                      key={banner._id}
                      banner={banner}
                      className='w-full h-[120px]'
                    />
                  ))}
                <AddBannerPlaceholder
                  position='horizontal'
                  className='w-full h-[120px]'
                />
              </div>
            </div>
          </section>

          {/* SECTION 4: Thư viện ảnh Khách hàng */}
          <section>
            <h2 className='text-sm font-black uppercase text-slate-700 mb-4 tracking-tight flex items-center gap-2'>
              <span className='w-2 h-2 rounded-full bg-purple-500'></span>
              Thư viện ảnh Khách hàng
            </h2>
            <div className='bg-white p-3 rounded-2xl shadow-sm border border-slate-200'>
              <div className='text-[10px] font-bold text-slate-400 uppercase mb-2'>
                Vị trí: customer_gallery
              </div>
              <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 h-[120px]'>
                {banners
                  .filter((b) => b.position === 'customer_gallery')
                  .map((banner) => (
                    <VisualBannerItem
                      key={banner._id}
                      banner={banner}
                      className='h-full'
                    />
                  ))}
                <AddBannerPlaceholder position='customer_gallery' />
              </div>
            </div>
          </section>

          {/* SECTION 5: Logo Đối tác */}
          <section>
            <h2 className='text-sm font-black uppercase text-slate-700 mb-4 tracking-tight flex items-center gap-2'>
              <span className='w-2 h-2 rounded-full bg-amber-500'></span>
              Logo Đối tác Thương hiệu
            </h2>
            <div className='bg-white p-4 rounded-2xl shadow-sm border border-slate-200'>
              <div className='text-[10px] font-bold text-slate-400 uppercase mb-3'>
                Vị trí: partner_logos
              </div>
              <div className='flex flex-wrap gap-3'>
                {banners
                  .filter((b) => b.position === 'partner_logos')
                  .map((banner) => (
                    <div key={banner._id} className='w-28 h-12'>
                      <VisualBannerItem
                        banner={banner}
                        className='h-full w-full px-2 py-1 bg-white border-dashed'
                      />
                    </div>
                  ))}
                <div className='w-32 h-19'>
                  <AddBannerPlaceholder
                    position='partner_logos'
                    className='h-full min-h-0 flex-row gap-1 py-1'
                  />
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
