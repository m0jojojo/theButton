// Client-side JWT utilities (no secret required)
// Can decode and check expiration, but cannot verify signature

export interface JWTPayload {
  userId: string;
  email: string;
  exp?: number;
  iat?: number;
}

/**
 * Decode JWT token without verification (client-side)
 * Returns null if token is malformed
 */
export function decodeToken(token: string): JWTPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    // Decode payload (second part)
    const payload = parts[1];
    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    
    return decoded as JWTPayload;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}

/**
 * Check if token is expired (client-side check)
 * Returns true if expired, false if valid, null if can't determine
 */
export function isTokenExpired(token: string): boolean | null {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) {
    return null; // Can't determine
  }

  // exp is in seconds, Date.now() is in milliseconds
  const expirationTime = decoded.exp * 1000;
  const currentTime = Date.now();

  return currentTime >= expirationTime;
}

/**
 * Check if token is valid (not expired and properly formatted)
 * Note: This does NOT verify the signature, only checks expiration
 */
export function isTokenValid(token: string): boolean {
  const decoded = decodeToken(token);
  if (!decoded) {
    return false; // Malformed token
  }

  const expired = isTokenExpired(token);
  if (expired === true) {
    return false; // Expired
  }

  return true; // Valid format and not expired
}

