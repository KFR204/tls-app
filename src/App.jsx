import { useState, memo } from 'react'

import { SocketContext, socket } from './context/socket'

import Layout from './components/Layout'
import Signin from './components/Signin'
import Dashboard from './components/Dashboard'

const App = () => {
  const isAuthorized = localStorage.getItem('isAuthorized')
  const [signed, setSigned] = useState(isAuthorized === '1' ? true : false)

  return (
    <SocketContext.Provider value={socket}>
      <Layout>
        {
          signed
            ? <Dashboard setSigned={setSigned} />
            : <Signin setSigned={setSigned} />
        }
      </Layout>
    </SocketContext.Provider>
  )
}

export default memo(App)
