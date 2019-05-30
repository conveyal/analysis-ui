import React from 'react'

import {logout} from 'lib/auth'
import LoadingScreen from 'lib/components/loading-screen'

export default function Logout() {
  // On client side mount
  React.useEffect(() => {
    logout()
  }, [])

  return <LoadingScreen />
}
