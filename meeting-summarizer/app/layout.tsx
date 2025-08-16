export const metadata = {
  title: "AI Meeting Summarizer",
  description: "Upload a transcript, add instructions, generate and share summaries via email."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
