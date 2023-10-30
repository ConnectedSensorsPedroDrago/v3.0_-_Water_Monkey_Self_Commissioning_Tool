import './globals.css'
import { Fira_Sans } from 'next/font/google'
import { UserProvider } from '../context/userContext'

const firasans = Fira_Sans({ 
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  style: 'normal',
  subsets: ['latin-ext'],
  variable: "--font-firasans"
})

export const metadata = {
  title: 'Connected Sensors | Water Monkey - Self Commissioning Tool',
  description: 'Connected Sensors - Water Monkey Self Commissioning Tool',
  icons: {
    icon: '/public/cs.png',
  },
}


export default async function RootLayout({ children  }) {

  return (
    <html lang="en">
      <UserProvider>
          <body className={`${firasans.variable} font-sans`}>
              {children}
          </body>
      </UserProvider>
    </html>
  )
}
