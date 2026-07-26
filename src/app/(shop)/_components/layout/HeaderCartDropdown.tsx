'use client';

import Link from 'next/link';
import { ShoppingCart, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from '@/components/ui/dropdown-menu';
import { useCartStore } from '@/app/(shop)/cart/useCartStore';
import { useHoverDelay } from '@/hooks/useHoverDelay';

interface HeaderCartDropdownProps {
  mounted: boolean;
  isExternalDropdownOpen?: boolean;
  onExternalDropdownChange?: (open: boolean) => void;
}

export function HeaderCartDropdown({
  mounted,
  isExternalDropdownOpen,
  onExternalDropdownChange,
}: HeaderCartDropdownProps) {
  const totalCartItems = useCartStore((state) => state.getTotalItems());
  const cartItems = useCartStore((state) => state.items);
  const removeCartItem = useCartStore((state) => state.removeItem);
  const cartTotalPrice = useCartStore((state) => state.getTotalPrice());

  const { isOpen, setIsOpen, handleMouseEnter, handleMouseLeave } = useHoverDelay(0, 300);

  const isDropdownOpen = isExternalDropdownOpen !== undefined ? isExternalDropdownOpen : isOpen;
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (onExternalDropdownChange) onExternalDropdownChange(open);
  };

  return (
    <div
      className='relative'
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <DropdownMenu
        open={isDropdownOpen}
        onOpenChange={handleOpenChange}
      >
        <DropdownMenuTrigger asChild>
          <Button
            asChild
            variant='header'
            size='header-responsive'
            className='relative h-9 cursor-pointer'
          >
            <Link
              href='/cart'
              className='flex items-center justify-center gap-1 md:gap-2'
            >
              <ShoppingCart size={16} />
              <span className='hidden md:inline text-xs md:text-sm'>
                Giỏ hàng
              </span>
              {mounted && totalCartItems > 0 && (
                <span className='absolute -top-1.5 -right-1.5 bg-yellow-400 text-slate-900 text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center shadow-sm'>
                  {totalCartItems}
                </span>
              )}
            </Link>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align='end'
          sideOffset={6}
          className='w-[360px] bg-white text-slate-800 border border-slate-200 rounded-xl shadow-xl p-0 z-50 overflow-hidden'
        >
          <div className='p-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50'>
            <span className='text-xs font-bold text-slate-800 uppercase tracking-wider'>
              Giỏ hàng của tôi ({cartItems.length} sản phẩm)
            </span>
            <Link
              href='/cart'
              className='text-[11px] font-bold text-didongviet-red hover:underline'
            >
              Xem tất cả
            </Link>
          </div>

          {cartItems.length === 0 ? (
            <div className='p-6 text-center flex flex-col items-center justify-center gap-2'>
              <ShoppingCart size={36} className='text-slate-300' />
              <p className='text-xs text-slate-400 font-bold'>
                Giỏ hàng của bạn còn trống
              </p>
            </div>
          ) : (
            <>
              <div className='max-h-[280px] overflow-y-auto divide-y divide-slate-100 no-scrollbar'>
                {cartItems.slice(0, 5).map((item) => (
                  <div
                    key={`${item.product}-${item.variant}`}
                    className='p-3 flex gap-3 hover:bg-slate-50/40 transition-colors group'
                  >
                    <Link
                      href={`/${item.categorySlug || 'dien-thoai'}/${item.slug}`}
                      className='w-12 h-12 rounded-lg border border-slate-100 bg-slate-50 overflow-hidden flex items-center justify-center p-1 shrink-0'
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className='w-full h-full object-contain'
                        referrerPolicy='no-referrer'
                      />
                    </Link>

                    <div className='flex-1 min-w-0 space-y-0.5'>
                      <Link
                        href={`/${item.categorySlug || 'dien-thoai'}/${item.slug}`}
                        className='block text-[11px] font-bold text-slate-800 hover:text-didongviet-red transition-colors truncate'
                      >
                        {item.name}
                      </Link>
                      <span className='block text-[9px] text-slate-400 font-semibold'>
                        Phân loại: {item.selectedColor || 'Mặc định'}
                        {item.selectedStorage ? ` - ${item.selectedStorage}` : ''}
                      </span>
                      <div className='flex items-center justify-between mt-1'>
                        <span className='text-[10px] text-slate-405 font-medium'>
                          SL: {item.quantity}
                        </span>
                        <span className='text-[11px] font-bold text-didongviet-red'>
                          {((item.salePrice || item.price) * item.quantity).toLocaleString('vi-VN')}đ
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => removeCartItem(item.product, item.variant)}
                      className='h-6 w-6 rounded-md border border-slate-100 bg-white flex items-center justify-center text-slate-400 hover:text-didongviet-red hover:border-red-200 hover:bg-red-50 cursor-pointer transition-all opacity-0 group-hover:opacity-100 self-center'
                      title='Xóa sản phẩm'
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                ))}
              </div>

              {cartItems.length > 5 && (
                <div className='px-4 py-1.5 bg-red-50/20 border-t border-slate-100 text-center text-[10px] font-semibold text-slate-500'>
                  Còn {cartItems.length - 5} sản phẩm khác trong giỏ hàng
                </div>
              )}

              <div className='p-3 bg-slate-50/80 border-t border-slate-100 space-y-2.5'>
                <div className='flex items-center justify-between text-xs'>
                  <span className='font-semibold text-slate-500'>
                    Tổng tiền tạm tính:
                  </span>
                  <span className='font-black text-sm text-didongviet-red'>
                    {cartTotalPrice.toLocaleString('vi-VN')}đ
                  </span>
                </div>

                <div className='grid grid-cols-2 gap-2'>
                  <Button
                    asChild
                    variant='outline'
                    size='sm'
                    className='w-full text-xs font-bold py-1.5 h-auto rounded-lg cursor-pointer border-slate-200 hover:bg-slate-100'
                  >
                    <Link href='/cart'>Vào giỏ hàng</Link>
                  </Button>
                  <Button
                    asChild
                    size='sm'
                    className='w-full bg-didongviet-red hover:bg-red-700 text-white font-bold text-xs rounded-lg py-1.5 h-auto transition-all cursor-pointer border-none shadow-sm'
                  >
                    <Link href='/checkout'>Thanh toán</Link>
                  </Button>
                </div>
              </div>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
