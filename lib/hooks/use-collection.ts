import useSWR, {ConfigInterface} from 'swr'
import {useCallback, useContext} from 'react'

import LogRocket from 'lib/logrocket'
import {UserContext} from 'lib/user'
import {postJSON, putJSON, safeDelete} from 'lib/utils/safe-fetch'

const encode = (o: Record<string, unknown> | void) => {
  if (o) {
    try {
      return encodeURIComponent(JSON.stringify(o) || '')
    } catch (e) {
      LogRocket.captureException(e)
      return ''
    }
  }
}

interface UseCollection extends ConfigInterface {
  query?: Record<string, unknown>
  options?: Record<string, unknown>
}

/**
 * Factory function for creating a hook to use a collection.
 */
export function createUseCollection(collectionName) {
  // Helper function for creating new entries
  const create = (properties: Record<string, unknown>) =>
    postJSON(`/api/db/${collectionName}`, properties)

  return function useCollection(config?: UseCollection) {
    const user = useContext(UserContext)
    const baseURL = `/api/db/${collectionName}`
    const queryParams = `query=${encode(config.query)}&options=${encode(
      config.options
    )}`
    const results = useSWR([`${baseURL}?${queryParams}`, user], config)

    const {mutate, revalidate} = results
    // Helper function for updating values when using a collection
    const update = useCallback(
      async (_id: string, newProperties: Record<string, unknown>) => {
        try {
          const data = await mutate(async (data) => {
            const obj = data.find((d) => d._id === _id)
            const res = await putJSON(`/api/db/${collectionName}/${_id}`, {
              ...obj,
              ...newProperties
            })
            if (res.ok) {
              return data.map((d) => (d._id === _id ? res.data : d))
            } else {
              throw res
            }
          })
          return {ok: true, data}
        } catch (res) {
          return res
        }
      },
      [mutate]
    )

    // Helper function when removing values
    const remove = useCallback(
      async (_id) => {
        const res = await safeDelete(`/api/db/${collectionName}/${_id}`)
        if (res.ok) {
          revalidate()
        }
        return res
      },
      [revalidate]
    )

    return {
      ...results,
      create,
      remove,
      update
    }
  }
}

// Create an instance of each collection type
export const useRegions = createUseCollection('regions')
export const usePresets = createUseCollection('bookmarks')
