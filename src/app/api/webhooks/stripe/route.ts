import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('stripe-signature');

    // In production with stripe SDK: stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET!)
    const event = JSON.parse(rawBody || '{}');

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const customerEmail = session.customer_email || session.customer_details?.email;
        if (customerEmail) {
          await prisma.user.update({
            where: { email: customerEmail },
            data: {
              status: 'ACTIVE',
              stripeId: session.customer,
            },
          });
        }
        break;
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        await prisma.user.updateMany({
          where: { stripeId: subscription.customer },
          data: { status: 'CANCELED' },
        });
        break;
      }
      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const newStatus = subscription.status === 'active' ? 'ACTIVE' : subscription.status === 'past_due' ? 'PAST_DUE' : 'TRIAL';
        await prisma.user.updateMany({
          where: { stripeId: subscription.customer },
          data: { status: newStatus },
        });
        break;
      }
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object;
        if (invoice.customer) {
          await prisma.user.updateMany({
            where: { stripeId: invoice.customer },
            data: { status: 'ACTIVE' },
          });
        }
        break;
      }
      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        await prisma.user.updateMany({
          where: { stripeId: invoice.customer },
          data: { status: 'PAST_DUE' },
        });
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Stripe webhook processing error:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
