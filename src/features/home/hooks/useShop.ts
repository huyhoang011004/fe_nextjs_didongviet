import { useEffect, useState } from 'react';
import {
  fetchShopCategories,
  fetchShopProducts,
  fetchShopTradeIn,
  fetchShopBlogs,
  fetchShopFlashSale,
} from '@/features/home/actions/shop-actions';
import {
  filterIphoneProducts,
  filterSamsungProducts,
  filterOppoXiaomiProducts,
  filterIpadTabletProducts,
  filterMacbookLaptopProducts,
  filterUsedProducts,
  filterSmartwatchProducts,
  filterAccessoryProducts,
  filterAudioProducts,
  filterApplianceProducts,
} from '@/features/products/utils/product-filters';

export function useShop() {
  const [categories, setCategories] = useState<any[]>([]);
  const [tradeInProducts, setTradeInProducts] = useState<any[]>([]);
  const [flashSaleProducts, setFlashSaleProducts] = useState<any[]>([]);
  const [flashSaleCampaign, setFlashSaleCampaign] = useState<any>(null);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Tải dữ liệu từ backend
  useEffect(() => {
    async function loadHomepageData() {
      try {
        const [categoriesRes, productsRes, tradeInRes, blogsRes, flashSaleRes] =
          await Promise.all([
            fetchShopCategories(),
            fetchShopProducts(),
            fetchShopTradeIn(),
            fetchShopBlogs(),
            fetchShopFlashSale(),
          ]);

        if (categoriesRes && categoriesRes.success) {
          setCategories(categoriesRes.data || categoriesRes || []);
        }

        if (productsRes && productsRes.success) {
          const prods = productsRes.products || productsRes.data || [];
          setAllProducts(prods);
        }

        if (flashSaleRes && flashSaleRes.success && flashSaleRes.data) {
          setFlashSaleCampaign(flashSaleRes.data);
          setFlashSaleProducts(flashSaleRes.data.products || []);
        } else {
          setFlashSaleCampaign(null);
          setFlashSaleProducts([]);
        }

        if (tradeInRes && tradeInRes.success) {
          setTradeInProducts(tradeInRes.data || []);
        } else {
          // Fallback trade-in nếu trống
          const fallbackTrade = (
            productsRes?.products ||
            productsRes?.data ||
            []
          ).filter((p: any) => p.tradeInBonus > 0);
          setTradeInProducts(fallbackTrade);
        }

        if (blogsRes && blogsRes.success) {
          setBlogs(blogsRes.data || []);
        }
      } catch (err) {
        console.error('Failed to load shop homepage data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadHomepageData();
  }, []);

  // PHÂN LOẠI SẢN PHẨM THEO DANH MỤC & THƯƠNG HIỆU
  const iphoneProducts = filterIphoneProducts(allProducts);
  const samsungProducts = filterSamsungProducts(allProducts);
  const oppoXiaomiProducts = filterOppoXiaomiProducts(allProducts);
  const ipadTabletProducts = filterIpadTabletProducts(allProducts);
  const macbookLaptopProducts = filterMacbookLaptopProducts(allProducts);
  const usedProducts = filterUsedProducts(allProducts);
  const smartwatchProducts = filterSmartwatchProducts(allProducts);
  const accessoryProducts = filterAccessoryProducts(allProducts);
  const audioProducts = filterAudioProducts(allProducts);
  const applianceProducts = filterApplianceProducts(allProducts);

  // Hàm helper lấy dự phòng (fallback) để test nếu db chưa đủ sản phẩm lọc
  const getFallbackList = (list: any[]) => {
    return list.length > 0 ? list : allProducts.slice(0, 5);
  };

  return {
    categories,
    tradeInProducts,
    flashSaleProducts,
    flashSaleCampaign,
    allProducts,
    blogs,
    loading,
    iphoneProducts,
    samsungProducts,
    oppoXiaomiProducts,
    ipadTabletProducts,
    macbookLaptopProducts,
    usedProducts,
    smartwatchProducts,
    accessoryProducts,
    audioProducts,
    applianceProducts,
    getFallbackList,
  };
}
