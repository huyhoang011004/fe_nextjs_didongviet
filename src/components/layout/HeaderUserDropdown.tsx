'use client';

import Link from 'next/link';
import { User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { useHoverDelay } from '@/hooks/useHoverDelay';

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
}

interface HeaderUserDropdownProps {
  user: UserProfile | null;
  loading: boolean;
  onLogout: () => void;
  isExternalDropdownOpen?: boolean;
  onExternalDropdownChange?: (open: boolean) => void;
}

export function HeaderUserDropdown({ 
  user, 
  loading, 
  onLogout,
  isExternalDropdownOpen,
  onExternalDropdownChange
}: HeaderUserDropdownProps) {
  const { isOpen, setIsOpen, handleMouseEnter, handleMouseLeave } = useHoverDelay(0, 500);

  // Allow external control of the dropdown state (e.g. closing on scroll)
  const isDropdownOpen = isExternalDropdownOpen !== undefined ? isExternalDropdownOpen : isOpen;
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (onExternalDropdownChange) onExternalDropdownChange(open);
  };

  return (
    <div
      className='relative flex items-center gap-2'
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <DropdownMenu
        open={isDropdownOpen}
        onOpenChange={handleOpenChange}
      >
        <DropdownMenuTrigger asChild>
          {user ? (
            <Button
              variant='header'
              size='header-responsive'
              className='flex items-center gap-2 cursor-pointer h-9'
            >
              <User size={16} />
              <span className='hidden md:inline text-xs md:text-sm font-semibold max-w-[100px] truncate'>
                {user.name}
              </span>
            </Button>
          ) : (
            <Button
              variant='header'
              size='header-responsive'
              className='cursor-pointer h-9'
            >
              <div className='flex items-center justify-center gap-1 md:gap-2'>
                <User size={16} />
                <span className='hidden md:inline text-xs md:text-sm'>
                  {loading ? 'Đang tải...' : 'Đăng nhập'}
                </span>
              </div>
            </Button>
          )}
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align='end'
          sideOffset={6}
          className='w-52 bg-white text-gray-900 border border-gray-200 rounded-xl shadow-2xl p-0 z-50 overflow-hidden'
        >
          {loading ? (
            <div className='flex flex-col items-center justify-center py-6 px-4 gap-2'>
              <span className='h-6 w-6 animate-spin rounded-full border-2 border-red-600 border-t-transparent' />
              <p className='text-xs text-gray-500 font-medium animate-pulse'>
                Đang tải thông tin...
              </p>
            </div>
          ) : user ? (
            <>
              <div className='px-4 py-2.5 border-b border-gray-100 bg-gray-50/50 rounded-t-xl mb-1'>
                <p className='text-xs font-semibold text-gray-800 truncate mt-0.5'>
                  {user.name}
                </p>
                <p className='text-[11px] text-gray-500 truncate'>
                  {user.email}
                </p>
              </div>
              {(user.role === 'admin' || user.role === 'staff') && (
                <DropdownMenuItem asChild>
                  <Link
                    href='/admin'
                    className='flex w-full items-center px-4 py-2 text-xs text-gray-700 hover:bg-red-50 hover:text-red-600 font-medium transition-colors cursor-pointer'
                  >
                    Quản trị hệ thống
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem asChild>
                <Link
                  href='/profile/info'
                  className='flex w-full items-center px-4 py-2 text-xs text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer'
                >
                  Tài khoản của tôi
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href='/profile/orders'
                  className='flex w-full items-center px-4 py-2 text-xs text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer'
                >
                  Đơn mua
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <button
                  onClick={onLogout}
                  className='w-full text-left flex items-center px-4 py-2 text-xs text-red-600 hover:bg-red-50 font-semibold cursor-pointer border-t border-gray-100 mt-1.5 pt-2 transition-colors'
                >
                  Đăng xuất
                </button>
              </DropdownMenuItem>
            </>
          ) : (
            <div className='px-4 py-3 text-center flex flex-col gap-2.5'>
              <p className='text-[11px] text-gray-500 font-medium leading-relaxed'>
                Đăng nhập để nhận nhiều ưu đãi hấp dẫn & quản lý đơn
                hàng tốt hơn
              </p>
              <Button
                asChild
                size='sm'
                className='w-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg py-1.5 h-auto transition-all shadow-md shadow-red-100 hover:shadow-red-200 cursor-pointer'
              >
                <Link href='/login'>Đăng nhập</Link>
              </Button>
              <div className='text-[11px] text-gray-400 mt-0.5'>
                Khách hàng mới?{' '}
                <Link
                  href='/login?tab=register'
                  className='text-red-600 hover:underline font-semibold'
                >
                  Đăng ký ngay
                </Link>
              </div>
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
