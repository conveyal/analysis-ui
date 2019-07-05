import React from 'react'
import {useDispatch} from 'react-redux'

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

export default function withFetch(Component, fetchData) {
  if (typeof window === 'undefined') {
    Component.getInitialProps = async ctx => {
      return await fetchData(ctx.reduxStore.dispatch, ctx.query)
    }

    return Component
  } else {
    return function ClientPreFetch(p) {
      const dispatch = useDispatch()
      const {query} = p
      const getFetchData = React.useCallback(() => {
        return fetchData(dispatch, query)
      }, [dispatch, query])

      return (
        <Wait promise={getFetchData}>
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
