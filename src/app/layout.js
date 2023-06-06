import NavBar from './components/NavBar'
import { AuthProvider } from './context/authContext'
import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'DSi Cafeteria',
  description: 'DSi Cafeteria occupancy counter',
}

export default function RootLayout({ children }) {
  return (
    <AuthProvider>
      <html lang="en">
        <body className={inter.className}>
          <NavBar />
          {children}
        </body>
      </html>
    </AuthProvider>
  )
}
