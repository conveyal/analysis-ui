import ms from 'ms'
import {useCallback} from 'react'
import {useDispatch, useSelector} from 'react-redux'

import {saveToServer, setLocally} from '../actions/modifications'
import selectModification from '../selectors/active-modification'

import useDebounced from './use-debounced'

const tenSeconds = ms('10s')

/**
 * Mimics the one from Modification Editor
 */
export default function useModification() {
  const dispatch = useDispatch()
  const modification = useSelector(selectModification)

  const debouncedSaveToServer = useDebounced(
    useCallback(
      (modification) => dispatch(saveToServer(modification)),
      [dispatch] // should never change
    ),
    tenSeconds
  )

  return [
    modification,
    (newParameters: any) => {
      const newModification = {...modification, ...newParameters}
      dispatch(setLocally(newModification)) // immediate
      debouncedSaveToServer(newModification) // debounced
    }
  ]
}
