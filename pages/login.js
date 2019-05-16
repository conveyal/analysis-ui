import React from 'react'

import {login} from 'lib/auth'
import LoadingScreen from 'lib/components/loading-screen'

export default function Login() {
  React.useEffect(() => {
    login()
  }, [])

  return <LoadingScreen />
}
