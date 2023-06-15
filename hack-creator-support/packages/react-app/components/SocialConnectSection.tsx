import React, {useState, useEffect, useCallback} from 'react'
import People from '../images/people.png'
import Image from 'next/image'
import { registerIdentifier, revokeAttestation, accountAddressLookUp } from '@/SocialConnect/SocialConnect'  
import { useSession, signIn, signOut } from "next-auth/react"
import { useAccount } from 'wagmi'
import { MasaIntegration, masaConnectedAccount } from '@/SocialConnect/MasaIntegration'
import toast, { Toast } from 'react-hot-toast'

export default function SocialConnectSection() {
  const { address } = useAccount()
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [loadRevoke, setLoadRevoke] = useState(false)
  const [lookup, setLookup] = useState(false)
  const [masaAccount, setMasaAccount] = useState<string | undefined>("")

  const registerAttestation = async () => {
    try {
          setLoading(true)
        if (address && session?.user?.email) {
          await registerIdentifier(session?.user?.email, address)
          setLoading(false)
        } else {
            setLoading(false)
          toast("Ensure you are connected to both wallet")
        }
    } catch (error) {
      setLoading(false)
      toast(`Error occured ${error}`)
    }
  }

  const revoke = async () => {
    try {
          setLoadRevoke(true)
        if (address && session?.user?.email) {
          await revokeAttestation(session?.user?.email, address)
          setLoadRevoke(false)
        } else {
            setLoadRevoke(false)
          toast("Ensure you are connected to both wallet")
        }
    } catch (error) {
      setLoadRevoke(false)
      toast(`Error occured ${error}`)
    }
  }

   const accountLookup = async () => {
    try {
          setLookup(true)
        if (address && session?.user?.email) {
          const attestations = await accountAddressLookUp(session?.user?.email)
          console.log(attestations)
          setLookup(false)
        } else {
            setLookup(false)
          toast("Ensure you are connected to both wallet")
        }
    } catch (error) {
      setLookup(false)
      toast(`Error occured ${error}`)
    }
   }
  
  const getAddress = useCallback(async () => {
    const account = await masaConnectedAccount()
    setMasaAccount(account)
  },[])
  
  useEffect(() => {
    getAddress()
  }, [getAddress])
  
  return (
    <div className='my-36 text-slate-300' >
      <h1 className='text-3xl font-bold text-center my-8'>🥬  Social Connect Feature 🥬 </h1>
      <div className='grid grid-cols-2 justify-between'>
        <div>
          <p className='text-xl my-16'>
        Thanks to our partner Integrations. You can now receive support from your fans
        using your social identifier like your connected twitter account that is mapped
        to your connected wallet address.

        We have also provided you the option to connect using Masa.
        And also resolve your connected wallet address using the Masa resolve feature.
        And Get your self a soulbound name. i.e alex.celo.
        Click on the buttons below to link your address. 
        </p> 
        <div className='flex justify-left my-8 text-white'>
          <button onClick={registerAttestation} className='bg-green-400 p-4 rounded'>{ loading ? "Mapping please wait..." : "Map your Identifier"}</button>
          <button onClick={revoke} className='bg-blue-400 ml-2 p-4 rounded '>{loadRevoke ? "Revoking please wait..." : "Revoke Mapping"}</button>
          <button onClick={accountLookup} className='bg-yellow-400 ml-2 p-4 rounded '>{lookup ? "Looking up please wait..." : "Look up"}</button>
        </div>
        </div>
        <Image src={People} alt='connect' width={600} height={200}/>
      </div>
      
    </div>
  )
}
