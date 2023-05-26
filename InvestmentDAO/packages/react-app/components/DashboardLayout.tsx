import { FC, ReactNode } from 'react'
import Footer from './Footer'
import DashboardHeader from './DashboardHeader'

interface Props {
  children: ReactNode
}
const GuestLayout: FC<Props> = ({children}) => {
  return (
    <>
      <div className="overflow-hidden flex flex-col min-h-screen">
        <DashboardHeader />
        <div className="py-16 max-w-7xl mx-auto space-y-8 sm:px-6 lg:px-8">
          {children}
        </div>
        <Footer />
      </div>
    </>
  )
}

export default GuestLayout;