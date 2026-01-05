/**
 * Database Homepage Settings Functions
 * 
 * This module provides database-backed homepage settings functions.
 */

import { prisma } from '@/lib/prisma';

export interface HomepageSettings {
  id: string;
  heroBannerImage: string | null;
  collectionImages: {
    shirts?: string;
    tShirts?: string;
    pants?: string;
    jackets?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Get homepage settings from database
 */
export async function getHomepageSettingsFromDB(): Promise<HomepageSettings | null> {
  try {
    // Check if the model exists in Prisma client
    if (!prisma.homepageSettings) {
      console.error('[homepage-settings-db.ts] HomepageSettings model not found in Prisma client. Please run: npx prisma generate');
      return null;
    }

    let settings = await prisma.homepageSettings.findUnique({
      where: { id: 'homepage' },
    });

    // If no settings exist, create default
    if (!settings) {
      settings = await prisma.homepageSettings.create({
        data: {
          id: 'homepage',
          heroBannerImage: null,
          collectionImages: {},
        },
      });
    }

    return {
      id: settings.id,
      heroBannerImage: settings.heroBannerImage,
      collectionImages: settings.collectionImages as HomepageSettings['collectionImages'],
      createdAt: settings.createdAt,
      updatedAt: settings.updatedAt,
    };
  } catch (error: any) {
    console.error('[homepage-settings-db.ts] Error fetching homepage settings:', error);
    if (error.message?.includes('homepageSettings')) {
      console.error('[homepage-settings-db.ts] Prisma client may need regeneration. Run: npx prisma generate');
    }
    return null;
  }
}

/**
 * Update homepage settings in database
 */
export async function updateHomepageSettingsInDB(
  data: Partial<Omit<HomepageSettings, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<HomepageSettings | null> {
  try {
    // Check if the model exists in Prisma client
    if (!prisma.homepageSettings) {
      console.error('[homepage-settings-db.ts] HomepageSettings model not found in Prisma client. Please run: npx prisma generate');
      throw new Error('HomepageSettings model not available. Please restart the server.');
    }

    // Check if record exists
    const existing = await prisma.homepageSettings.findUnique({
      where: { id: 'homepage' },
    });

    let settings;
    
    if (existing) {
      // Update existing record
      settings = await prisma.homepageSettings.update({
        where: { id: 'homepage' },
        data: {
          ...(data.heroBannerImage !== undefined && { heroBannerImage: data.heroBannerImage }),
          ...(data.collectionImages && { collectionImages: data.collectionImages }),
        },
      });
    } else {
      // Create new record
      settings = await prisma.homepageSettings.create({
        data: {
          id: 'homepage',
          heroBannerImage: data.heroBannerImage || null,
          collectionImages: data.collectionImages || {},
        },
      });
    }

    return {
      id: settings.id,
      heroBannerImage: settings.heroBannerImage,
      collectionImages: settings.collectionImages as HomepageSettings['collectionImages'],
      createdAt: settings.createdAt,
      updatedAt: settings.updatedAt,
    };
  } catch (error: any) {
    console.error('[homepage-settings-db.ts] Error updating homepage settings:', error);
    console.error('[homepage-settings-db.ts] Error details:', {
      message: error.message,
      code: error.code,
      meta: error.meta,
      stack: error.stack,
    });
    throw error; // Re-throw to see the actual error
  }
}

