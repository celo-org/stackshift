import { useSession, signIn, signOut } from "next-auth/react"
import React, { useState, useEffect } from "react"

export default function TwitterConnect() {
  const { data: session, status } = useSession()

  if (session) {
    return (
      <>
        Signed in as {session && session.user?.email} <br />
        <button className="bg-yellow-500 p-2 rounded-lg mr-2" onClick={() => signOut()}>Sign out</button>
      </>
    )
  }
  return (
    <>
      <button className="bg-blue-500 p-2 rounded-lg mr-2" onClick={() => signIn()}>Login With Twitter</button>
    </>
  )
}

