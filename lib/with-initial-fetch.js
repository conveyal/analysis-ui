import React from 'react'
import {useStore} from 'react-redux'

import InnerDock from './components/inner-dock'
import Spinner from './components/spinner'
import Wait from './components/wait'

const spinnerStyle = {
  fontSize: '36px',
  left: '0',
  marginTop: '-18px',
  opacity: 0.5,
  position: 'absolute',
  textAlign: 'center',
  top: '50%',
  right: '0'
}

export default function withInitialFetch(Component, initialFetch) {
  if (typeof window === 'undefined') {
    Component.getInitialProps = async ctx => {
      return await initialFetch(ctx.reduxStore, ctx.query)
    }

    return Component
  } else {
    return function ClientPreFetch(p) {
      const store = useStore()
      const {query} = p
      const getInitialFetch = React.useCallback(
        () => initialFetch(store, query),
        [store, query]
      )

      return (
        <Wait promise={getInitialFetch}>
          {([loading, error, results]) =>
            loading ? (
              <InnerDock>
                <div style={spinnerStyle}>
                  <Spinner />
                </div>
              </InnerDock>
            ) : error ? (
              <p>{String(error)}</p>
            ) : (
              <Component {...p} {...results} />
            )
          }
        </Wait>
      )
    }
  }
}
