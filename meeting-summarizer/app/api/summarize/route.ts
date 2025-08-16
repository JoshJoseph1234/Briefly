import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { generateSummary } from '@/lib/ai';

const BodySchema = z.object({
  transcript: z.string().min(10, 'Transcript is too short'),
  instruction: z.string().default('Summarize in bullet points for executives')
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const { transcript, instruction } = BodySchema.parse(json);
    const summary = await generateSummary(transcript, instruction);
    return NextResponse.json({ summary });
  } catch (err: any) {
    const message = err?.message || 'Failed to summarize';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
