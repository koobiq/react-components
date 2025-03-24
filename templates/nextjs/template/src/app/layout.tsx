import type { Metadata } from 'next';

import './globals.css';
import '@koobiq/design-tokens/web/css-tokens.css';
import '@koobiq/design-tokens/web/css-tokens-light.css';
import '@koobiq/design-tokens/web/css-tokens-dark.css';
import '@koobiq/react-components/style.css';

// Global font imports (Inter & JetBrains Mono) – see usage guide: https://react.koobiq.io/?path=/docs/fonts--docs
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/inter/400-italic.css';
import '@fontsource/inter/500-italic.css';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/700.css';

import { ThemeProvider } from 'next-themes';

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
