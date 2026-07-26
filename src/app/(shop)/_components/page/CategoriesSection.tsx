'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Truck,
  RotateCw,
  Award,
  UserCheck,
  Smartphone,
  Tablet,
  Laptop,
  Tv,
  Headphones,
  Zap,
  Flame,
  Watch,
  Newspaper,
  ChevronRight as ChevronRightIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeroSectionProps {
  categories?: any[];
  allProducts?: any[];
}

const fallbackBrands: Record<string, string[]> = {
  'dien-thoai': [
    'Apple',
    'Samsung',
    'Xiaomi',
    'OPPO',
    'realme',
    'Honor',
    'Vertu',
    'TECNO',
  ],
  'ipad-tablet': ['Apple', 'Samsung', 'Xiaomi', 'Lenovo', 'Huawei'],
  'macbook-laptop': ['Apple', 'Asus', 'HP', 'Lenovo', 'Dell', 'Acer', 'MSI'],
  smartwatch: ['Apple', 'Samsung', 'Huawei', 'Xiaomi', 'Garmin'],
  'phu-kien': [
    'Anker',
    'Apple',
    'Baseus',
    'JBL',
    'Sony',
    'Innostyle',
    'Spigen',
    'UAG',
  ],
  'thiet-bi-am-thanh': [
    'JBL',
    'Marshall',
    'Sony',
    'Apple',
    'Anker',
    'Harman Kardon',
  ],
  'may-cu-gia-re': ['Apple', 'Samsung', 'Xiaomi', 'Oppo'],
  'gia-dung': ['Xiaomi', 'Deerma', 'Philips', 'Bear', 'Tefal'],
  'thu-cu-doi-moi-trade-in': ['Apple', 'Samsung', 'Xiaomi', 'OPPO'],
};

const fallbackHotSeries: Record<string, string[]> = {
  'dien-thoai': [
    'iPhone 16 Series',
    'iPhone 15 Series',
    'Galaxy S25 Series',
    'Galaxy Z Flip7',
    'Xiaomi 15T Pro',
    'Redmi Note 14',
    'OPPO Reno14',
    'OPPO A6 Pro',
  ],
  'ipad-tablet': [
    'iPad Pro M4',
    'iPad Air M2',
    'iPad Gen 10',
    'Galaxy Tab S10 Ultra',
    'Galaxy Tab S9 FE',
    'Galaxy Tab A9+',
  ],
  'macbook-laptop': [
    'MacBook Pro M3',
    'MacBook Air M3',
    'Asus ROG Gaming',
    'Asus Zenbook',
    'HP Pavilion',
    'Dell Inspiron',
    'Lenovo ThinkPad',
  ],
  smartwatch: [
    'Apple Watch Ultra 2',
    'Apple Watch Series 10',
    'Apple Watch SE',
    'Galaxy Watch Ultra',
    'Galaxy Watch7',
    'Huawei Watch GT5',
  ],
  'phu-kien': [
    'Sạc nhanh GaN 65W',
    'Cáp sạc chống đứt',
    'Ốp lưng UAG cao cấp',
    'Kính cường lực Kingbull',
    'Giá đỡ điện thoại',
  ],
  'thiet-bi-am-thanh': [
    'AirPods Pro 2',
    'JBL Tour Pro 2',
    'Loa Bluetooth JBL Go 4',
    'Loa Marshall Acton III',
    'Sony WH-1000XM5',
  ],
  'may-cu-gia-re': [
    'iPhone 15 Pro Max cũ',
    'iPhone 14 Pro Max cũ',
    'iPhone 13 Pro Max cũ',
    'Galaxy S24 Ultra cũ',
    'iPad Pro cũ',
  ],
  'gia-dung': [
    'Robot hút bụi Xiaomi',
    'Máy lọc không khí Xiaomi',
    'Nồi chiên không dầu',
    'Máy tăm nước',
    'Ấm siêu tốc',
  ],
  'thu-cu-doi-moi-trade-in': [
    'Thu cũ iPhone 16 Pro Max',
    'Thu cũ iPhone 15 Pro Max',
    'Thu cũ Galaxy S24 Ultra',
    'Thu cũ iPhone 14 Pro Max',
  ],
};

export default function HeroSection({
  categories = [],
  allProducts = [],
}: HeroSectionProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentRightSlide, setCurrentRightSlide] = useState(0);
  const [activeMenu, setActiveMenu] = useState<any | null>(null);

  const sidebarMenuItems = [
    {
      name: 'Điện thoại di động',
      slug: 'dien-thoai',
      dbSlug: 'dien-thoai',
      icon: Smartphone,
    },
    {
      name: 'iPad & Tablet',
      slug: 'ipad-tablet',
      dbSlug: 'ipad-tablet',
      icon: Tablet,
    },
    {
      name: 'MacBook & Laptop',
      slug: 'macbook-laptop',
      dbSlug: 'macbook-laptop',
      icon: Laptop,
    },
    {
      name: 'Máy cũ giá rẻ',
      slug: 'may-cu-gia-re',
      dbSlug: 'may-cu-gia-re',
      icon: RotateCw,
    },
    {
      name: 'Phụ kiện công nghệ',
      slug: 'phu-kien',
      dbSlug: 'phu-kien',
      icon: Headphones,
    },
    {
      name: 'Đồng hồ thông minh',
      slug: 'smartwatch',
      dbSlug: 'smartwatch',
      icon: Watch,
    },
    {
      name: 'Âm thanh',
      slug: 'am-thanh',
      dbSlug: 'thiet-bi-am-thanh',
      icon: Headphones,
    },
    {
      name: 'Điện máy, Gia dụng',
      slug: 'gia-dung',
      dbSlug: 'gia-dung',
      icon: Tv,
    },
    {
      name: 'Thu cũ đổi mới',
      slug: 'trade-in',
      dbSlug: 'thu-cu-doi-moi-trade-in',
      icon: RotateCw,
    },
    {
      name: 'Voucher khuyến mãi',
      slug: 'vouchers',
      isStatic: true,
      icon: Zap,
      link: '/vouchers',
    },
    {
      name: 'Tin tức công nghệ',
      slug: 'blogs',
      isStatic: true,
      icon: Newspaper,
      link: '/blogs',
    },
  ];

  // Helper lấy thương hiệu
  const getBrands = (item: any) => {
    const cat = categories.find((c: any) => c.slug === item.dbSlug);
    if (cat?.brands && cat.brands.length > 0) {
      return cat.brands;
    }
    return fallbackBrands[item.dbSlug || ''] || [];
  };

  // Helper lấy dòng sản phẩm HOT
  const getHotSeries = (item: any) => {
    const cat = categories.find((c: any) => c.slug === item.dbSlug);
    let series: string[] = [];
    if (cat?.children && cat.children.length > 0) {
      series = cat.children.map((child: any) => child.name);
    }
    if (series.length < 3) {
      series = fallbackHotSeries[item.dbSlug || ''] || [];
    }
    return series;
  };

  // Helper lấy sản phẩm giá sốc
  const getShockProducts = (item: any) => {
    if (item.isStatic) return [];

    let matched = [];

    if (item.brandFilter) {
      matched = allProducts.filter(
        (p: any) => p.brand?.toLowerCase() === item.brandFilter.toLowerCase(),
      );
    } else if (item.slug === 'trade-in') {
      matched = allProducts.filter((p: any) => p.tradeInBonus > 0);
    } else {
      const cat = categories.find((c: any) => c.slug === item.dbSlug);

      const getSubCategorySlugs = (category: any): string[] => {
        let slugs = [category.slug];
        if (category.children && category.children.length > 0) {
          category.children.forEach((child: any) => {
            slugs = [...slugs, ...getSubCategorySlugs(child)];
          });
        }
        return slugs;
      };

      const allowedSlugs = cat ? getSubCategorySlugs(cat) : [item.dbSlug || ''];

      matched = allProducts.filter((p: any) => {
        if (!p.category) return false;
        const pCatSlug =
          typeof p.category === 'object' ? p.category.slug : null;
        const pCatId =
          typeof p.category === 'object' ? p.category._id : p.category;

        if (pCatSlug) {
          return allowedSlugs.includes(pCatSlug);
        }
        if (cat && pCatId === cat._id) return true;
        if (cat?.children) {
          return cat.children.some((child: any) => child._id === pCatId);
        }
        return false;
      });
    }

    return matched.slice(0, 5);
  };

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    })
      .format(value)
      .replace('₫', 'đ');
  };

  const [banners, setBanners] = useState<any[]>([]);
  const [rightBanners, setRightBanners] = useState<any[]>([]);

  useEffect(() => {
    async function loadBanners() {
      const { fetchShopBanners } = await import('@/app/(shop)/shop-actions');
      const resCarousel = await fetchShopBanners('carousel');
      if (resCarousel?.data) setBanners(resCarousel.data);
      
      const resRight = await fetchShopBanners('right');
      if (resRight?.data) setRightBanners(resRight.data);
    }
    loadBanners();
  }, []);

  // Tự động xoay banner sau 5s
  useEffect(() => {
    if (banners.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % banners.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [banners.length]);

  useEffect(() => {
    if (rightBanners.length > 0) {
      const timer2 = setInterval(() => {
        setCurrentRightSlide((prev) => (prev + 1) % rightBanners.length);
      }, 5000);
      return () => clearInterval(timer2);
    }
  }, [rightBanners.length]);

  return (
    <>
      {/* ─── HERO SLIDER & QUICK INFO ─── */}
      <section className='bg-white border-b border-slate-100'>
        <div className='max-w-[1400px] mx-auto px-[30px] py-5 grid grid-cols-1 lg:grid-cols-5 gap-4'>
          {/* CỘT TRÁI: SIDEBAR CATEGORY MENU (Ẩn trên mobile) */}
          <div
            className='hidden lg:block lg:col-span-1 border border-slate-100 rounded-2xl p-2.5 bg-slate-50/20 relative lg:h-[400px]'
            onMouseLeave={() => setActiveMenu(null)}
          >
            <nav className='h-full flex flex-col justify-between'>
              {sidebarMenuItems.map((item, idx) => {
                const Icon = item.icon;
                const isHovered = activeMenu?.slug === item.slug;
                return (
                  <div
                    key={idx}
                    onMouseEnter={() => {
                      if (!item.isStatic) {
                        setActiveMenu(item);
                      } else {
                        setActiveMenu(null);
                      }
                    }}
                    className='relative'
                  >
                    <Link
                      href={
                        item.isStatic
                          ? item.link || `/${item.slug}`
                          : `/${item.slug}`
                      }
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                        isHovered
                          ? 'bg-red-50 text-didongviet-red'
                          : 'text-slate-700 hover:bg-red-50 hover:text-didongviet-red'
                      }`}
                    >
                      <div className='flex items-center gap-3.5'>
                        <Icon
                          size={16}
                          className={`transition-colors ${isHovered ? 'text-didongviet-red' : 'text-slate-400 group-hover:text-didongviet-red'}`}
                        />
                        <span>{item.name}</span>
                      </div>
                      <div className='flex items-center gap-1.5'>
                        <ChevronRightIcon
                          size={11}
                          className={`transition-transform ${isHovered ? 'text-didongviet-red translate-x-0.5' : 'text-slate-300 group-hover:text-didongviet-red group-hover:translate-x-0.5'}`}
                        />
                      </div>
                    </Link>
                  </div>
                );
              })}
            </nav>

            {/* FLYOUT MEGA MENU */}
            {activeMenu && (
              <div
                className='absolute left-full top-0 ml-4 w-[850px] bg-white border border-slate-100 rounded-2xl shadow-xl p-6 z-50 flex gap-6'
                style={{ minHeight: '100%', height: 'fit-content' }}
              >
                {/* Cột 1: Thương hiệu */}
                <div className='w-1/4 border-r border-slate-100 pr-4 flex flex-col'>
                  <span className='text-xs font-black text-slate-800 uppercase tracking-wider mb-4'>
                    Thương hiệu
                  </span>
                  <div className='grid grid-cols-2 gap-x-4 gap-y-2.5 text-xs font-semibold text-slate-600'>
                    {getBrands(activeMenu).map(
                      (brand: string, bIdx: number) => (
                        <Link
                          key={bIdx}
                          href={`/${activeMenu.slug}?brand=${brand}`}
                          className='hover:text-didongviet-red transition-colors'
                        >
                          {brand}
                        </Link>
                      ),
                    )}
                  </div>
                </div>

                {/* Cột 2: Dòng sản phẩm HOT */}
                <div className='w-1/3 border-r border-slate-100 pr-4 flex flex-col'>
                  <span className='text-xs font-black text-slate-800 uppercase tracking-wider mb-4'>
                    Dòng sản phẩm HOT
                  </span>
                  <div className='flex flex-col gap-2.5 text-xs font-semibold text-slate-600'>
                    {getHotSeries(activeMenu).map(
                      (series: string, sIdx: number) => (
                        <Link
                          key={sIdx}
                          href={`/${activeMenu.slug}`}
                          className='hover:text-didongviet-red transition-colors'
                        >
                          {series}
                        </Link>
                      ),
                    )}
                  </div>
                </div>

                {/* Cột 3: Sản phẩm giá sốc */}
                <div className='w-5/12 flex flex-col justify-between'>
                  <div>
                    <span className='text-xs font-black text-slate-800 uppercase tracking-wider mb-4 block'>
                      Sản phẩm giá sốc
                    </span>
                    <div className='space-y-3'>
                      {getShockProducts(activeMenu).map((p: any) => {
                        const image =
                          p.images?.[0]?.url ||
                          p.variants?.[0]?.variantImage ||
                          'https://via.placeholder.com/150';
                        const price =
                          p.variants?.[0]?.salePrice ||
                          p.variants?.[0]?.price ||
                          0;
                        return (
                          <Link
                            key={p._id}
                            href={`/${activeMenu.slug}/${p.slug}`}
                            className='flex items-center gap-3 group/prod'
                          >
                            <img
                              src={image}
                              alt={p.name}
                              className='h-12 w-12 object-contain rounded-md border border-slate-100 p-0.5 group-hover/prod:scale-105 transition-transform'
                            />
                            <div className='flex flex-col justify-center min-w-0'>
                              <span className='text-[11px] font-bold text-slate-700 group-hover/prod:text-didongviet-red line-clamp-1 leading-snug'>
                                {p.name}
                              </span>
                              <span className='text-xs font-extrabold text-didongviet-red mt-0.5'>
                                {formatPrice(price)}
                              </span>
                            </div>
                          </Link>
                        );
                      })}
                      {getShockProducts(activeMenu).length === 0 && (
                        <p className='text-xs italic text-slate-400'>
                          Không có sản phẩm giá sốc nào
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CỘT GIỮA: BANNER CAROUSEL */}
          <div className='lg:col-span-3 relative h-[220px] sm:h-[280px] md:h-[340px] lg:h-[400px] rounded-2xl overflow-hidden shadow-sm border border-slate-100 group'>
            {banners.map((b, idx) => (
              <Link
                key={b.id}
                href={b.link}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
              >
                <img
                  src={b.imageUrl || b.image}
                  alt={b.title || 'Promo Banner'}
                  className='w-full h-full object-fill'
                />
              </Link>
            ))}

            {/* Nav arrows */}
            <button
              onClick={() =>
                setCurrentSlide(
                  (prev) => (prev - 1 + banners.length) % banners.length,
                )
              }
              className='absolute left-3 top-1/2 -translate-y-1/2 z-20 h-8 w-8 rounded-full bg-black/30 hover:bg-black/60 text-white flex items-center justify-center border-none cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity'
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() =>
                setCurrentSlide((prev) => (prev + 1) % banners.length)
              }
              className='absolute right-3 top-1/2 -translate-y-1/2 z-20 h-8 w-8 rounded-full bg-black/30 hover:bg-black/60 text-white flex items-center justify-center border-none cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity'
            >
              <ChevronRight size={16} />
            </button>

            {/* Slide dots */}
            <div className='absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1.5'>
              {banners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-1.5 rounded-full border-none cursor-pointer transition-all ${idx === currentSlide ? 'w-5 bg-white' : 'w-1.5 bg-white/50'}`}
                />
              ))}
            </div>
          </div>

          {/* CỘT PHẢI: BANNER QUẢNG CÁO DẠNG CUỘN */}
          <div className='lg:col-span-1 relative h-[220px] sm:h-[280px] md:h-[340px] lg:h-[400px] rounded-2xl overflow-hidden shadow-sm border border-slate-100 group'>
            {rightBanners.map((b, idx) => (
              <Link
                key={b.id || idx}
                href={b.link || '#'}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${idx === currentRightSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
              >
                <img
                  src={b.imageUrl || b.image}
                  alt={b.title || 'Promo Banner'}
                  className='w-full h-full object-fill'
                />
              </Link>
            ))}

            {/* Nav arrows */}
            <button
              onClick={() =>
                setCurrentRightSlide(
                  (prev) => (prev - 1 + rightBanners.length) % rightBanners.length,
                )
              }
              className='absolute left-3 top-1/2 -translate-y-1/2 z-20 h-8 w-8 rounded-full bg-black/30 hover:bg-black/60 text-white flex items-center justify-center border-none cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity'
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() =>
                setCurrentRightSlide((prev) => (prev + 1) % rightBanners.length)
              }
              className='absolute right-3 top-1/2 -translate-y-1/2 z-20 h-8 w-8 rounded-full bg-black/30 hover:bg-black/60 text-white flex items-center justify-center border-none cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity'
            >
              <ChevronRight size={16} />
            </button>

            {/* Slide dots */}
            <div className='absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1.5'>
              {rightBanners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentRightSlide(idx)}
                  className={`h-1.5 rounded-full border-none cursor-pointer transition-all ${idx === currentRightSlide ? 'w-5 bg-white' : 'w-1.5 bg-white/50'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── CAM KẾT CHÍNH SÁCH ─── */}
      <section className='max-w-[1400px] mx-auto px-[30px] -mt-1 relative z-10'>
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-3 bg-white rounded-2xl p-4 border border-slate-100 shadow-xs'>
          {[
            {
              icon: Award,
              color: 'text-didongviet-red bg-red-50',
              title: '100% CHÍNH HÃNG',
              desc: 'Cam kết chính hãng toàn cầu',
            },
            {
              icon: RotateCw,
              color: 'text-blue-500 bg-blue-50',
              title: '1 ĐỔI 1 TRONG 30 NGÀY',
              desc: 'Nếu phát sinh lỗi NSX',
            },
            {
              icon: Truck,
              color: 'text-purple-600 bg-purple-50',
              title: 'GIAO HÀNG MIỄN PHÍ',
              desc: 'Free ship toàn quốc',
            },
            {
              icon: UserCheck,
              color: 'text-amber-600 bg-amber-50',
              title: 'CSKH TẬN TÂM',
              desc: 'Hỗ trợ kỹ thuật 24/7',
            },
          ].map((item, idx) => (
            <div key={idx} className='flex items-center gap-2.5 p-2'>
              <div
                className={`h-9 w-9 rounded-lg ${item.color} flex items-center justify-center flex-shrink-0`}
              >
                <item.icon size={18} />
              </div>
              <div>
                <span className='text-[10px] font-black text-slate-800 uppercase block leading-tight'>
                  {item.title}
                </span>
                <span className='text-[9px] text-gray-400 block'>
                  {item.desc}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
