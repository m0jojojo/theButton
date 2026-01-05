import { NextResponse } from 'next/server';
import { getHomepageSettingsFromDB } from '@/lib/homepage-settings-db';

export async function GET() {
  try {
    const settings = await getHomepageSettingsFromDB();

    if (!settings) {
      // Return default settings if none exist
      return NextResponse.json({
        settings: {
          id: 'homepage',
          heroBannerImage: null,
          collectionImages: {},
        },
      });
    }

    return NextResponse.json({ settings });
  } catch (error) {
    console.error('[Homepage Settings GET] Error:', error);
    // Return default settings on error
    return NextResponse.json({
      settings: {
        id: 'homepage',
        heroBannerImage: null,
        collectionImages: {},
      },
    });
  }
}

