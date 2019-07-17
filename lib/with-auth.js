import Router from 'next/router'

import {isAuthenticated} from 'lib/auth'
import {timer} from 'lib/utils/metric'

export default function withAuth(Component) {
  const getInitialProps = Component.getInitialProps
  Component.getInitialProps = async ctx => {
    const timeAuth = timer('auth')
    const authenticated = await isAuthenticated(ctx)
    timeAuth.end()

    if (!authenticated) {
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
      return {} // redirecting to login screen...
    }

    return await getInitialProps(ctx)
  }
}
