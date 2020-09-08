import useSWR, {ConfigInterface} from 'swr'
import {useContext, useCallback} from 'react'

import {safeDelete, putJSON} from 'lib/utils/safe-fetch'

import {UserContext} from '../user'

export function createUseModel(collectionName: string) {
  return function useModel(_id: string, config?: ConfigInterface) {
    const user = useContext(UserContext)
    const url = `/api/db/${collectionName}/${_id}`
    const results = useSWR([url, user], config)

    const {mutate} = results
    const update = useCallback(
      (newProperties) =>
        mutate(async (data) => {
          const res = await putJSON(url, {
            ...data,
            ...newProperties
          })
          // Update client with final result
          if (res.ok) {
            return res.data
          } else {
            throw res
          }
        }),
      [url, mutate]
    )

    // Should never change
    const remove = useCallback((_id) => safeDelete(url), [url])

    return {
      ...results,
      update,
      remove
    }
  }
}

export const useRegion = createUseModel('regions')
export const useAnalysisPreset = createUseModel('analysisPreset')
