'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ChevronLeft,
  ChevronRight,
  ChevronRight as ChevronRightIcon,
  Award,
  Truck,
  RotateCw,
  UserCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { sidebarMenuItems } from '@/constants/category-menu';
import { CategoriesMegaMenu } from './CategoriesMegaMenu';

interface HeroSectionProps {
  categories?: any[];
  allProducts?: any[];
}



export default function HeroSection({
  categories = [],
  allProducts = [],
}: HeroSectionProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentRightSlide, setCurrentRightSlide] = useState(0);
  const [activeMenu, setActiveMenu] = useState<any | null>(null);



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
            <CategoriesMegaMenu 
              activeMenu={activeMenu} 
              categories={categories} 
              allProducts={allProducts} 
            />
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
