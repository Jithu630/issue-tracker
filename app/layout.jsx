import "./globals.css";

export const metadata = {
  title: "Issue Tracker",
  description: "Minimal issue tracker built with Next.js and Supabase",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        style={{
          fontFamily:
            "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        }}
        className="antialiased"
      >
        {children}
      </body>
    </html>
  );
}  