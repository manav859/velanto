import { NextResponse } from 'next/server'

type TrackOrderRequest = {
  orderNumber?: unknown
  email?: unknown
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function normalizeOrderNumber(value: unknown) {
  if (typeof value !== 'string') return null
  const normalized = value.trim()
  return normalized.length >= 3 ? normalized : null
}

function normalizeEmail(value: unknown) {
  if (typeof value !== 'string') return null
  const normalized = value.trim().toLowerCase()
  return isValidEmail(normalized) ? normalized : null
}

export async function POST(request: Request) {
  let body: TrackOrderRequest

  try {
    body = (await request.json()) as TrackOrderRequest
  } catch {
    return NextResponse.json(
      {
        error: 'invalid_request',
        message: 'Send a JSON body with orderNumber and email.',
      },
      { status: 400 }
    )
  }

  const orderNumber = normalizeOrderNumber(body.orderNumber)
  const email = normalizeEmail(body.email)

  if (!orderNumber || !email) {
    return NextResponse.json(
      {
        error: 'validation_failed',
        message: 'A valid order number and email address are required.',
      },
      { status: 400 }
    )
  }

  return NextResponse.json(
    {
      status: 'not_implemented',
      message: 'Order tracking is not available yet for this storefront.',
      submitted: {
        orderNumber,
        email,
      },
      todo: [
        'Look up the order server-side with the Shopify Admin API.',
        'Match the order by order number and customer email.',
        'Return sanitized fulfillment and tracking status only.',
      ],
    },
    { status: 501 }
  )
}
