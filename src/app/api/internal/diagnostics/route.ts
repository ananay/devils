import { NextResponse } from 'next/server'

// Shell access must not be exposed through the storefront HTTP process.
export async function POST() {
  return NextResponse.json({ error: 'Remote shell diagnostics have been removed' }, { status: 410 })
}
