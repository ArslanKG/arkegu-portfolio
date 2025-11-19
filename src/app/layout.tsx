import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { SessionProvider } from '@/components/SessionProvider'
import StructuredData from '@/components/StructuredData'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Arslan Kemal Gündüz | Senior Software Developer',
  description: 'Senior Software Developer specializing in .NET, Cloud, FinTech, and modern web technologies. Building scalable SaaS solutions and innovative applications.',
  keywords: ['software developer', 'react', 'nextjs', 'typescript', 'dotnet', 'cloud', 'fintech', 'saas', 'full-stack developer', 'yazılım geliştirici'],
  authors: [{ name: 'Arslan Kemal Gündüz' }],
  creator: 'Arslan Kemal Gündüz',
  publisher: 'Arslan Kemal Gündüz',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://arkegu.com.tr'),
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en',
      'tr-TR': '/tr',
    },
  },
  openGraph: {
    title: 'Arslan Kemal Gündüz | Senior Software Developer',
    description: 'Senior Software Developer specializing in .NET, Cloud, FinTech, and modern web technologies.',
    url: 'https://arkegu.com.tr',
    siteName: 'Arslan Kemal Gündüz Portfolio',
    images: [
      {
        url: '/images/arkegu-logo.png',
        width: 1200,
        height: 630,
        alt: 'Arslan Kemal Gündüz - Senior Software Developer',
      },
    ],
    locale: 'tr_TR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Arslan Kemal Gündüz | Senior Software Developer',
    description: 'Senior Software Developer specializing in .NET, Cloud, FinTech, and modern web technologies.',
    images: ['/images/arkegu-logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code', // Google Search Console'dan alınan kod buraya eklenecek
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <StructuredData 
          type="person" 
          data={{
            name: 'Arslan Kemal Gündüz',
            url: 'https://arkegu.com.tr',
            jobTitle: 'Senior Software Developer',
          }} 
        />
        <StructuredData 
          type="website" 
          data={{
            name: 'Arslan Kemal Gündüz Portfolio',
            url: 'https://arkegu.com.tr',
          }} 
        />
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-display antialiased bg-white dark:bg-background-dark`}>
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
