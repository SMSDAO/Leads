import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';

// Master Admin Auto-Provisioning per specification
const MASTER_ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'gxqstudio@gmail.com';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Auto-assign ADMIN role to gxqstudio@gmail.com per specification
      const isMasterAdmin = email.toLowerCase() === MASTER_ADMIN_EMAIL.toLowerCase();

      user = await prisma.user.create({
        data: {
          email,
          name: isMasterAdmin ? 'Master Executive Admin' : email.split('@')[0],
          password: password || 'default_hashed_pwd',
          role: isMasterAdmin ? 'ADMIN' : 'USER',
          status: 'TRIAL',
        },
      });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'NextAuth Gateway Active',
    masterAdmin: MASTER_ADMIN_EMAIL,
  });
}
