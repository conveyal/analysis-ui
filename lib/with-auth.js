import {Box} from '@chakra-ui/core'
import Head from 'next/head'
import React from 'react'

import LoadingScreen from './components/loading-screen'
import {useFetchUser, UserContext} from './user'

// Check if the passed in group matches the environment variable
const isAdmin = (user) =>
  user && user.accessGroup === process.env.ADMIN_ACCESS_GROUP

// DEV Bar Style
const DevBar = () => (
  <Box
    className='DEV'
    mt='-4px'
    position='absolute'
    width='100vw'
    zIndex='10000'
  />
)

/**
 * Ensure that a Page component is authenticated before rendering.
 */
export default function withAuth(PageComponent) {
  return function AuthenticatedComponent(p) {
    const {user} = useFetchUser({required: true})
    if (!user) return <LoadingScreen />
    return (
      <UserContext.Provider value={user}>
        {isAdmin(user) && (
          <>
            <Head>
              <style id='DEVSTYLE'>{`.DEV{display: inherit !important;}`}</style>
            </Head>
            <DevBar />
          </>
        )}
        <PageComponent {...p} />
      </UserContext.Provider>
    )
  }
}
