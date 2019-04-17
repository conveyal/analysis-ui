import App, {Container} from 'next/app'
import Head from 'next/head'
import React from 'react'
import {Provider} from 'react-redux'

import getReduxStore from '../lib/store'

import 'bootstrap/dist/css/bootstrap.css'
import '../styles.css'

const iconLink = 'https://d2f1n6ed3ipuic.cloudfront.net/conveyal-128x128.png'

/**
 * Provides the redux store and provider for all pages.
 */
export default class AnalysisNextApp extends App {
  static async getInitialProps(appContext) {
    const reduxStore = getReduxStore()

    // Provide the store to `getInitialProps` of pages
    appContext.ctx.reduxStore = reduxStore

    return {
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
          <title>{p.initialReduxState.title || 'Conveyal Analysis'}</title>
          <link rel='shortcut icon' href={iconLink} type='image/x-icon' />
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
