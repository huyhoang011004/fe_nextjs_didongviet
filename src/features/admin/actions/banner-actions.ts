'use server';

import { fetchWithAdminAuth, getApiUrl } from '@/features/admin/utils/admin-utils';
import { revalidatePath } from 'next/cache';

export async function getBannersAction() {
    try {
        const response = await fetchWithAdminAuth(`${getApiUrl()}/banners`, {
            method: 'GET',
            cache: 'no-store'
        });
        return await response.json();
    } catch (error) {
        console.error('Lỗi khi lấy danh sách banner:', error);
        return { success: false, message: 'Lỗi khi lấy danh sách banner' };
    }
}

export async function createBannerAction(data: any) {
    try {
        const response = await fetchWithAdminAuth(`${getApiUrl()}/banners`, {
            method: 'POST',
            body: JSON.stringify(data),
        });
        revalidatePath('/admin/banners');
        revalidatePath('/');
        return await response.json();
    } catch (error) {
        console.error('Lỗi khi tạo banner:', error);
        return { success: false, message: 'Lỗi kết nối khi tạo banner' };
    }
}

export async function updateBannerAction(id: string, data: any) {
    try {
        const response = await fetchWithAdminAuth(`${getApiUrl()}/banners/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
        revalidatePath('/admin/banners');
        revalidatePath('/');
        return await response.json();
    } catch (error) {
        console.error('Lỗi khi cập nhật banner:', error);
        return { success: false, message: 'Lỗi kết nối khi cập nhật banner' };
    }
}

export async function deleteBannerAction(id: string) {
    try {
        const response = await fetchWithAdminAuth(`${getApiUrl()}/banners/${id}`, {
            method: 'DELETE',
        });
        revalidatePath('/admin/banners');
        revalidatePath('/');
        return await response.json();
    } catch (error) {
        console.error('Lỗi khi xóa banner:', error);
        return { success: false, message: 'Lỗi kết nối khi xóa banner' };
    }
}
