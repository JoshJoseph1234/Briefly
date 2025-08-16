# AI Meeting Summarizer & Sharer

A super-minimal full-stack Next.js app. Paste or upload a text transcript, add a custom instruction, generate an AI summary (Groq by default), edit it, and send via email (Resend or SMTP). Focus is pure functionality.

## 1) Quickstart (Local)

```bash
pnpm i   # or npm i / yarn
cp .env.example .env
# Add your keys:
# - GROQ_API_KEY (recommended)
# - RESEND_API_KEY (recommended) or SMTP_* for fallback
pnpm dev
# open http://localhost:3000
```

Groq models: default is `llama3-70b-8192` (override with `GROQ_MODEL`). Optional OpenAI fallback if you set `OPENAI_API_KEY`.

## 2) Deploy (Vercel)

- Create a new Vercel project from this repo.
- Add environment variables in Project Settings → Environment Variables:
  - `GROQ_API_KEY`
  - `GROQ_MODEL` (optional)
  - `RESEND_API_KEY` and `RESEND_FROM` (recommended), or SMTP_* values
  - (optional) `OPENAI_API_KEY`
- Deploy.
- Test the deployed URL and share it as your assignment link.

## 3) Architecture

- **Next.js (App Router)** for both frontend and backend API routes.
- **/api/summarize** calls Groq (or OpenAI fallback) to produce a Markdown summary.
- **/api/send-email** sends the edited summary by email (Resend preferred; SMTP fallback).
- **Frontend** is intentionally basic: a file input, textareas, and buttons.

## 4) Notes

- Only `.txt` uploads are supported (keeps scope tight). For other formats (PDF/DOCX), convert to text first.
- The summary textarea is fully editable before sending.
- Keep the UI minimal per assignment requirement.
