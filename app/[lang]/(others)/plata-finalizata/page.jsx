










import Brands from '@/components/common/Brands'

import PageLinks from '@/components/common/PageLinks'
import PaymentSuccessPage from '@/components/common/PlataFinalizata'
import Preloader from '@/components/common/Preloader'
import Pricing from '@/components/common/Pricing'

import FooterOne from '@/components/layout/footers/FooterOne'
import Header from '@/components/layout/headers/Header'

import React from 'react'
export const metadata = {
  title: 'One Time Payment',
  description:
    'One Time Payment',
  
}

export default function page() {
  return (
    <div className="main-content  ">
      <Preloader/>

        <Header/>
        <div className="content-wrapper js-content-wrapper overflow-hidden">
            <PageLinks/>
            <PaymentSuccessPage/>
            {/* <Brands/> */}
            {/* <FooterOne/> */}
        </div>

    </div>
  )
}
