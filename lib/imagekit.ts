/**
 * ImageKit uploads (server side).
 *
 * Images used to be stored as base64 data URLs in Postgres and inlined into
 * every page's HTML, which made the homepage megabytes large and impossible
 * to cache. They now live on ImageKit's CDN and the database keeps only URLs.
 *
 * The private key must never reach the browser, so uploads go through
 * /api/admin/upload rather than straight from the admin page.
 */

import ImageKit from 'imagekit';

// Read at call time, not module load: a script that imports this before
// something else has loaded .env would otherwise capture empty strings.
function credentials() {
  return {
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
  };
}

export function isImageKitConfigured(): boolean {
  const { publicKey, privateKey, urlEndpoint } = credentials();
  return Boolean(publicKey && privateKey && urlEndpoint);
}

function getClient(): ImageKit {
  const { publicKey, privateKey, urlEndpoint } = credentials();
  if (!publicKey || !privateKey || !urlEndpoint) {
    throw new Error(
      'ImageKit is not configured. Set IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY and IMAGEKIT_URL_ENDPOINT.'
    );
  }
  return new ImageKit({ publicKey, privateKey, urlEndpoint });
}

export interface UploadedImage {
  url: string;
  fileId: string;
}

/**
 * Uploads a base64 data URL (what the cropper produces) or a remote URL.
 * `folder` groups uploads in the ImageKit media library, e.g. "products".
 */
export async function uploadImage(
  source: string,
  options: { fileName: string; folder?: string }
): Promise<UploadedImage> {
  const client = getClient();

  const result = await client.upload({
    file: source,
    fileName: options.fileName,
    folder: options.folder ? `/rangrez/${options.folder}` : '/rangrez',
    useUniqueFileName: true,
  });

  return { url: result.url, fileId: result.fileId };
}

/** True for values already hosted rather than inlined. */
export function isHostedUrl(value: string): boolean {
  return value.startsWith('http://') || value.startsWith('https://');
}
