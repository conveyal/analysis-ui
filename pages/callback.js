import Router from 'next/router'
import React from 'react'
import {useDispatch} from 'react-redux'

import {setUser} from 'lib/actions'
import {handleAuth0Callback} from 'lib/auth'
import LoadingScreen from 'lib/components/loading-screen'
import {RouteTo} from 'lib/constants'

export default function Callback() {
  const dispatch = useDispatch()

  React.useEffect(() => {
    handleAuth0Callback()
      .then((userData) => {
        dispatch(setUser(userData))
        Router.push(Router.query.redirectTo || '/')
      })
      .catch(() => {
        Router.push({
          pathname: RouteTo.login,
          query: Router.query
        })
      })
  }, [dispatch])

  return <LoadingScreen />
}
