import ms from 'ms'
import {useCallback, useState} from 'react'
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
  const storedModification = useSelector(selectModification)
  const [modification, setModification] = useState(storedModification)

  const updateModification = useCallback(
    (modification) => dispatch(updateModificationAction(modification)),
    [dispatch] // should never change
  )
  const debouncedUpdate = useDebounced(updateModification, tenSeconds)

  return [
    modification,
    (newParameters: any) => {
      const newModification = {...modification, ...newParameters}
      setModification(newModification) // immediate
      debouncedUpdate(newModification) // debounced
    }
  ]
}
