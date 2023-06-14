import { Provider } from 'react-redux'
import NavBar from './components/NavBar'
import './globals.css'
import { Inter } from 'next/font/google'
import store from './store'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'DSi Cafeteria',
  description: 'DSi Cafeteria occupancy counter',
}

export default function RootLayout({ children }) {
  return (
    <Provider store={store}>
      <html lang="en">
        <body className={inter.className}>
          <NavBar />
          {children}
        </body>
      </html>
    </Provider>
  )
}
