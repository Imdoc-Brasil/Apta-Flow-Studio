import type { Metadata } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'
import { Toaster } from '@/components/ui/toaster'
import { FirebaseClientProvider } from '@/firebase'

const fontBody = Inter({
  subsets: ['latin'],
  variable: '--font-body',
})

const fontHeadline = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-headline',
})

export const metadata: Metadata = {
  title: 'AptaFlow',
  description: 'Otimize sua entrega de serviços',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='pt-BR'>
      <body
        className={cn(
          'min-h-screen font-body antialiased',
          fontBody.variable,
          fontHeadline.variable
        )}
        suppressHydrationWarning={true}
      >
        <FirebaseClientProvider>{children}</FirebaseClientProvider>
        <Toaster />
      </body>
    </html>
  )
}
