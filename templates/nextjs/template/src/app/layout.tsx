import type { Metadata } from 'next';

import './globals.css';
import '@koobiq/design-tokens/web/css-tokens.css';
import '@koobiq/design-tokens/web/css-tokens-light.css';
import '@koobiq/design-tokens/web/css-tokens-dark.css';
import '@koobiq/react-components/style.css';

import { ThemeProvider } from 'next-themes';

import { PreloadResources } from './preload-resources';

export const metadata: Metadata = {
  title: 'Koobiq React – Next.js App Example',
  description: 'Generated by create next app',
  icons: {
    icon: './favicon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <PreloadResources />
      <body>
        <ThemeProvider
          attribute="class"
          enableSystem={false}
          defaultTheme="kbq-dark"
          themes={['kbq-dark', 'kbq-light']}
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
