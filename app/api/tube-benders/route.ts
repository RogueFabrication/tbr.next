import { NextResponse } from 'next/server';
import { getTubeBenders } from '../../../lib/tube-benders';

export async function GET() {
  return NextResponse.json({ items: getTubeBenders() });
}
