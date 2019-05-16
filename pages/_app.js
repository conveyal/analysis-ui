import get from 'lodash/get'
import App, {Container} from 'next/app'
import Head from 'next/head'
import Router from 'next/router'
import nextCookies from 'next-cookies'
import React from 'react'
import {Provider} from 'react-redux'

import {setUser} from 'lib/actions'
import {authIsRequired, COOKIE_KEY, isAuthenticated} from 'lib/auth'
import {LOGO_URL, RouteTo} from 'lib/constants'
import getReduxStore from 'lib/store'

import 'bootstrap/dist/css/bootstrap.css'
import '../static/styles.css'

// Safely parse user data from the cookie
function getUserFromCookie(cookie) {
  try {
    return JSON.parse(get(cookie, COOKIE_KEY, {}))
  } catch (e) {
    console.error(e)
    return {}
  }
}

// Ignore auth on certain URLs
const ignoreAuth = p =>
  [RouteTo.login, RouteTo.logout, RouteTo.authCallback].indexOf(p) > -1

/**
 * Provides the redux store and provider for all pages.
 */
export default class AnalysisNextApp extends App {
  static async getInitialProps({Component, ctx}) {
    const reduxStore = getReduxStore()

    // Handle auth
    if (authIsRequired && !ignoreAuth(ctx.pathname)) {
      // Parse cookies
      const user = getUserFromCookie(nextCookies(ctx))
      if (!isAuthenticated(user.expiresAt)) {
        // redirect to login
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
        return {}
      } else {
        reduxStore.dispatch(setUser(user))
      }
    }

    // Provide the store to `getInitialProps` of pages
    ctx.reduxStore = reduxStore

    // Run `getInitialProps`
    let initialProps = {}
    if (Component.getInitialProps) {
      initialProps = await Component.getInitialProps(ctx)
    }

    // Always pass the path information
    const pageProps = {
      ...initialProps,
      pathname: ctx.pathname,
      query: ctx.query,
      asPath: ctx.asPath
    }

    return {
      pageProps,
      initialReduxState: reduxStore.getState()
    }
  }

  constructor(props) {
    super(props)
    this.reduxStore = getReduxStore(props.initialReduxState)
  }

  render() {
    const p = this.props
    return (
      <>
        <Head>
          <title>
            {get(p, 'initialReduxState.title', 'Conveyal Analysis')}
          </title>
          <link rel='shortcut icon' href={LOGO_URL} type='image/x-icon' />
        </Head>
        <Container>
          <Provider store={this.reduxStore}>
            <p.Component {...p.pageProps} />
          </Provider>
        </Container>
      </>
    )
  }
}
