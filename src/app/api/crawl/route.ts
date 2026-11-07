import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { executeCrawl } from '@/src/lib/crawler';

export async function POST(req: Request) {
  try {
    const { userId, links, location } = await req.json();

    if (!userId || !links || !Array.isArray(links) || links.length === 0) {
      return NextResponse.json(
        { error: 'Invalid payload: userId and links array required' },
        { status: 400 }
      );
    }

    const crawlJob = await prisma.crawlJob.create({
      data: {
        userId,
        targetUrl: links[0],
        location: location || 'Global',
        status: 'PENDING',
      },
    });

    // Run async background processing
    executeCrawl(crawlJob.id, links, location).catch((err) => {
      console.error('Crawl execution worker error:', err);
    });

    return NextResponse.json({
      success: true,
      jobId: crawlJob.id,
      message: 'Crawl initiated across rotating proxy pool',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');

    const jobs = await prisma.crawlJob.findMany({
      where: userId ? { userId } : undefined,
      include: { results: true },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    return NextResponse.json({ success: true, jobs });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
