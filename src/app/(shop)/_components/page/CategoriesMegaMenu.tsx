import Link from 'next/link';
import { fallbackBrands, fallbackHotSeries } from '@/constants/category-menu';

interface CategoriesMegaMenuProps {
  activeMenu: any;
  categories: any[];
  allProducts: any[];
}

export function CategoriesMegaMenu({
  activeMenu,
  categories,
  allProducts,
}: CategoriesMegaMenuProps) {
  if (!activeMenu || activeMenu.isStatic) return null;

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

  return (
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
          {getBrands(activeMenu).map((brand: string, bIdx: number) => (
            <Link
              key={bIdx}
              href={`/${activeMenu.slug}?brand=${brand}`}
              className='hover:text-didongviet-red transition-colors'
            >
              {brand}
            </Link>
          ))}
        </div>
      </div>

      {/* Cột 2: Dòng sản phẩm HOT */}
      <div className='w-1/3 border-r border-slate-100 pr-4 flex flex-col'>
        <span className='text-xs font-black text-slate-800 uppercase tracking-wider mb-4'>
          Dòng sản phẩm HOT
        </span>
        <div className='flex flex-col gap-2.5 text-xs font-semibold text-slate-600'>
          {getHotSeries(activeMenu).map((series: string, sIdx: number) => (
            <Link
              key={sIdx}
              href={`/${activeMenu.slug}`}
              className='hover:text-didongviet-red transition-colors'
            >
              {series}
            </Link>
          ))}
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
                p.variants?.[0]?.salePrice || p.variants?.[0]?.price || 0;
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
  );
}
