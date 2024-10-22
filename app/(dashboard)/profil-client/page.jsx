














import Preloader from '@/components/common/Preloader'
import Settings from '@/components/dashboard/SettingsClient/Settings'
import Sidebar from '@/components/dashboard/SidebarClient'
import HeaderDashboard from '@/components/layout/headers/HeaderDashboard'
import React from 'react'
export const metadata = {
  title: 'Profil-client',
  description:
    'Profil-client',
  
}
export default function page() {
  return (
    <div  className="barba-container" data-barba="container">
        <main  className="main-content">
        <Preloader/>
            <HeaderDashboard/>
            <div  className="content-wrapper js-content-wrapper overflow-hidden">
              <div id='dashboardOpenClose'  className="dashboard -home-9 js-dashboard-home-9">
                <div  className="dashboard__sidebar scroll-bar-1">
                    <Sidebar/>

                </div>
                <Settings/>
              </div>
          </div>
        </main>
    </div>
  )
}
