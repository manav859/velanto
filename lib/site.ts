export const SITE_NAME = 'Velanto Auto Care'
export const SITE_SHORT_NAME = 'Velanto'
export const DEFAULT_SITE_DESCRIPTION =
  'Professional-grade car care products for a showroom finish. Shop shampoos, ceramic sprays, tyre cleaners, microfibre towels, and detailing kits.'
export const DEFAULT_OG_TYPE = 'website'

type PublicLink = {
  label: string
  href: string | null
}

function normalizeEmail(value: string | undefined): string | null {
  const email = value?.trim().toLowerCase()
  if (!email || !email.includes('@')) return null
  return email
}

function normalizeUrl(value: string | undefined): string | null {
  const raw = value?.trim()
  if (!raw) return null

  try {
    return new URL(raw).toString()
  } catch {
    try {
      return new URL(`https://${raw}`).toString()
    } catch {
      return null
    }
  }
}

function normalizePhone(value: string | undefined): string | null {
  const digits = value?.replace(/[^\d+]/g, '').trim()
  return digits || null
}

function toTelHref(phone: string | null): string | null {
  if (!phone) return null
  return `tel:${phone.replace(/\s+/g, '')}`
}

function toWhatsAppHref(phone: string | null): string | null {
  if (!phone) return null
  const digits = phone.replace(/[^\d]/g, '')
  return digits ? `https://wa.me/${digits}` : null
}

export function getSiteUrl(): URL | null {
  const raw = normalizeUrl(process.env.NEXT_PUBLIC_SITE_URL)
  if (!raw) return null

  try {
    return new URL(raw)
  } catch {
    return null
  }
}

export function absoluteUrl(path = '/'): string | null {
  const siteUrl = getSiteUrl()
  if (!siteUrl) return null
  return new URL(path, siteUrl).toString()
}

export const publicContact = {
  email: normalizeEmail(process.env.NEXT_PUBLIC_SUPPORT_EMAIL),
  phone: normalizePhone(process.env.NEXT_PUBLIC_SUPPORT_PHONE),
  location: process.env.NEXT_PUBLIC_SUPPORT_LOCATION?.trim() || null,
}

export const publicContactLinks = {
  email: publicContact.email ? `mailto:${publicContact.email}` : null,
  phone: toTelHref(publicContact.phone),
  whatsapp: toWhatsAppHref(publicContact.phone),
}

export const publicSocialLinks: PublicLink[] = [
  {
    label: 'Instagram',
    href: normalizeUrl(process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM_URL),
  },
  {
    label: 'YouTube',
    href: normalizeUrl(process.env.NEXT_PUBLIC_SOCIAL_YOUTUBE_URL),
  },
  {
    label: 'X',
    href: normalizeUrl(process.env.NEXT_PUBLIC_SOCIAL_X_URL),
  },
]

export function getSupportChannelLabel(): string {
  if (publicContact.email) return publicContact.email
  if (publicContact.phone) return publicContact.phone
  return 'the contact page'
}
