'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackPageView } from '@/lib/analytics';

export default function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    // Track page view on route change
    const url = pathname + (typeof window !== 'undefined' ? window.location.search : '');
    trackPageView(url, typeof document !== 'undefined' ? document.title : '');
  }, [pathname]);

  // Meta Pixel Script
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.fbq) {
      const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
      
      if (metaPixelId) {
        // Initialize Meta Pixel
        (function(f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
          if (f.fbq) return;
          n = f.fbq = function() {
            n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
          };
          if (!f._fbq) f._fbq = n;
          n.push = n;
          n.loaded = true;
          n.version = '2.0';
          n.queue = [];
          t = b.createElement(e);
          t.async = true;
          t.src = v;
          s = b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t, s);
        })(
          window,
          document,
          'script',
          'https://connect.facebook.net/en_US/fbevents.js'
        );

        // Initialize with Pixel ID
        const fbq = window.fbq as ((...args: any[]) => void) | undefined;
        if (fbq) {
          fbq('init', metaPixelId);
          fbq('track', 'PageView');
        }
      }
    }
  }, []);

  // Google Analytics 4 Script
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.gtag) {
      const ga4Id = process.env.NEXT_PUBLIC_GA4_ID;
      
      if (ga4Id) {
        // Initialize dataLayer
        window.dataLayer = window.dataLayer || [];
        function gtag(...args: any[]) {
          if (window.dataLayer) {
            window.dataLayer.push(args);
          }
        }
        window.gtag = gtag;
        gtag('js', new Date());
        gtag('config', ga4Id, {
          page_path: window.location.pathname,
        });

        // Load GA4 script
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${ga4Id}`;
        document.head.appendChild(script);
      }
    }
  }, []);

  return null;
}

