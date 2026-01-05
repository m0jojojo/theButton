import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromRequest } from '@/lib/jwt';
import { requireAdmin } from '@/lib/admin';
import { getHomepageSettingsFromDB, updateHomepageSettingsInDB } from '@/lib/homepage-settings-db';

export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);
    requireAdmin(token);

    const settings = await getHomepageSettingsFromDB();

    if (!settings) {
      return NextResponse.json(
        { error: 'Failed to fetch homepage settings' },
        { status: 500 }
      );
    }

    return NextResponse.json({ settings });
  } catch (error: any) {
    console.error('[Admin Homepage Settings GET] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch homepage settings' },
      { status: error.message?.includes('Forbidden') ? 403 : 401 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);
    requireAdmin(token);

    const body = await request.json();
    const { heroBannerImage, collectionImages } = body;

    const updateData: any = {};
    if (heroBannerImage !== undefined) {
      updateData.heroBannerImage = heroBannerImage || null;
    }
    if (collectionImages !== undefined) {
      updateData.collectionImages = collectionImages;
    }

    const updatedSettings = await updateHomepageSettingsInDB(updateData);

    if (!updatedSettings) {
      return NextResponse.json(
        { error: 'Failed to update homepage settings' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      settings: updatedSettings,
      message: 'Homepage settings updated successfully',
    });
  } catch (error: any) {
    console.error('[Admin Homepage Settings PATCH] Error:', error);
    console.error('[Admin Homepage Settings PATCH] Error details:', {
      message: error.message,
      code: error.code,
      stack: error.stack,
    });
    return NextResponse.json(
      { 
        error: error.message || 'Failed to update homepage settings',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

