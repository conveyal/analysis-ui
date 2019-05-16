import React from 'react'

import {logout} from 'lib/auth'

export default function Logout() {
  // On client side mount
  React.useEffect(() => {
    logout()
  }, [])

  return null
}
