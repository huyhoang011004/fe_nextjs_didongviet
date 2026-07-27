'use client';

import Link from 'next/link';
import { BiCategory } from 'react-icons/bi';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from '@/components/ui/dropdown-menu';
import { useHoverDelay } from '@/hooks/useHoverDelay';

interface HeaderCategoriesDropdownProps {
  categories: any[];
  isExternalDropdownOpen?: boolean;
  onExternalDropdownChange?: (open: boolean) => void;
}

export function HeaderCategoriesDropdown({
  categories,
  isExternalDropdownOpen,
  onExternalDropdownChange,
}: HeaderCategoriesDropdownProps) {
  const { isOpen, setIsOpen, handleMouseEnter, handleMouseLeave } = useHoverDelay(0, 500);

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
            variant='header'
            size='header-responsive'
            className='cursor-pointer h-9'
          >
            <div className='flex items-center justify-center gap-1 md:gap-2'>
              <BiCategory size={16} />
              <span className='hidden md:inline text-xs md:text-sm'>
                Danh mục
              </span>
            </div>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align='start'
          sideOffset={6}
          className='w-64 bg-white text-slate-800 border border-slate-200 rounded-xl shadow-xl p-1 z-50 overflow-visible'
        >
          {categories.map((cat: any) => (
            <div key={cat._id}>
              {cat.children && cat.children.length > 0 ? (
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger
                    asChild
                    className='cursor-pointer'
                  >
                    <Link
                      href={`/${cat.slug}`}
                      className='flex w-full items-center justify-between px-4 py-2.5 text-xs font-bold hover:bg-red-50 hover:text-didongviet-red rounded-lg transition-colors'
                    >
                      <span>{cat.name}</span>
                      <ChevronRight
                        size={12}
                        className='text-slate-400 ml-auto'
                      />
                    </Link>
                  </DropdownMenuSubTrigger>

                  <DropdownMenuSubContent className='w-56 bg-white text-slate-800 border border-slate-200 rounded-xl shadow-xl p-1 z-50 ml-1'>
                    {cat.children.map((child: any) => (
                      <DropdownMenuItem key={child._id} asChild>
                        <Link
                          href={`/${child.slug}`}
                          className='block w-full px-4 py-2.5 text-xs font-semibold hover:bg-red-50 hover:text-didongviet-red rounded-lg transition-colors cursor-pointer'
                        >
                          {child.name}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              ) : (
                <DropdownMenuItem asChild>
                  <Link
                    href={`/${cat.slug}`}
                    className='block w-full px-4 py-2.5 text-xs font-bold hover:bg-red-50 hover:text-didongviet-red rounded-lg transition-colors cursor-pointer'
                  >
                    {cat.name}
                  </Link>
                </DropdownMenuItem>
              )}
            </div>
          ))}
          {categories.length === 0 && (
            <div className='px-4 py-3 text-xs text-slate-400 text-center italic'>
              Đang tải danh mục...
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
