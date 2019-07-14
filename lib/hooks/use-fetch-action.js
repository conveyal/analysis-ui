import React from 'react'
import {useDispatch} from 'react-redux'

import fetchAction, {fetchMultiple} from '../fetch-action'

import usePromise from './use-promise'

export default function useFetchAction(options) {
  const dispatch = useDispatch()

  const getPromise = React.useCallback(() => dispatch(fetchAction(options)), [
    dispatch,
    options
  ])

  return usePromise(getPromise)
}

export function useFetchMultiple(f) {
  const dispatch = useDispatch()

  const getPromise = React.useCallback(() => dispatch(fetchMultiple(f)), [
    dispatch,
    f
  ])

  return usePromise(getPromise)
}
