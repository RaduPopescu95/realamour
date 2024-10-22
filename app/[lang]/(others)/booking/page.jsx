










import Brands from '@/components/common/Brands'
import Calendar from '@/components/common/Calendar'

import PageLinks from '@/components/common/PageLinks'
import PaymentSuccessPage from '@/components/common/PlataFinalizata'
import Preloader from '@/components/common/Preloader'
import Pricing from '@/components/common/Pricing'

import FooterOne from '@/components/layout/footers/FooterOne'
import Header from '@/components/layout/headers/Header'

import React from 'react'
export const metadata = {
  title: 'Booking',
  description:
    'Booking',
  
}

export default function page() {
  return (
    <div className="main-content  ">
      <Preloader/>

        <Header/>
        <div className="content-wrapper js-content-wrapper overflow-hidden">
            <PageLinks/>
            <Calendar/>
            {/* <Brands/> */}
            {/* <FooterOne/> */}
        </div>

    </div>
  )
}
