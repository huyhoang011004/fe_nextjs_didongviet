export const filterIphoneProducts = (products: any[]) => {
  return products.filter((p) => p.name.toLowerCase().includes('iphone'));
};

export const filterSamsungProducts = (products: any[]) => {
  return products.filter((p) => {
    const isSamsung = p.brand?.toLowerCase() === 'samsung';
    const name = p.name?.toLowerCase() || '';
    const isWatch = name.includes('watch') || name.includes('đồng hồ');
    return isSamsung && !isWatch;
  });
};

export const filterOppoXiaomiProducts = (products: any[]) => {
  return products.filter((p) => {
    const brand = p.brand?.toLowerCase() || '';
    const catName = p.category?.name?.toLowerCase() || '';
    const catSlug = p.category?.slug?.toLowerCase() || '';
    const name = p.name?.toLowerCase() || '';

    const isTargetBrand =
      brand === 'oppo' ||
      brand === 'xiaomi' ||
      brand === 'tecno' ||
      brand === 'realme' ||
      brand === 'honor';

    if (!isTargetBrand) return false;

    // Loại bỏ toàn bộ các sản phẩm không phải điện thoại
    const isExcluded =
      name.includes('robot') ||
      name.includes('lọc không khí') ||
      name.includes('loc khong khi') ||
      name.includes('hút bụi') ||
      name.includes('hut bui') ||
      name.includes('watch') ||
      name.includes('đồng hồ') ||
      name.includes('dong ho') ||
      name.includes('tai nghe') ||
      name.includes('loa') ||
      name.includes('cáp') ||
      name.includes('sạc') ||
      name.includes('chuột') ||
      name.includes('bàn phím') ||
      name.includes('tivi') ||
      name.includes('quạt') ||
      catName.includes('gia dụng') ||
      catName.includes('phụ kiện') ||
      catName.includes('âm thanh') ||
      catName.includes('đồng hồ') ||
      catSlug.includes('gia-dung') ||
      catSlug.includes('phu-kien') ||
      catSlug.includes('am-thanh') ||
      catSlug.includes('smartwatch');

    return !isExcluded;
  });
};

export const filterIpadTabletProducts = (products: any[]) => {
  return products.filter((p) => {
    const catName = p.category?.name?.toLowerCase() || '';
    const catSlug = p.category?.slug?.toLowerCase() || '';
    const name = p.name?.toLowerCase() || '';
    return (
      catName.includes('tablet') ||
      catName.includes('ipad') ||
      catSlug.includes('tablet') ||
      catSlug.includes('ipad') ||
      name.includes('ipad') ||
      name.includes('tablet')
    );
  });
};

export const filterMacbookLaptopProducts = (products: any[]) => {
  return products.filter((p) => {
    const catName = p.category?.name?.toLowerCase() || '';
    const catSlug = p.category?.slug?.toLowerCase() || '';
    const name = p.name?.toLowerCase() || '';
    return (
      (catName.includes('laptop') ||
        catSlug.includes('laptop') ||
        name.includes('laptop') ||
        name.includes('macbook')) &&
      !catName.includes('tablet') &&
      !catName.includes('ipad') &&
      !name.includes('ipad') &&
      !name.includes('tablet')
    );
  });
};

export const filterUsedProducts = (products: any[]) => {
  return products.filter((p) => {
    const cond = p.condition?.toLowerCase() || '';
    const name = p.name?.toLowerCase() || '';
    const catName = p.category?.name?.toLowerCase() || '';
    const catSlug = p.category?.slug?.toLowerCase() || '';
    return (
      cond === 'cũ' ||
      cond === 'likenew' ||
      name.includes('cũ') ||
      catName.includes('cũ') ||
      catSlug.includes('cũ')
    );
  });
};

export const filterSmartwatchProducts = (products: any[]) => {
  return products.filter((p) => {
    const catName = p.category?.name?.toLowerCase() || '';
    const catSlug = p.category?.slug?.toLowerCase() || '';
    return (
      catName.includes('watch') ||
      catSlug.includes('smartwatch') ||
      catName.includes('đồng hồ') ||
      catName.includes('dong-ho') ||
      catSlug.includes('dong-ho-thong-minh')
    );
  });
};

export const filterAccessoryProducts = (products: any[]) => {
  return products.filter((p) => {
    const catName = p.category?.name?.toLowerCase() || '';
    const catSlug = p.category?.slug?.toLowerCase() || '';
    return (
      catName.includes('phụ kiện') ||
      catSlug.includes('phu-kien') ||
      catSlug.includes('cap-sac') ||
      catSlug.includes('cu-sac') ||
      catSlug.includes('pin-sac-du-phong')
    );
  });
};

export const filterAudioProducts = (products: any[]) => {
  return products.filter((p) => {
    const catName = p.category?.name?.toLowerCase() || '';
    const catSlug = p.category?.slug?.toLowerCase() || '';
    return (
      catName.includes('tai nghe') ||
      catName.includes('loa') ||
      catSlug.includes('am-thanh') ||
      catSlug.includes('audio') ||
      catSlug.includes('thiet-bi-am-thanh')
    );
  });
};

export const filterApplianceProducts = (products: any[]) => {
  return products.filter((p) => {
    const catName = p.category?.name?.toLowerCase() || '';
    const catSlug = p.category?.slug?.toLowerCase() || '';
    return (
      catName.includes('gia dụng') ||
      catSlug.includes('gia-dung') ||
      catName.includes('nồi') ||
      catName.includes('ấm') ||
      catName.includes('lọc')
    );
  });
};
