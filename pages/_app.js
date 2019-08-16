import App from 'next/app'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import withRedux from 'next-redux-wrapper'
import React from 'react'
import {Provider} from 'react-redux'

import {setQueryString} from 'lib/actions'
import State from 'lib/components/state'
import {timer} from 'lib/utils/metric'
import createStore from 'lib/store'

const Dock = dynamic(() => import('lib/components/dock'))
const ErrorModal = dynamic(() => import('lib/components/error-modal'))
const Map = dynamic(() => import('lib/components/map'), {ssr: false})
const Sidebar = dynamic(() => import('lib/components/sidebar'))

/**
 * Function to check if the path needs the map.
 */
const pathUsesMap = path => path.startsWith('/region')

/**
 * Provides the redux store and provider for all pages.
 */
export default withRedux(createStore)(
  class extends App {
    static async getInitialProps({Component, ctx}) {
      const timeApp = timer('App.getInitialProps')

      // Set the query string in the store
      // TODO ideally stop duplicating this data in the store
      ctx.store.dispatch(setQueryString(ctx.query))

      try {
        let initialProps = {}
        if (Component.getInitialProps) {
          initialProps = await Component.getInitialProps(ctx)
        }

        // Always pass the path information
        const pageProps = {
          ...initialProps,
          ...(ctx.query || {}),
          query: ctx.query
        }

        return {pageProps}
      } catch (e) {
        console.error('Error getting initial props', e)
        return {error: e}
      } finally {
        timeApp.end()
      }
    }

    componentDidCatch(err) {
      console.error(err)
    }

    render() {
      const p = this.props
      return (
        <>
          <Provider store={p.store}>
            <Head>
              <title key='title'>Conveyal Analysis</title>
            </Head>
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
        </>
      )
    }
  }
)

const noopFragment = () => <React.Fragment />

/**
 * Components are rendered this way so that the map does not get unmounted
 * and remounted on each page change. There is probably a better way to do this
 * but I have not figured out a better solution yet.
 */
function ComponentWithMap(p) {
  return (
    <State initialState={noopFragment}>
      {(mapChildren, setMapChildren) => (
        <>
          <div className='Fullscreen'>
            <Map>{mapChildren}</Map>
          </div>
          <Dock>
            <p.Component {...p.pageProps} setMapChildren={setMapChildren} />
          </Dock>
        </>
      )}
    </State>
  )
}
