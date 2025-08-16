# Approach, Process, and Tech Stack

## Problem Understanding and Goals
The goal is to build a minimal, production-deployable web app that accepts a meeting/call transcript as plain text, accepts a user instruction describing how to summarize, generates a structured summary using an AI provider, allows edits, and finally shares the summary via email. The emphasis is on correctness and simplicity rather than UI polish.

## Tech Choices
I chose **Next.js (App Router)** to consolidate frontend and backend in one deployable project. For AI, I integrated **Groq** as the primary provider because of speed and cost-effectiveness, with optional **OpenAI** as a fallback. For email, I used **Resend** for simplicity in serverless deployments and provided an **SMTP** fallback using Nodemailer to accommodate any environment where Resend cannot be used.

## Data Flow
1. The user uploads or pastes a transcript and writes a custom instruction.
2. The frontend calls `/api/summarize` with both fields.
3. The API selects Groq (or fallback) and returns a Markdown summary.
4. The frontend shows the summary in an editable textarea.
5. The user enters email recipients and submits to `/api/send-email`.
6. The server sends the email via Resend or SMTP and returns a success status.

## Prompting Strategy
The system prompt fixes the assistant role as a meeting minutes expert and requests Markdown with thematic sections (Overview, Key Points, Action Items, Decisions, Risks, Next Steps), while strictly honoring the custom instruction. Temperature is low (0.2) for determinism. Max tokens are capped to avoid excessive cost while leaving room for longer transcripts (you may raise the limit for very large inputs).

## Security and Privacy
- All secrets are kept in environment variables. No keys are committed.
- Inputs are validated on the server with `zod` to ensure presence and minimal length.
- No data is stored server-side in this version (stateless). If persistence is needed later (history, sharing links), add a database (e.g., Postgres + Prisma).

## Deployment
- Deploy on **Vercel**. Add the environment variables listed in `.env.example`.
- The app runs fully on serverless functions; no extra services are required beyond the AI and email providers.

## Testing
- Use the included local dev server to test with a sample transcript.
- Verify error states: missing keys, empty transcript, invalid recipient addresses.
- Confirm both Resend and SMTP paths depending on which secrets you configure.

## Future Enhancements
- Support uploads of PDF/DOCX and run client-side text extraction.
- Add Markdown preview and export (PDF/HTML).
- Add shareable links with expiring tokens.
- Add role-based templates (“for execs”, “for engineers”, “only action items”) as quick presets.
- Add rate limiting and basic auth if you plan to expose the app publicly.

## Deployed Link (fill after deploy)
- **URL:** _<paste your working deployed URL here>_
