import Image from 'next/image'
import Proposals from '@/components/Proposals'

const App = () => {

  return (

    <>
      <div className="flex items-center">
        <div className="flex-1">
          <h1 className="font-extrabold text-5xl">Explore Investment Opportunities</h1>
          <p className="my-8">
            Once you're a member, you gain access to our curated investment opportunities. Explore our portfolio,
            read in-depth project analyses, and stay updated on the latest market trends.
          </p>
        </div>
        <Image className="flex-1 w-16 md:w-32 lg:w-48" src={require('/assets/img/app-hero.png')}/>
      </div>

      <Proposals />

    </>
  )
}

export default App