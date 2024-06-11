// ** React Imports
import { ReactNode } from 'react'

import BlankLayout from 'src/@core/layouts/BlankLayout'
import LandingMain from 'src/views/landing/LandingMain'

/**
 *  Set Home URL based on User Roles
 */
export const getHomeRoute = (role: string[]) => {
  return '/dashboard'
}

const Home = () => {

  return <LandingMain />
}

Home.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default Home
