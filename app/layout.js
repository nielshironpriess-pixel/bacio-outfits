import './globals.css';
export const metadata = { title: 'Bacio Outfit Generator', description: 'Outfits til TikTok bygget rundt om Bacios tees med rigtige produkter.' };
export default function RootLayout({ children }) {
  return (
    <html lang="da">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,800&family=Gluten:wght@700&display=swap" />
      </head>
      <body>{children}</body>
    </html>
  );
}
