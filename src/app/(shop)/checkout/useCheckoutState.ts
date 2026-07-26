import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCartStore } from '@/app/(shop)/cart/useCartStore';
import {
  fetchVouchers,
  findVoucherByCode,
  calcVoucherValue,
  applyVoucherServer,
} from '../cart/cart-actions';
import { createMoMoPayment, createVNPayPayment, calculateShippingFee } from './checkout-actions';
import { VIETNAM_PROVINCES, getBranchRegion } from './_components/checkout-utils';

const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000') + '/api/v1';

export function useCheckoutState() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const buyNow = searchParams.get('buyNow') === 'true';
  const productId = searchParams.get('productId') || '';
  const variantId = searchParams.get('variantId') || '';
  const qty = parseInt(searchParams.get('qty') || '1', 10);

  const [buyNowItem, setBuyNowItem] = useState<any | null>(null);

  // Zustand Cart Store
  const allCartItems = useCartStore((state) => state.items);
  const selected = useCartStore((state) => state.selected);
  const removeItem = useCartStore((state) => state.removeItem);

  // Lọc lấy các sản phẩm đã chọn thanh toán hoặc dùng sản phẩm mua ngay trực tiếp
  const cartItems = buyNow
    ? (buyNowItem ? [buyNowItem] : [])
    : allCartItems.filter((item) =>
      selected.includes(`${item.product}|${item.variant}`)
    );

  const selectedTotalPrice = cartItems.reduce(
    (total, item) => total + (item.salePrice || item.price) * item.quantity,
    0
  );

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Form Địa chỉ nhận hàng
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [province, setProvince] = useState('Hồ Chí Minh');
  const [district, setDistrict] = useState('');
  const [ward, setWard] = useState('');
  const [streetAddress, setStreetAddress] = useState('');

  // Chi nhánh & Phương thức thanh toán
  const [branches, setBranches] = useState<any[]>([]);
  const [selectedBranchId, setSelectedBranchId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD'); // COD, MOMO, VNPAY

  // Voucher States
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [appliedVoucher, setAppliedVoucher] = useState<any | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [bestVoucherCode, setBestVoucherCode] = useState<string | null>(null);
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [voucherCode, setVoucherCode] = useState('');
  const [voucherLoading, setVoucherLoading] = useState(false);

  // Sổ địa chỉ ở Checkout States
  const [showAddressModal, setShowAddressModal] = useState(false);

  // Chi tiết sản phẩm để kiểm tra tồn kho tại các chi nhánh
  const [productDetails, setProductDetails] = useState<Record<string, any>>({});

  const [submitting, setSubmitting] = useState(false);
  const [isOrderCompleted, setIsOrderCompleted] = useState(false);
  const [shippingLoading, setShippingLoading] = useState(false);
  const [estimatedDelivery, setEstimatedDelivery] = useState('');
  const [alert, setAlert] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  // Load profile, chi nhánh và thông tin mua ngay trực tiếp
  useEffect(() => {
    async function loadData() {
      try {
        const [profileRes, branchesRes, vouchersRes, flashSaleRes] = await Promise.all([
          fetch('/api/auth/me').then((r) => r.json()),
          fetch(`${API_URL}/branches`).then((r) => r.json()),
          fetchVouchers(),
          fetch(`${API_URL}/flash-sales/current`, { cache: 'no-store' }).then((r) => r.json()).catch(() => null)
        ]);

        if (profileRes.success && profileRes.data) {
          const user = profileRes.data.user;
          setProfile(user);
          setFullName(user.name || '');
          setPhone(user.phone || '');

          const defaultAddress =
            user.address?.find((a: any) => a.isDefault) || user.address?.[0];
          if (defaultAddress) {
            setProvince(defaultAddress.province || 'Hồ Chí Minh');
            setDistrict(defaultAddress.district || '');
            setWard(defaultAddress.ward || '');
            setStreetAddress(defaultAddress.streetAddress || '');
          }
        } else {
          router.push('/login');
          return;
        }

        if (branchesRes && branchesRes.success) {
          const list = branchesRes.branches || branchesRes.data || [];
          setBranches(list);
          if (list.length > 0) {
            setSelectedBranchId(list[0]._id);
          }
        }

        if (vouchersRes) {
          setVouchers(vouchersRes);
        }

        // Tải thông tin sản phẩm mua ngay trực tiếp nếu có
        if (buyNow && productId) {
          const productRes = await fetch(`${API_URL}/products/${productId}`).then((r) => r.json());
          if (productRes && productRes.success && productRes.data) {
            const prod = productRes.data;
            const activeVariant = prod.variants?.find((v: any) => v._id === variantId) || prod.variants?.[0] || {};
            const rawThumb =
              activeVariant.variantImage ||
              prod.images?.find((img: any) => img.isThumbnail)?.url ||
              prod.images?.[0]?.url ||
              prod.imageUrl ||
              '/placeholder-product.png';

            let currentSalePrice = activeVariant.salePrice || activeVariant.price || prod.price || 0;

            // Cập nhật giá flash sale nếu có
            if (flashSaleRes?.success && flashSaleRes.data) {
              const fsProduct = flashSaleRes.data.products?.find((p: any) => 
                String(p.product?._id || p.product) === String(prod._id)
              );
              if (fsProduct && fsProduct.flashSalePrice) {
                currentSalePrice = fsProduct.flashSalePrice;
              }
            }

            const newItem = {
              product: prod._id,
              variant: activeVariant._id || 'default',
              name: prod.name,
              imageUrl: rawThumb.startsWith('http')
                ? rawThumb
                : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${rawThumb}`,
              quantity: qty,
              price: currentSalePrice,
              salePrice: currentSalePrice,
              selectedColor: activeVariant.color || '',
              selectedStorage: activeVariant.ram && activeVariant.rom
                ? `${activeVariant.ram}/${activeVariant.rom}`
                : activeVariant.storage || '',
              slug: prod.slug,
              categorySlug: prod.category?.slug || 'dien-thoai',
            };
            setBuyNowItem(newItem);
            setProductDetails((prev) => ({ ...prev, [prod._id]: prod }));
          } else {
            router.push('/cart');
          }
        }
      } catch (err) {
        console.error('Failed to load checkout data', err);
      } finally {
        setLoading(false);
      }
    }

    if (mounted) {
      loadData();
    }
  }, [router, mounted, buyNow, productId, variantId, qty]);

  // Tự động chuyển hướng về /cart nếu giỏ hàng thường trống (chỉ áp dụng khi không phải mua ngay)
  useEffect(() => {
    if (mounted && !loading && !buyNow && cartItems.length === 0 && !isOrderCompleted) {
      router.push('/cart');
    }
  }, [mounted, loading, buyNow, cartItems.length, isOrderCompleted, router]);

  // Tính chất tự động áp dụng và tính lại giá trị Voucher dựa trên các sản phẩm
  useEffect(() => {
    if (!vouchers || vouchers.length === 0) return;
    const total = selectedTotalPrice;

    const calcValue = (v: any) => {
      return calcVoucherValue(v, total);
    };

    const applicable = vouchers
      .map((v) => ({ ...v, _value: calcValue(v) }))
      .filter((v) => v._value !== null && v._value > 0)
      .sort((a, b) => b._value - a._value);

    if (applicable.length > 0) {
      const best = applicable[0];
      setBestVoucherCode(best.code);
      if (!appliedVoucher) {
        setAppliedVoucher(best);
        setDiscountAmount(best._value);
      } else {
        const currentVal = calcValue(appliedVoucher);
        if (currentVal === null || currentVal === 0) {
          setAppliedVoucher(best);
          setDiscountAmount(best._value);
        } else {
          setDiscountAmount(currentVal);
          if (currentVal < best._value) {
            setBestVoucherCode(best.code);
          }
        }
      }
    } else {
      setBestVoucherCode(null);
      setAppliedVoucher(null);
      setDiscountAmount(0);
    }
  }, [vouchers, selectedTotalPrice]);

  // Chuỗi serialized của danh sách ID sản phẩm duy nhất để dùng làm dependency cho useEffect
  const serializedProductIds = JSON.stringify(
    Array.from(new Set(cartItems.map((item) => item.product))).sort()
  );

  // Load chi tiết sản phẩm để lấy thông tin tồn kho
  useEffect(() => {
    if (cartItems.length === 0) return;

    async function loadProductDetails() {
      try {
        const uniqueIds = Array.from(new Set(cartItems.map((item) => item.product)));
        const detailsMap: Record<string, any> = {};

        await Promise.all(
          uniqueIds.map(async (id) => {
            const res = await fetch(`${API_URL}/products/${id}`).then((r) => r.json());
            if (res && res.success && res.data) {
              detailsMap[id] = res.data;
            }
          })
        );

        setProductDetails((prev) => ({ ...prev, ...detailsMap }));
      } catch (err) {
        console.error('Failed to load product details for branch stock check:', err);
      }
    }

    loadProductDetails();
  }, [serializedProductIds]);

  // Danh sách các voucher đủ điều kiện áp dụng
  const applicableVouchers = (vouchers || [])
    .map((v) => ({ ...v, _value: calcVoucherValue(v, selectedTotalPrice) }))
    .filter((v) => v._value !== null && v._value > 0)
    .sort((a, b) => b._value - a._value);

  // Tìm chi nhánh hiện tại đang chọn
  const selectedBranch = branches.find((b) => b._id === selectedBranchId);

  // Tính phí vận chuyển tự động qua GHN API
  const [shippingPrice, setShippingPrice] = useState(30000);
  const [recipientDistrictId, setRecipientDistrictId] = useState<number | undefined>(undefined);
  const [recipientWardCode, setRecipientWardCode] = useState<string | undefined>(undefined);

  // Lookup GHN district_id khi province/district thay đổi
  useEffect(() => {
    if (!province || !district) {
      setRecipientDistrictId(undefined);
      return;
    }
    let cancelled = false;
    async function lookupDistrict() {
      try {
        // Lấy danh sách tỉnh để tìm province_id
        const provRes = await fetch(`${API_URL}/ghn/provinces`).then(r => r.json());
        if (!provRes.success || !provRes.data) return;
        const matchedProv = provRes.data.find((p: any) =>
          p.provinceName === province || province.includes(p.provinceName)
        );
        if (!matchedProv) return;

        // Lấy danh sách quận/huyện
        const distRes = await fetch(`${API_URL}/ghn/districts`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ provinceId: matchedProv.provinceId }),
        }).then(r => r.json());
        if (!distRes.success || !distRes.data) return;

        const matchedDist = distRes.data.find((d: any) =>
          d.districtName === district || district.includes(d.districtName)
        );
        if (!cancelled && matchedDist) {
          setRecipientDistrictId(matchedDist.districtId as number);
        }
      } catch { /* ignore */ }
    }
    lookupDistrict();
    return () => { cancelled = true; };
  }, [province, district]);

  // Lookup GHN ward_code khi districtId/ward thay đổi
  useEffect(() => {
    if (!recipientDistrictId || !ward) {
      setRecipientWardCode(undefined);
      return;
    }
    let cancelled = false;
    async function lookupWard() {
      try {
        const wardRes = await fetch(`${API_URL}/ghn/wards`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ districtId: recipientDistrictId }),
        }).then(r => r.json());
        if (!wardRes.success || !wardRes.data) return;

        const matchedWard = wardRes.data.find((w: any) =>
          w.wardName === ward || ward.includes(w.wardName)
        );
        if (!cancelled && matchedWard) {
          setRecipientWardCode(matchedWard.wardCode as string);
        }
      } catch { /* ignore */ }
    }
    lookupWard();
    return () => { cancelled = true; };
  }, [recipientDistrictId, ward]);

  // Tính phí vận chuyển GHN
  useEffect(() => {
    // Đơn trên 2 triệu → miễn phí ship
    if (selectedTotalPrice > 2000000) {
      setShippingPrice(0);
      setEstimatedDelivery('');
      return;
    }

    // Chưa đủ thông tin → phí mặc định
    if (!selectedBranch || !recipientDistrictId || !recipientWardCode) {
      if (selectedBranch && !selectedBranch.ghnDistrictId) {
        // Fallback logic cũ
        const recipient = VIETNAM_PROVINCES.find((p) => p.name === province);
        const branchInfo = getBranchRegion(selectedBranch.address);
        if (recipient?.name === branchInfo.province) setShippingPrice(30000);
        else if (recipient?.region === branchInfo.region) setShippingPrice(40000);
        else setShippingPrice(60000);
      }
      return;
    }

    if (!selectedBranch.ghnDistrictId || selectedBranch.ghnDistrictId === 0) return;

    let cancelled = false;
    async function fetchGHNFee() {
      setShippingLoading(true);
      try {
        const result = await calculateShippingFee({
          fromDistrictId: selectedBranch.ghnDistrictId,
          toDistrictId: recipientDistrictId,
          toWardCode: recipientWardCode,
          weight: cartItems.reduce((sum, item) => sum + item.quantity * 500, 0),
          insuredValue: selectedTotalPrice,
        });
        if (!cancelled && result?.success && result.data) {
          setShippingPrice(result.data.fee || 30000);
          if (result.data.estimatedDeliveryTime) {
            const date = new Date(result.data.estimatedDeliveryTime);
            setEstimatedDelivery(date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }));
          }
        }
      } catch {
        if (!cancelled) setShippingPrice(30000);
      } finally {
        if (!cancelled) setShippingLoading(false);
      }
    }
    fetchGHNFee();
    return () => { cancelled = true; };
  }, [selectedBranchId, recipientDistrictId, recipientWardCode, selectedTotalPrice, cartItems.length]);
  
  const grandTotal = Math.max(0, selectedTotalPrice + shippingPrice - discountAmount);

  // Hàm áp dụng voucher thủ công
  const handleApplyVoucher = async () => {
    if (!voucherCode.trim()) return;
    setVoucherLoading(true);
    try {
      const code = voucherCode.toUpperCase();
      const srv = await applyVoucherServer(code);
      if (srv.status === 200 && srv.data && srv.data.success) {
        const payload = srv.data.data || srv.data;
        setAppliedVoucher({ code: payload.voucherCode || code });
        setDiscountAmount(payload.discountAmount || 0);
        setAlert({ type: 'success', message: 'Áp dụng mã thành công!' });
        setVoucherCode('');
        setShowVoucherModal(false);
        return;
      }

      if (srv.status === 401) {
        const result = await findVoucherByCode(code, selectedTotalPrice);
        if (!result || !result.voucher) {
          setAlert({
            type: 'error',
            message: 'Mã không hợp lệ hoặc đã hết hạn',
          });
          return;
        }
        if (!result.value || result.value <= 0) {
          setAlert({
            type: 'error',
            message: 'Mã chưa đạt điều kiện áp dụng cho các sản phẩm đã chọn',
          });
          return;
        }
        setAppliedVoucher(result.voucher);
        setDiscountAmount(result.value);
        setAlert({
          type: 'success',
          message: 'Áp dụng mã (tạm tính) thành công!',
        });
        setVoucherCode('');
        setShowVoucherModal(false);
        return;
      }

      const msg = srv.data?.message || 'Mã không hợp lệ hoặc đã hết hạn';
      setAlert({ type: 'error', message: msg });
    } catch (err) {
      setAlert({ type: 'error', message: 'Lỗi khi kiểm tra mã giảm giá' });
    } finally {
      setVoucherLoading(false);
    }
  };

  const applyVoucherByCode = async (code: string) => {
    setVoucherLoading(true);
    try {
      const srv = await applyVoucherServer(code);
      if (srv.status === 200 && srv.data && srv.data.success) {
        const payload = srv.data.data || srv.data;
        setAppliedVoucher({ code: payload.voucherCode || code });
        setDiscountAmount(payload.discountAmount || 0);
        setAlert({ type: 'success', message: 'Áp dụng mã thành công!' });
        setShowVoucherModal(false);
        return;
      }

      if (srv.status === 401) {
        const result = await findVoucherByCode(code, selectedTotalPrice);
        if (result && result.voucher && result.value > 0) {
          setAppliedVoucher(result.voucher);
          setDiscountAmount(result.value);
          setAlert({
            type: 'success',
            message: 'Áp dụng mã giảm giá thành công!',
          });
          setShowVoucherModal(false);
        } else {
          setAlert({
            type: 'error',
            message:
              'Mã giảm giá này chưa đạt điều kiện tối thiểu của đơn hàng đã chọn',
          });
        }
        return;
      }

      setAlert({
        type: 'error',
        message: srv.data?.message || 'Không thể áp dụng mã',
      });
    } catch (err) {
      setAlert({ type: 'error', message: 'Lỗi khi áp dụng mã' });
    } finally {
      setVoucherLoading(false);
    }
  };

  // Đặt hàng ngay
  const handlePlaceOrder = async () => {
    if (!fullName.trim() || !phone.trim() || !province || !district.trim() || !ward.trim() || !streetAddress.trim()) {
      setAlert({
        type: 'error',
        message: 'Vui lòng điền đầy đủ thông tin địa chỉ nhận hàng!',
      });
      return;
    }

    if (!selectedBranchId) {
      setAlert({
        type: 'error',
        message: 'Vui lòng chọn chi nhánh đặt hàng!',
      });
      return;
    }

    setSubmitting(true);
    try {
      const orderItems = cartItems.map((item) => ({
        product: item.product,
        variantId: item.variant !== 'default' ? item.variant : null,
        qty: item.quantity,
      }));

      const payload = {
        orderItems,
        shippingAddress: {
          fullName,
          phone,
          province,
          district,
          ward,
          streetAddress,
        },
        paymentMethod,
        discountDMember: 0,
        tradeInBonus: 0,
        shippingPrice,
        branchId: selectedBranchId,
        appliedVoucher: appliedVoucher?.code || null,
        discountVoucher: discountAmount || 0,
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        const orderId = data.data?._id || data.order?._id || data._id || '';

        // Nếu là COD → chuyển hướng thẳng đến trang thành công
        if (paymentMethod === 'COD') {
          setIsOrderCompleted(true);
          if (!buyNow) {
            for (const item of cartItems) {
              await removeItem(item.product, item.variant);
            }
          }
          router.replace(`/checkout/success?orderId=${orderId}&paymentMethod=${paymentMethod}&total=${grandTotal}`);
          return;
        }

        // Nếu là MOMO → gọi API tạo thanh toán MoMo rồi redirect
        if (paymentMethod === 'MOMO') {
          const momoRes = await createMoMoPayment(orderId);
          if (momoRes.success && momoRes.data?.payUrl) {
            setIsOrderCompleted(true);
            if (!buyNow) {
              for (const item of cartItems) {
                await removeItem(item.product, item.variant);
              }
            }
            // Redirect đến cổng thanh toán MoMo
            window.location.href = momoRes.data.payUrl;
          } else {
            setAlert({
              type: 'error',
              message: momoRes.message || 'Không thể tạo thanh toán MoMo. Đơn hàng đã được tạo, vui lòng thanh toán từ trang Đơn hàng của tôi.',
            });
            setSubmitting(false);
          }
          return;
        }

        // Nếu là VNPay → gọi API tạo thanh toán VNPay rồi redirect
        if (paymentMethod === 'VNPAY') {
          const vnpayRes = await createVNPayPayment(orderId);
          if (vnpayRes.success && vnpayRes.data?.paymentUrl) {
            setIsOrderCompleted(true);
            if (!buyNow) {
              for (const item of cartItems) {
                await removeItem(item.product, item.variant);
              }
            }
            // Redirect đến cổng thanh toán VNPay
            window.location.href = vnpayRes.data.paymentUrl;
          } else {
            setAlert({
              type: 'error',
              message: vnpayRes.message || 'Không thể tạo thanh toán VNPay. Đơn hàng đã được tạo, vui lòng thanh toán từ trang Đơn hàng của tôi.',
            });
            setSubmitting(false);
          }
          return;
        }

        // Fallback (không nên xảy ra)
        setIsOrderCompleted(true);
        if (!buyNow) {
          for (const item of cartItems) {
            await removeItem(item.product, item.variant);
          }
        }
        router.replace(`/checkout/success?orderId=${orderId}&paymentMethod=${paymentMethod}&total=${grandTotal}`);
      } else {
        setAlert({ type: 'error', message: data.message || 'Lỗi đặt hàng' });
        setSubmitting(false);
      }
    } catch (err) {
      setAlert({ type: 'error', message: 'Lỗi kết nối khi đặt hàng' });
      setSubmitting(false);
    }
  };

  return {
    cartItems,
    selectedTotalPrice,
    profile, setProfile,
    loading, mounted,
    fullName, setFullName,
    phone, setPhone,
    province, setProvince,
    district, setDistrict,
    ward, setWard,
    streetAddress, setStreetAddress,
    branches,
    selectedBranchId, setSelectedBranchId, selectedBranch,
    paymentMethod, setPaymentMethod,
    vouchers,
    appliedVoucher, setAppliedVoucher,
    discountAmount, setDiscountAmount,
    bestVoucherCode, setBestVoucherCode,
    showVoucherModal, setShowVoucherModal,
    voucherCode, setVoucherCode,
    voucherLoading,
    showAddressModal, setShowAddressModal,
    productDetails,
    submitting,
    isOrderCompleted,
    shippingLoading,
    estimatedDelivery,
    shippingPrice,
    alert, setAlert,
    grandTotal,
    handleApplyVoucher,
    applyVoucherByCode,
    handlePlaceOrder,
    applicableVouchers
  };
}
