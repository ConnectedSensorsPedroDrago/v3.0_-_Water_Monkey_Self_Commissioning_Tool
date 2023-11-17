
import NavBar from '@/src/components/navbar/page'
import { getServerSession } from 'next-auth'
import { options } from '../api/auth/[...nextauth]/options'


export default async function RootLayout({ children }) {

  const session = await getServerSession(options)

  return (
    <>
            { session && 
                <NavBar session={session}/> 
            }

                {children}
    </>
  )
}
