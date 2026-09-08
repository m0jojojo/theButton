/**
 * Browser-side helper for sending a cropped image to ImageKit via the admin
 * upload route, which holds the private key.
 */

export async function uploadImageToCdn(
  dataUrl: string,
  options: { fileName: string; folder?: string }
): Promise<string> {
  const token = localStorage.getItem('rangrez_token');

  const response = await fetch('/api/admin/upload', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ image: dataUrl, ...options }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.url) {
    throw new Error(data.error || 'Image upload failed');
  }
  return data.url as string;
}
