import './globals.css';

export const metadata = {
  title: 'My Schedule App',
  description: 'Organize tasks, deadlines, and priorities',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <nav className="navbar">
          <a href="/">Home</a>
          <a href="/calendar">Calendar</a>
          <a href="/checklist">Checklist</a>
          <a href="/assignments">Assignments</a>
        </nav>
        <main className="page">{children}</main>
      </body>
    </html>
  );
}
