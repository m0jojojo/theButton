// Analytics utility functions for Meta Pixel and GA4

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

// Meta Pixel Events
export const trackMetaEvent = (eventName: string, params?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, params || {});
  }
};

// GA4 Events
export const trackGA4Event = (eventName: string, params?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params || {});
  }
};

// Track both Meta Pixel and GA4
export const trackEvent = (eventName: string, params?: Record<string, any>) => {
  trackMetaEvent(eventName, params);
  trackGA4Event(eventName, params);
};

// Page View Tracking
export const trackPageView = (url: string, title?: string) => {
  trackMetaEvent('PageView', { url, title });
  trackGA4Event('page_view', { page_path: url, page_title: title });
};

// Product View
export const trackProductView = (product: {
  id: string;
  name: string;
  price: number;
  category?: string;
  sku?: string;
}) => {
  trackEvent('ViewContent', {
    content_name: product.name,
    content_ids: [product.id],
    content_type: 'product',
    value: product.price,
    currency: 'INR',
    content_category: product.category,
  });

  // GA4 specific
  trackGA4Event('view_item', {
    currency: 'INR',
    value: product.price,
    items: [
      {
        item_id: product.id,
        item_name: product.name,
        price: product.price,
        item_category: product.category,
        item_sku: product.sku,
      },
    ],
  });
};

// Add to Cart
export const trackAddToCart = (product: {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category?: string;
  sku?: string;
  size?: string;
}) => {
  const value = product.price * product.quantity;

  trackEvent('AddToCart', {
    content_name: product.name,
    content_ids: [product.id],
    content_type: 'product',
    value,
    currency: 'INR',
    quantity: product.quantity,
    content_category: product.category,
  });

  // GA4 specific
  trackGA4Event('add_to_cart', {
    currency: 'INR',
    value,
    items: [
      {
        item_id: product.id,
        item_name: product.name,
        price: product.price,
        quantity: product.quantity,
        item_category: product.category,
        item_variant: product.size,
        item_sku: product.sku,
      },
    ],
  });
};

// Initiate Checkout
export const trackInitiateCheckout = (data: {
  value: number;
  currency?: string;
  num_items?: number;
  items?: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    category?: string;
  }>;
}) => {
  trackEvent('InitiateCheckout', {
    value: data.value,
    currency: data.currency || 'INR',
    num_items: data.num_items,
    contents: data.items?.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      item_price: item.price,
    })),
  });

  // GA4 specific
  trackGA4Event('begin_checkout', {
    currency: data.currency || 'INR',
    value: data.value,
    items: data.items?.map((item) => ({
      item_id: item.id,
      item_name: item.name,
      price: item.price,
      quantity: item.quantity,
      item_category: item.category,
    })),
  });
};

// Purchase
export const trackPurchase = (data: {
  orderId: string;
  value: number;
  currency?: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    category?: string;
    sku?: string;
  }>;
}) => {
  trackEvent('Purchase', {
    value: data.value,
    currency: data.currency || 'INR',
    contents: data.items.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      item_price: item.price,
    })),
    content_ids: data.items.map((item) => item.id),
    content_type: 'product',
    num_items: data.items.reduce((sum, item) => sum + item.quantity, 0),
  });

  // GA4 specific
  trackGA4Event('purchase', {
    transaction_id: data.orderId,
    value: data.value,
    currency: data.currency || 'INR',
    items: data.items.map((item) => ({
      item_id: item.id,
      item_name: item.name,
      price: item.price,
      quantity: item.quantity,
      item_category: item.category,
      item_sku: item.sku,
    })),
  });
};

// WhatsApp Click
export const trackWhatsAppClick = (context?: {
  productId?: string;
  productName?: string;
  page?: string;
}) => {
  trackEvent('Contact', {
    content_name: context?.productName,
    content_ids: context?.productId ? [context.productId] : undefined,
    content_type: 'whatsapp',
    method: 'whatsapp',
  });

  trackGA4Event('whatsapp_click', {
    product_id: context?.productId,
    product_name: context?.productName,
    page: context?.page,
  });
};

// Search
export const trackSearch = (searchTerm: string) => {
  trackEvent('Search', {
    search_string: searchTerm,
  });

  trackGA4Event('search', {
    search_term: searchTerm,
  });
};

