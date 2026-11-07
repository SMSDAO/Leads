import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { dispatchCampaignBatch } from '@/src/lib/email';

export async function POST(req: Request) {
  try {
    const { userId, name, subject, body, leadIds } = await req.json();

    if (!userId || !name || !subject || !body) {
      return NextResponse.json(
        { error: 'userId, name, subject, and body are required' },
        { status: 400 }
      );
    }

    const campaign = await prisma.emailCampaign.create({
      data: {
        userId,
        name,
        subject,
        body,
        status: 'DRAFT',
        sentCount: 0,
      },
    });

    if (leadIds && Array.isArray(leadIds) && leadIds.length > 0) {
      const leads = await prisma.businessLead.findMany({
        where: { id: { in: leadIds } },
      });

      // Dispatch asynchronously
      dispatchCampaignBatch({
        campaignId: campaign.id,
        leads,
        defaultSubject: subject,
        defaultBody: body,
      }).catch((err) => {
        console.error('Email dispatch error:', err);
      });
    }

    return NextResponse.json({ success: true, campaignId: campaign.id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');

    const campaigns = await prisma.emailCampaign.findMany({
      where: userId ? { userId } : undefined,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, campaigns });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
