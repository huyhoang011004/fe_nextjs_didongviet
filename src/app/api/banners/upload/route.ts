import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'Vui lòng chọn file' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Tạo tên file an toàn
    const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
    const publicDir = path.join(process.cwd(), 'public');
    const uploadDir = path.join(publicDir, 'banners');

    // Đảm bảo thư mục tồn tại
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (err) {
      // Bỏ qua lỗi nếu thư mục đã tồn tại
    }

    const filepath = path.join(uploadDir, filename);
    await writeFile(filepath, buffer);

    // Trả về đường dẫn tương đối (để dùng trong thẻ img src)
    const fileUrl = `/banners/${filename}`;

    return NextResponse.json({
      success: true,
      message: 'Upload thành công',
      url: fileUrl
    });
  } catch (error: any) {
    console.error('Error uploading banner:', error);
    return NextResponse.json(
      { success: false, message: 'Lỗi server khi upload ảnh' },
      { status: 500 }
    );
  }
}
