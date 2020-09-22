import fpHas from 'lodash/fp/has'
import {NextComponentType} from 'next'
import App, {NextWebVitalsMetric} from 'next/app'
import Head from 'next/head'
import Router from 'next/router'
import React, {ComponentType, ErrorInfo} from 'react'
import {SWRConfig} from 'swr'

import ChakraTheme from 'lib/chakra'
import ErrorModal from 'lib/components/error-modal'
import * as gtag from 'lib/gtag'
import LogRocket from 'lib/logrocket'
import {swrConfig} from 'lib/utils/safe-fetch'

import 'simplebar/dist/simplebar.css'
import '../styles.css'

// Log page views if tracking ID is provided
if (process.env.NEXT_PUBLIC_GA_TRACKING_ID) {
  // Log all page views
  Router.events.on('routeChangeComplete', (url) => {
    gtag.pageView(url)
  })
}

// Re-use for Component's without a Layout
const EmptyLayout = ({children}) => <>{children}</>

// Components that have a layout
type ComponentWithLayout = NextComponentType & {
  Layout: ComponentType
}

// Check if a component has a Layout
const hasLayout = fpHas('Layout')

export default class ConveyalAnalysis extends App {
  state = {
    error: null
  }

  componentDidCatch(err: Error, info: ErrorInfo): void {
    LogRocket.captureException(err, {extra: {...info}})
  }

  static getDerivedStateFromError(error: Error): {error: Error} {
    return {error}
  }

  render(): JSX.Element {
    const {Component, pageProps} = this.props
    const Layout = hasLayout(Component)
      ? (Component as ComponentWithLayout).Layout
      : EmptyLayout
    return (
      <ChakraTheme>
        <SWRConfig value={swrConfig}>
          <Head>
            <title key='title'>Conveyal Analysis</title>
          </Head>
          {this.state.error ? (
            <ErrorModal
              error={this.state.error}
              clear={() => this.setState({error: null})}
              title='Application error'
            />
          ) : (
            <Layout>
              <Component {...pageProps} />
            </Layout>
          )}
        </SWRConfig>
      </ChakraTheme>
    )
  }
}

/**
 * Track UI performance. Learn more here: https://nextjs.org/docs/advanced-features/measuring-performance
 */
export function reportWebVitals(metric: NextWebVitalsMetric) {
  if (process.env.NEXT_PUBLIC_GA_TRACKING_ID) {
    gtag.event({
      category:
        metric.label === 'web-vital' ? 'Web Vitals' : 'Next.js custom metric',
      label: metric.id, // id unique to current page load
      name: metric.name,
      value: Math.round(
        metric.name === 'CLS' ? metric.value * 1000 : metric.value
      ) // values must be integers
    })
  }
}
