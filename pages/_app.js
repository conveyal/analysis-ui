import App, {Container} from 'next/app'
import Head from 'next/head'
import React from 'react'
import {Provider} from 'react-redux'

import {setQueryString} from 'lib/actions'
import {isAuthenticated} from 'lib/auth'
import {LOGO_URL} from 'lib/constants'
import getReduxStore from 'lib/store'

import 'bootstrap/dist/css/bootstrap.css'
import '../static/styles.css'

/**
 * Provides the redux store and provider for all pages.
 */
export default class AnalysisNextApp extends App {
  static async getInitialProps({Component, ctx}) {
    // Provide the store to `getInitialProps` of pages
    ctx.reduxStore = getReduxStore()

    // TODO wrap components that need Auth
    if (!isAuthenticated(ctx)) return {}

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

    return {
      pageProps,
      initialReduxState: ctx.reduxStore.getState()
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
          <title>Conveyal Analysis</title>
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
