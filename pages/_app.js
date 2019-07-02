import App, {Container} from 'next/app'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import React from 'react'
import {Provider} from 'react-redux'

import {setQueryString} from 'lib/actions'
import {isAuthenticated} from 'lib/auth'
import Dock from 'lib/components/dock'
import LoadingScreen from 'lib/components/loading-screen'
import Sidebar from 'lib/components/sidebar'
import State from 'lib/components/state'
import {timer} from 'lib/utils/metric'
import getReduxStore from 'lib/store'

const ErrorModal = dynamic(() => import('lib/components/error-modal'))
const Map = dynamic(() => import('lib/components/map'), {
  loading: () => <LoadingScreen />,
  ssr: false
})

/**
 * Function to check if the path needs the map.
 */
const pathUsesMap = path =>
  ['/admin', '/callback', '/login', '/logout', '/', '/report'].indexOf(path) ===
  -1

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
    const authenticated = await isAuthenticated(ctx)
    if (!authenticated) return {} // redirecting to login screen...
    timeAuth.end()

    // Set the query string in the store
    // TODO ideally stop duplicating this data in the store
    ctx.reduxStore.dispatch(setQueryString(ctx.query))

    // Run `getInitialProps`
    let initialProps = {}
    if (Component.getInitialProps) {
      try {
        initialProps = await Component.getInitialProps(ctx)
      } catch (e) {
        console.error(e)
        if (ctx.res) {
          ctx.res.writeHead(302, {
            Location: `/login?redirectTo=${ctx.asPath}`
          })
          ctx.res.end()
        }
        return
      }
    }

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
    this.timer = timer('App.componentDidMount')
    this.reduxStore = getReduxStore(props.initialReduxState)
  }

  componentDidCatch(err) {
    console.error(err)
  }

  componentDidMount() {
    this.timer.end()
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
            <ErrorModal />

            {pathUsesMap(p.router.pathname) ? (
              <>
                <Sidebar />
                <ComponentWithMap {...p} />
              </>
            ) : (
              <p.Component {...p.pageProps} />
            )}
          </Provider>
        </Container>
      </>
    )
  }
}

const noopFragment = () => <React.Fragment />

/**
 * Components are rendered this way so that the map does not get unmounted
 * and remounted on each page change. There is probably a better way to do this
 * but I have not figured out a better solution yet.
 */
function ComponentWithMap(p) {
  const isAnalysis = p.router.pathname === '/analysis'
  return (
    <State initialState={noopFragment}>
      {(mapChildren, setMapChildren) => (
        <>
          <div className={`Fullscreen ${isAnalysis ? 'analysisMode' : ''}`}>
            <Map>{mapChildren}</Map>
          </div>
          <Dock className={isAnalysis ? 'analysisMode' : ''}>
            <p.Component {...p.pageProps} setMapChildren={setMapChildren} />
          </Dock>
        </>
      )}
    </State>
  )
}
