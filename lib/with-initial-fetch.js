import {Flex} from '@chakra-ui/core'
import React from 'react'
import {useStore} from 'react-redux'

import P from './components/p'
import Spinner from './components/spinner'
import usePromise from './hooks/use-promise'
import useWindowSize from './hooks/use-window-size'

const minHeight = '600px'
const minWidth = '320px'
const spinnerStyle = {
  color: '#2389c9',
  fontSize: '36px',
  marginTop: '-25px'
}

const ShowError = (p) => (
  <div className='block'>
    <P>{String(p.error)}</P>
  </div>
)
const ShowSpinner = () => (
  <span style={spinnerStyle}>
    <Spinner />
  </span>
)

export default function withInitialFetch(PageComponent, initialFetch) {
  return function InitialFetch(p) {
    const store = useStore()
    const size = useWindowSize()

    // Page components are always passed a query object
    const {query} = p
    const getInitialFetch = React.useCallback(
      () => initialFetch(store, query),
      [store, query]
    )
    const [loading, error, results] = usePromise(getInitialFetch)

    if (error) return <ShowError error={error} />
    if (loading)
      return (
        <Flex
          align='center'
          direction='column'
          height={size.height || minHeight}
          justify='center'
          width={minWidth}
        >
          <ShowSpinner />
        </Flex>
      )
    if (results) return <PageComponent {...p} {...results} />

    return null
  }
}
