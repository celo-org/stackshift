import React, { useEffect } from 'react'
import CreatorSection from './CreatorSection'
import FeaturedCreators from './FeaturedCreators'
import Hero from './Hero'
import PartnerSection from './PartnerSection'
import Supporter from './Supporter'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import SocialConnectSection from './SocialConnectSection'

export default function Content(): JSX.Element {
  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <div>
        <Hero />
        <SocialConnectSection/>
        <CreatorSection />
        <FeaturedCreators />
        <Supporter />
        <PartnerSection/>
      </div>
   </QueryClientProvider>

  )
}
