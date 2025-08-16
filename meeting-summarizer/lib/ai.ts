import Groq from 'groq-sdk';

type Provider = 'groq' | 'openai';

async function summarizeWithGroq(transcript: string, instruction: string): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error('Missing GROQ_API_KEY');
  const model = process.env.GROQ_MODEL || 'llama3-70b-8192';
  const client = new Groq({ apiKey });
  const completion = await client.chat.completions.create({
    model,
    messages: [
      {
        role: 'system',
        content:
          'You are an expert meeting minutes assistant. Return a concise, structured Markdown summary. Always honor the user\'s instruction. Where relevant, include headings like Overview, Key Points, Action Items (with owners and due dates if present), Decisions, Risks, and Next Steps. Keep it crisp and scannable.'
      },
      { role: 'user', content: `Instruction: ${instruction}\n\nTranscript:\n${transcript}` }
    ],
    temperature: 0.2,
    max_tokens: 1200
  });
  const text = completion.choices?.[0]?.message?.content || '';
  if (!text) throw new Error('Empty response from Groq');
  return text.trim();
}

// Optional OpenAI fallback (only used if GROQ fails and OPENAI_API_KEY present)
async function summarizeWithOpenAI(transcript: string, instruction: string): Promise<string> {
  const { default: OpenAI } = await import('openai');
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('Missing OPENAI_API_KEY');
  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
  const client = new OpenAI({ apiKey });
  const completion = await client.chat.completions.create({
    model,
    messages: [
      {
        role: 'system',
        content:
          'You are an expert meeting minutes assistant. Return a concise, structured Markdown summary. Always honor the user\'s instruction. Where relevant, include headings like Overview, Key Points, Action Items (with owners and due dates if present), Decisions, Risks, and Next Steps. Keep it crisp and scannable.'
      },
      { role: 'user', content: `Instruction: ${instruction}\n\nTranscript:\n${transcript}` }
    ],
    temperature: 0.2
  });
  const text = completion.choices?.[0]?.message?.content || '';
  if (!text) throw new Error('Empty response from OpenAI');
  return text.trim();
}

export async function generateSummary(transcript: string, instruction: string): Promise<string> {
  // Prefer Groq, then OpenAI.
  try {
    return await summarizeWithGroq(transcript, instruction);
  } catch (groqErr) {
    if (process.env.OPENAI_API_KEY) {
      try {
        return await summarizeWithOpenAI(transcript, instruction);
      } catch (openaiErr) {
        throw groqErr;
      }
    }
    throw groqErr;
  }
}
