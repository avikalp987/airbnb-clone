import './globals.css'
import type { Metadata } from 'next'
import { Nunito } from 'next/font/google'
import Navbar from './components/navbar/Navbar'
import ClientOnly from './components/ClientOnly'
import RegisterModal from './components/modals/RegisterModal'
import ToasterProvider from './providers/ToasterProvider'
import LoginModal from './components/modals/LoginModal'
import getCurrentUser from './actions/getCurrentUser'

const font = Nunito({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Airbnb',
  description: 'This Airbnb clone is developed for educational and practice purposes. It will never be released. So please no legal actions must be taken against it.',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  //getting the current user while loading the main site
  const currentUser = await getCurrentUser()

  return (
    <html lang="en">
      <body className={font.className}>
        <ClientOnly>
          <ToasterProvider />
          <LoginModal />
          <RegisterModal />
          <Navbar 
            currentUser={currentUser}
          />
        </ClientOnly>
        {children}
      </body>
    </html>
  )
}
