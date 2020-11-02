import useSWR, {ConfigInterface} from 'swr'
import {useContext, useCallback} from 'react'

import {safeDelete, putJSON} from 'lib/utils/safe-fetch'

import {UserContext} from '../user'

export function createUseModel<T extends CL.IModel>(collectionName: string) {
  return function useModel(_id: string, config?: ConfigInterface) {
    const user = useContext(UserContext)
    const url = `/api/db/${collectionName}/${_id}`
    const results = useSWR<T>([url, user], config)

    const {mutate} = results
    const update = useCallback(
      async (newProperties: Partial<T>) => {
        try {
          const data = await mutate(async (data) => {
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
          })
          return {ok: true, data}
        } catch (res) {
          return res
        }
      },
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

export const useRegion = createUseModel<CL.Region>('regions')
export const usePreset = createUseModel<CL.Preset>('presets')
