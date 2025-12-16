import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { url, event } = body

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      )
    }

    // Construct webhook payload
    const payload = {
      event,
      timestamp: new Date().toISOString(),
      data: {
        test: true,
        message: 'This is a test webhook from Devil\'s Advocate',
      },
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Event': event,
      },
      body: JSON.stringify(payload),
    })

    return NextResponse.json({
      message: `Webhook sent to ${url}`,
      status: response.status,
      statusText: response.statusText,
    })
  } catch (error) {
    console.error('Webhook test error:', error)
    return NextResponse.json(
      { error: 'Failed to send webhook', details: String(error) },
      { status: 500 }
    )
  }
}

