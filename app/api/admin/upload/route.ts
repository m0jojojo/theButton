import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromRequest } from '@/lib/jwt';
import { requireAdmin } from '@/lib/admin';
import { isImageKitConfigured, uploadImage } from '@/lib/imagekit';

/**
 * Uploads an image to ImageKit and returns its CDN URL.
 *
 * Admin only: the ImageKit private key lives on the server, so letting anyone
 * call this would hand out free storage on the account.
 */
export async function POST(request: NextRequest) {
  try {
    requireAdmin(getTokenFromRequest(request));

    if (!isImageKitConfigured()) {
      return NextResponse.json(
        { error: 'Image hosting is not configured on this environment.' },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { image, fileName, folder } = body as {
      image?: string;
      fileName?: string;
      folder?: string;
    };

    if (!image || typeof image !== 'string') {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    const uploaded = await uploadImage(image, {
      fileName: fileName || `upload-${Date.now()}`,
      folder,
    });

    return NextResponse.json(uploaded);
  } catch (error: any) {
    const message = error?.message || 'Upload failed';
    const status = message.includes('Unauthorized')
      ? 401
      : message.includes('Forbidden')
      ? 403
      : 500;
    console.error('[admin/upload] Error:', message);
    return NextResponse.json({ error: message }, { status });
  }
}
