import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, subject, message } = body

    // In a real app, you'd send an email or store the message
    // For demo purposes, we just log it
    console.log('Contact form submission:', { name, email, subject, message })

    return NextResponse.json({
      message: 'Message sent successfully',
      data: { name, email, subject, message },
    })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Failed to send message', details: String(error) },
      { status: 500 }
    )
  }
}





