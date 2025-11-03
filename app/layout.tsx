// app/layout.tsx
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'JobPrep Pro - AI-Powered Job Preparation Platform',
  description: 'Upload your resume, get AI analysis, and prepare for interviews with personalized assessments. Land your dream job with our comprehensive preparation platform.',
  keywords: 'job preparation, resume analysis, interview practice, career development, AI resume review',
  openGraph: {
    title: 'JobPrep Pro - AI-Powered Job Preparation',
    description: 'Get AI-powered resume analysis and interview preparation',
    type: 'website',
    locale: 'en_US',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <div className="min-h-screen bg-gray-50">
            {children}
          </div>
        </body>
      </html>
    </ClerkProvider>
  )
}