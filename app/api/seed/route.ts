import { NextResponse } from 'next/server';
import { seed } from '@/lib/seed';

export async function POST() {
  try {
    const log = await seed();
    return NextResponse.json({ success: true, log });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
