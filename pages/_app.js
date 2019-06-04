import App, {Container} from 'next/app'
import Head from 'next/head'
import React from 'react'
import {Provider} from 'react-redux'

import {setQueryString} from 'lib/actions'
import {isAuthenticated} from 'lib/auth'
import {timer} from 'lib/utils/metric'
import getReduxStore from 'lib/store'

/**
 * Provides the redux store and provider for all pages.
 */
export default class extends App {
  static async getInitialProps({Component, ctx}) {
    const timeApp = timer('App.getInitialProps')
    // Provide the store to `getInitialProps` of pages
    ctx.reduxStore = getReduxStore()

    const timeAuth = timer('auth')
    // TODO wrap components that need Auth
    if (!isAuthenticated(ctx)) return {}
    timeAuth.end()

    // Run `getInitialProps`
    let initialProps = {}
    if (Component.getInitialProps) {
      initialProps = await Component.getInitialProps(ctx)
    }

    // Set the query string in the store
    // TODO ideally stop duplicating this data in the store
    ctx.reduxStore.dispatch(setQueryString(ctx.query))

    // Always pass the path information
    const pageProps = {
      ...initialProps,
      ...(ctx.query || {}),
      pathname: ctx.pathname,
      query: ctx.query,
      asPath: ctx.asPath
    }

    // Get the state
    const initialReduxState = ctx.reduxStore.getState()

    timeApp.end()
    return {pageProps, initialReduxState}
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
          <title key='title'>Conveyal Analysis</title>
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
