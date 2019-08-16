import Router from 'next/router'

import {isAuthenticated} from 'lib/auth'
import {timer} from 'lib/utils/metric'

export default async function checkAuth(ctx) {
  const timeAuth = timer('auth')
  try {
    await isAuthenticated(ctx)
  } catch (e) {
    // User is not logged in, redirect to login
    if (process.browser) {
      Router.push({
        pathname: '/login',
        query: {
          redirectTo: Router.route
        }
      })
    } else {
      ctx.res.writeHead(302, {
        Location: `/login?redirectTo=${ctx.asPath}`
      })
      ctx.res.end()
    }

    throw e
  } finally {
    timeAuth.end()
  }
}
