import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const { userId, name } = await req.json();

    if (!userId || !name) {
      return NextResponse.json({ error: 'userId and name are required' }, { status: 400 });
    }

    const randomSuffix = crypto.randomBytes(16).toString('hex');
    const key = `gods_live_sk_${randomSuffix}`;

    const apiKey = await prisma.apiKey.create({
      data: {
        userId,
        name,
        key,
      },
    });

    return NextResponse.json({ success: true, apiKey });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId parameter required' }, { status: 400 });
    }

    const apiKeys = await prisma.apiKey.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, apiKeys });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { keyId } = await req.json();

    if (!keyId) {
      return NextResponse.json({ error: 'keyId required' }, { status: 400 });
    }

    await prisma.apiKey.delete({
      where: { id: keyId },
    });

    return NextResponse.json({ success: true, message: 'Key revoked successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
