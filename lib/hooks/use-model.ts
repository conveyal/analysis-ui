import useSWR, {ConfigInterface} from 'swr'
import {useContext, useCallback} from 'react'

import {safeDelete, putJSON} from 'lib/utils/safe-fetch'

import {UserContext} from '../user'

export function createUseModel(collectionName) {
  return function useModel(_id: string, config?: ConfigInterface) {
    const user = useContext(UserContext)
    const results = useSWR([`/api/db/${collectionName}/${_id}`, user], config)

    const update = useCallback(
      async (newProperties) => {
        // Optimistically update
        results.mutate({...results.data, ...newProperties})
        // PUT to server
        const res = await putJSON(`/api/db/${collectionName}/${_id}`, {
          ...results.data,
          ...newProperties
        })
        // Mutate with final result
        if (res.ok) {
          results.mutate(res.data)
        }
        // Return full response object.
        return res
      },
      [results.data, results.mutate]
    )

    return {
      ...results,
      update,
      remove: () => safeDelete(`/api/db/${collectionName}/${_id}`)
    }
  }
}

export const useRegion = createUseModel('regions')
