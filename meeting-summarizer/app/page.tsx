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
      if (!res.ok) throw new Error('Failed to generate summary');
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
      if (!res.ok) throw new Error('Failed to send email');
      setMessage('✅ Email sent successfully.');
    } catch (e: any) {
      setMessage(`❌ ${e.message || 'Something went wrong'}`);
    } finally {
      setEmailSending(false);
    }
  }

  function copyToClipboard() {
    if (!summary) return;
    navigator.clipboard.writeText(summary).then(() => {
      setMessage('📋 Summary copied to clipboard.');
      setTimeout(() => setMessage(null), 2500);
    });
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 py-12">
      <div className="max-w-3xl mx-auto px-6 space-y-10">
        {/* Header */}
        <header className="text-center space-y-3">
          <h1 className="text-4xl font-bold text-blue-800">AI Meeting Summarizer</h1>
          <p className="text-blue-600 text-lg">
            Upload transcripts, generate AI summaries, and share via email.
          </p>
        </header>

        {/* Transcript Section */}
        <section className="bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl p-6 space-y-4 border border-sky-100">
          <h2 className="text-lg font-semibold text-blue-700">Transcript</h2>

          <div className="space-y-2">
            <label className="block text-sm text-blue-600">Upload .txt transcript</label>
            <input
              type="file"
              accept=".txt"
              onChange={handleFileChange}
              className="text-sm text-blue-600"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm text-blue-600">Or paste transcript</label>
            <textarea
              rows={8}
              className="w-full p-3 border border-sky-200 rounded-xl focus:ring-2 focus:ring-sky-400 bg-sky-50/50"
              placeholder="Paste meeting transcript here..."
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
            />
          </div>

          <div className="flex items-end gap-4">
            <div className="flex-1 space-y-2">
              <label className="block text-sm text-blue-600">Instruction / Prompt</label>
              <input
                className="w-full p-3 border border-sky-200 rounded-xl focus:ring-2 focus:ring-sky-400 bg-sky-50/50"
                value={instruction}
                onChange={(e) => setInstruction(e.target.value)}
              />
            </div>
            <button
              onClick={generateSummary}
              disabled={loading || !transcript.trim()}
              className="px-6 py-3 rounded-xl bg-sky-500 text-white font-medium hover:bg-sky-600 disabled:opacity-50 transition"
            >
              {loading ? 'Generating…' : 'Generate'}
            </button>
          </div>
        </section>

        {/* Summary Section */}
        <section className="bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl p-6 space-y-4 border border-sky-100">
          <h2 className="text-lg font-semibold text-blue-700">Summary</h2>
          <textarea
            rows={10}
            className="w-full p-3 border border-sky-200 rounded-xl focus:ring-2 focus:ring-sky-400 bg-sky-50/50"
            placeholder="Generated summary will appear here…"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          />
          <button
            onClick={copyToClipboard}
            disabled={!summary}
            className="px-4 py-2 rounded-xl bg-blue-100 hover:bg-blue-200 text-blue-800 font-medium disabled:opacity-50"
          >
            📋 Copy to clipboard
          </button>
        </section>

        {/* Email Section */}
        <section className="bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl p-6 space-y-4 border border-sky-100">
          <h2 className="text-lg font-semibold text-blue-700">Send via Email</h2>

          <div className="space-y-2">
            <label className="block text-sm text-blue-600">Recipients</label>
            <input
              className="w-full p-3 border border-sky-200 rounded-xl focus:ring-2 focus:ring-sky-400 bg-sky-50/50"
              value={recipients}
              onChange={(e) => setRecipients(e.target.value)}
              placeholder="alice@example.com, bob@example.com"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm text-blue-600">Subject</label>
            <input
              className="w-full p-3 border border-sky-200 rounded-xl focus:ring-2 focus:ring-sky-400 bg-sky-50/50"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <button
            onClick={sendEmail}
            disabled={emailSending || !summary || !recipients.trim()}
            className="w-full px-6 py-3 rounded-xl bg-sky-500 text-white font-medium hover:bg-sky-600 disabled:opacity-50 transition"
          >
            {emailSending ? 'Sending…' : 'Send Email'}
          </button>
        </section>

        {/* Messages */}
        {message && (
          <div className="text-center text-sm text-blue-800 bg-blue-50 py-2 px-4 rounded-xl border border-blue-200">
            {message}
          </div>
        )}
      </div>
    </main>
  );
}
