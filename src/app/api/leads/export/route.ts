import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const crawlId = url.searchParams.get('crawlId');
    const format = url.searchParams.get('format') || 'csv'; // 'csv' or 'json'
    const category = url.searchParams.get('category');
    const minRating = url.searchParams.get('minRating');

    const whereClause: any = {};
    if (crawlId) whereClause.crawlId = crawlId;
    if (category && category !== 'ALL') whereClause.category = category;
    if (minRating) whereClause.rating = { gte: parseFloat(minRating) };

    const leads = await prisma.businessLead.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    });

    if (format === 'json') {
      return NextResponse.json({ success: true, count: leads.length, leads });
    }

    // CSV format generation
    const headers = [
      'ID',
      'Business Name',
      'Category',
      'Address',
      'Phone',
      'Email',
      'Website',
      'Rating',
      'Reviews Count',
      'Google Maps URL',
      'Created At',
    ];

    const rows = leads.map((l: any) => [
      `"${l.id || ''}"`,
      `"${(l.name || '').replace(/"/g, '""')}"`,
      `"${(l.category || '').replace(/"/g, '""')}"`,
      `"${(l.address || '').replace(/"/g, '""')}"`,
      `"${l.phone || ''}"`,
      `"${l.email || ''}"`,
      `"${l.website || ''}"`,
      l.rating ?? '',
      l.reviewsCount ?? '',
      `"${l.mapsUrl || ''}"`,
      `"${l.createdAt || ''}"`,
    ]);

    if (format === 'excel') {
      const tsvContent = [headers.join('\t'), ...rows.map((r: string[]) => r.map((c: string) => c.replace(/^"|"$/g, '')).join('\t'))].join('\n');
      return new Response(tsvContent, {
        status: 200,
        headers: {
          'Content-Type': 'application/vnd.ms-excel; charset=utf-8',
          'Content-Disposition': `attachment; filename="gods_leads_export_${Date.now()}.xls"`,
        },
      });
    }

    const csvContent = [headers.join(','), ...rows.map((r: string[]) => r.join(','))].join('\n');

    return new Response(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="gods_leads_export_${Date.now()}.csv"`,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
