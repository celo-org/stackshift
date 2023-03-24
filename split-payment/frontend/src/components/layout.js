import React from 'react'
import Content from './content'
import Footer from './footer'
import Header from './header'

export default function Layout() {
  return (
    <div className='flex flex-col h-screen'>
      <Header />
      <Content/>
      <Footer/>
    </div>
  )
}
