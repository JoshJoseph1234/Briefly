import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { sendMail } from '@/lib/email';

const BodySchema = z.object({
  recipients: z.string().min(3, 'Recipients are required'),
  subject: z.string().default('Meeting Summary'),
  body: z.string().min(1, 'Body is required')
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const { recipients, subject, body } = BodySchema.parse(json);
    const to = recipients.split(',').map((e) => e.trim()).filter(Boolean);
    if (to.length === 0) throw new Error('No valid recipient addresses');
    await sendMail({ to, subject, body });
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    const message = err?.message || 'Failed to send email';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
