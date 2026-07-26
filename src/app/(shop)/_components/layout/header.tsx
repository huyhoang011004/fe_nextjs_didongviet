'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Phone,
  FileSearchCorner,
  ShieldCheck,
  BadgeDollarSign,
  RefreshCw,
  BookOpen,
} from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

import HeaderSearch from './HeaderSearch';
import { HeaderCategoriesDropdown } from './HeaderCategoriesDropdown';
import { HeaderCartDropdown } from './HeaderCartDropdown';
import { HeaderUserDropdown } from './HeaderUserDropdown';

import { useCartStore } from '@/app/(shop)/cart/useCartStore';
import { useHeaderScroll } from '@/hooks/useHeaderScroll';

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
}

export default function Header() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  // States to control dropdowns externally so we can close them on scroll
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);

  const handleScrollHide = useCallback(() => {
    setIsCategoryOpen(false);
    setIsCartOpen(false);
    setIsUserOpen(false);
  }, []);

  const { isHeaderVisible } = useHeaderScroll(80, handleScrollHide);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const resData = await res.json();
          if (resData.success && resData.data && resData.data.user) {
            setUser(resData.data.user);
          }
        }
      } catch (err) {
        console.error('Failed to load user profile in header:', err);
      } finally {
        if (loading) setLoading(false);
      }
    }

    async function fetchCategories() {
      try {
        const apiUrl =
          (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000') + '/api/v1';
        const res = await fetch(`${apiUrl}/categories`);
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setCategories(data.data || []);
          }
        }
      } catch (err) {
        console.error('Failed to load categories in header:', err);
      }
    }

    fetchProfile();
    fetchCategories();
    useCartStore.getState().fetchCart();
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (res.ok) {
        setUser(null);
        window.location.href = '/login';
      }
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <header className='fixed top-0 z-50 w-full bg-primary text-white shadow-sm'>
      <div className='max-w-[1400px] mx-auto px-[30px] py-1.5 md:py-2'>
        <div className='flex flex-col gap-1.5 md:gap-2'>
          <div
            className={`
              flex items-center justify-between gap-4 md:gap-8 w-full min-w-0 
              transition-all duration-300 ease-in-out border-b border-white/10
              ${
                isHeaderVisible
                  ? 'max-h-[35px] opacity-100 py-0.5 md:py-1'
                  : 'max-h-0 opacity-0 py-0 pointer-events-none overflow-hidden border-none'
              }
            `}
          >
            <div className='overflow-hidden min-w-0 flex-1'>
              <div className='inline-flex min-w-full items-center gap-8 animate-marquee whitespace-nowrap'>
                <div className='flex items-center gap-2'>
                  <RefreshCw size={14} className='text-white ' />
                  <span className='text-xs md:text-sm'>
                    Thu cũ đổi mới - Lên đời siêu tốc
                  </span>
                </div>
                <div className='flex items-center gap-2'>
                  <BadgeDollarSign size={14} className='text-white ' />
                  <span className='text-xs md:text-sm'>
                    Trả góp 0% - Giao hàng miễn phí
                  </span>
                </div>
                <div className='flex items-center gap-2'>
                  <ShieldCheck size={14} className='text-white ' />
                  <span className='text-xs md:text-sm'>
                    BH 12 tháng - 1 đổi 1 trong 30 ngày
                  </span>
                </div>
              </div>
            </div>

            <div className='flex items-center gap-3'>
              <Label
                asChild
                className='flex items-center gap-1 text-xs md:text-sm cursor-pointer'
              >
                <Link href='/track' className='flex items-center gap-1'>
                  <FileSearchCorner size={16} />
                  <span className='hidden whitespace-nowrap md:inline'>
                    Tra cứu đơn hàng
                  </span>
                </Link>
              </Label>
              <Label
                asChild
                className='flex items-center gap-1 text-xs md:text-sm cursor-pointer'
              >
                <Link href='/contact' className='flex items-center gap-1'>
                  <Phone size={16} />
                  <span className='hidden whitespace-nowrap md:inline'>
                    Liên hệ
                  </span>
                </Link>
              </Label>
            </div>
          </div>

          {/* Phần chính chứa Logo, Search, Giỏ hàng... */}
          <div className='flex flex-row items-center justify-between gap-2 sm:gap-3 md:gap-4'>
            <Link
              href='/'
              className='flex flex-row sm:flex-row sm:items-center gap-1 md:gap-2 text-white min-w-0 '
            >
              <div className='text-md md:text-2xl font-black tracking-tighter whitespace-nowrap'>
                Di Động
              </div>
              <div className='text-xs md:text-sm font-semibold uppercase tracking-[0.18em] text-white/90'>
                VIỆT
              </div>
            </Link>

            <div className='flex items-center gap-2'>
              <HeaderCategoriesDropdown 
                categories={categories} 
                isExternalDropdownOpen={isCategoryOpen}
                onExternalDropdownChange={setIsCategoryOpen}
              />
              <Button
                asChild
                variant='header'
                size='header-responsive'
                className='h-9'
              >
                <Link
                  href='/blogs'
                  className='flex items-center justify-center gap-1 md:gap-2 text-amber-400 hover:text-amber-300'
                >
                  <BookOpen size={16} />
                  <span className='hidden md:inline text-xs md:text-sm'>
                    Tin tức
                  </span>
                </Link>
              </Button>
            </div>

            <div className='flex-1 max-w-xl h-9'>
              <HeaderSearch />
            </div>

            <div className='flex items-center gap-2'>
              <HeaderCartDropdown 
                mounted={mounted} 
                isExternalDropdownOpen={isCartOpen}
                onExternalDropdownChange={setIsCartOpen}
              />
              <HeaderUserDropdown 
                user={user} 
                loading={loading} 
                onLogout={handleLogout} 
                isExternalDropdownOpen={isUserOpen}
                onExternalDropdownChange={setIsUserOpen}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
