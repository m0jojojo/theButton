/**
 * Single source of truth for the shop's contact details.
 *
 * Everything that links to WhatsApp, shows the phone number or prints the
 * address reads from here, so a change only has to be made once.
 */

export const contact = {
  email: 'poonam@rangrez.club',
  /** Display form, used in text. */
  phone: '+91-7027479920',
  /** Digits only with country code, the format wa.me and tel: expect. */
  phoneDigits: '917027479920',
  address: {
    line1: 'H.No-496, Sector 4',
    line2: 'Rewari, Haryana, 123401',
  },
} as const;

export const telHref = `tel:+${contact.phoneDigits}`;
export const mailHref = `mailto:${contact.email}`;

/** WhatsApp chat link, optionally pre-filling a message. */
export function whatsappHref(message?: string): string {
  const base = `https://wa.me/${contact.phoneDigits}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
