import { NextRequest, NextResponse } from 'next/server'
import { executeCommand } from '@/lib/server-utils'

// Command injection vulnerability - executes user-provided commands
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { command } = body

    if (!command) {
      return NextResponse.json(
        { error: 'Command is required' },
        { status: 400 }
      )
    }

    // Dangerous: executes shell commands without sanitization
    const output = await executeCommand(command)

    return NextResponse.json({ output })
  } catch (error) {
    console.error('Diagnostics error:', error)
    return NextResponse.json(
      { error: 'Command execution failed', details: String(error) },
      { status: 500 }
    )
  }
}

