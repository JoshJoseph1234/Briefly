'use client';

import { useState } from 'react';

type SummarizeResponse = {
  summary: string;
};

export default function Home() {
  const [transcript, setTranscript] = useState('');
  const [instruction, setInstruction] = useState('Summarize in bullet points for executives');
  const [summary, setSummary] = useState('');
  const [recipients, setRecipients] = useState('');
  const [subject, setSubject] = useState('Meeting Summary');
  const [loading, setLoading] = useState(false);
  const [emailSending, setEmailSending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    setTranscript(text);
  }

  async function generateSummary() {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript, instruction }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || 'Failed to generate summary');
      }
      const data = (await res.json()) as SummarizeResponse;
      setSummary(data.summary);
    } catch (e: any) {
      setMessage(e.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  async function sendEmail() {
    setEmailSending(true);
    setMessage(null);
    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipients, subject, body: summary }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || 'Failed to send email');
      }
      setMessage('Email sent successfully.');
    } catch (e: any) {
      setMessage(e.message || 'Something went wrong');
    } finally {
      setEmailSending(false);
    }
  }

  function copyToClipboard() {
    if (!summary) return;
    navigator.clipboard.writeText(summary).then(() => {
      setMessage('Summary copied to clipboard.');
      setTimeout(() => setMessage(null), 2500);
    });
  }

  return (
    <div className="container">
      <h1>AI Meeting Summarizer</h1>
      <p className="small">
        Upload a text transcript, add custom instructions, generate a summary, edit it, then share via email.
      </p>

      <div className="card" style={{ marginBottom: 16 }}>
        <label htmlFor="file">Upload .txt transcript (optional)</label>
        <input id="file" type="file" accept=".txt" onChange={handleFileChange} />
        <label htmlFor="transcript">Or paste transcript</label>
        <textarea id="transcript" rows={10} placeholder="Paste meeting or call transcript here..." value={transcript} onChange={(e) => setTranscript(e.target.value)} />
        <div className="row">
          <div>
            <label htmlFor="instruction">Instruction / Prompt</label>
            <input id="instruction" value={instruction} onChange={(e) => setInstruction(e.target.value)} placeholder="e.g., Summarize action items only" />
          </div>
          <div style={{ display: 'flex', alignItems: 'end' }}>
            <button onClick={generateSummary} disabled={loading || !transcript.trim()}>
              {loading ? 'Generating…' : 'Generate Summary'}
            </button>
          </div>
        </div>
        {message && <div className="small">{message}</div>}
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <label htmlFor="summary">Editable Summary (Markdown)</label>
        <textarea id="summary" rows={14} placeholder="Generated summary will appear here and is fully editable…" value={summary} onChange={(e) => setSummary(e.target.value)} />
        <div className="row">
          <button onClick={copyToClipboard} disabled={!summary}>Copy to clipboard</button>
          <div />
        </div>
      </div>

      <div className="card">
        <label htmlFor="recipients">Email recipients (comma separated)</label>
        <input id="recipients" value={recipients} onChange={(e) => setRecipients(e.target.value)} placeholder="alice@example.com, bob@example.com" />
        <label htmlFor="subject">Subject</label>
        <input id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
        <button onClick={sendEmail} disabled={emailSending || !summary || !recipients.trim()}>
          {emailSending ? 'Sending…' : 'Send Summary via Email'}
        </button>
      </div>
    </div>
  );
}
