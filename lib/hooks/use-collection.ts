import useSWR, {ConfigInterface} from 'swr'
import {useContext} from 'react'

import {UserContext} from '../user'

export function createUseCollection(collectionName) {
  return function useCollection(config?: ConfigInterface) {
    const user = useContext(UserContext)
    return useSWR([`/api/db/${collectionName}`, user], config)
  }
}

export const useRegions = createUseCollection('regions')
