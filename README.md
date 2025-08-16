
# 📝 Briefly – Meeting Summarizer

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)](https://briefly-mu.vercel.app/)

**Briefly** is a minimalistic and elegant web app that helps you **summarize meeting transcripts** into concise notes.
It supports **uploading transcripts, generating summaries, and sharing via email** for seamless productivity.

🔗 **Live Demo:** [briefly-mu.vercel.app](https://briefly-mu.vercel.app/)

---

## 🚀 Features

* 🎤 **Upload Meeting Transcript** – Paste or upload raw text from meetings.
* ✨ **AI-Powered Summarization** – Generates concise, structured notes.
* 📧 **Email Integration** – Share summaries instantly with team members.
* 🎨 **Modern UI** – Minimalistic design with smooth colors and responsive layout.
* ☁️ **Deployed on Vercel** – Fast, secure, and scalable hosting.

---

## 🖼️ Preview

![App Screenshot](https://i.ibb.co/5Tqx9p7/briefly-preview.png) <!-- Replace with your real screenshot if needed -->

---

## ⚙️ Tech Stack

* **Frontend:** Next.js, React, Tailwind CSS, ShadCN UI
* **Backend:** Next.js API Routes, Node.js
* **Email Service:** Resend API / Nodemailer (SMTP fallback)
* **Deployment:** Vercel

---

## 🛠️ Setup & Installation

Clone the repo:

```bash
git clone https://github.com/<your-username>/briefly.git
cd briefly
```

Install dependencies:

```bash
npm install
```

Set up environment variables in `.env.local`:

```env
# Resend API (preferred)
RESEND_API_KEY=your_resend_api_key
RESEND_FROM=Briefly <no-reply@yourdomain.com>

# SMTP fallback
SMTP_HOST=smtp.yourmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email_user
SMTP_PASS=your_email_password
SMTP_FROM=Briefly <no-reply@yourdomain.com>
```

Run locally:

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

---

## 📤 Deployment

This app is deployed on **Vercel**. To deploy your own version:

```bash
npm run build
vercel deploy
```

Or connect the GitHub repo directly to Vercel for auto-deploys.

---

## 📧 Contact

For support, questions, or contributions, feel free to open an issue or contact the maintainer.

---

✨ Built with ❤️ to make meetings more productive.


