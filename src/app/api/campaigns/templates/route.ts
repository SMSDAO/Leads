import { NextResponse } from 'next/server';
import { FLASH_NEO_TEMPLATES } from '@/src/lib/templates';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const category = url.searchParams.get('category');

    if (category && category !== 'ALL') {
      const filtered = FLASH_NEO_TEMPLATES.filter(
        (t) => t.category.toLowerCase() === category.toLowerCase()
      );
      return NextResponse.json({ success: true, count: filtered.length, templates: filtered });
    }

    return NextResponse.json({
      success: true,
      count: FLASH_NEO_TEMPLATES.length,
      templates: FLASH_NEO_TEMPLATES,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
