import ms from 'ms'
import {useCallback} from 'react'
import {useDispatch, useSelector} from 'react-redux'

import {updateModification as updateModificationAction} from '../actions/modifications'
import selectModification from '../selectors/active-modification'

import useDebounced from './use-debounced'

const tenSeconds = ms('10s')

/**
 * Mimics the one from Modification Editor
 */
export default function useModification() {
  const dispatch = useDispatch()
  const modification = useSelector(selectModification)
  const updateModification = useCallback(
    (newParameters) => {
      dispatch(updateModificationAction({...modification, ...newParameters}))
    },
    [dispatch, modification]
  )
  const update = useDebounced(updateModification, tenSeconds)
  return [modification, update]
}
