import App from 'next/app'
import Head from 'next/head'
import React from 'react'

import ChakraTheme from '../lib/chakra'
import {ErrorModal} from '../lib/components/error-modal'
import LogRocket from '../lib/logrocket'

import 'react-datetime/css/react-datetime.css'
import '../styles.css'

/**
 * Provides the redux store and provider for all pages.
 */
export default class ConveyalApp extends App {
  state = {}

  componentDidCatch(err, info) {
    LogRocket.captureException(err, {extras: info})
  }

  static getDerivedStateFromError(error) {
    return {error}
  }

  render() {
    const {Component, router} = this.props
    return (
      <ChakraTheme>
        <Head>
          <title key='title'>Conveyal Analysis</title>
        </Head>
        {this.state.error ? (
          <ErrorModal
            error={this.state.error}
            clear={() => this.setState({error: null})}
          />
        ) : Component.Layout ? (
          <Component.Layout query={router.query}>
            <Component query={router.query} />
          </Component.Layout>
        ) : (
          <Component query={router.query} />
        )}
      </ChakraTheme>
    )
  }
}
