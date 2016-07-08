import {createAction} from 'redux-actions'
import uuid from 'uuid'

import getDataForModifications from './get-data-for-modifications'
import {serverAction} from './network'
import {replaceModification} from './'

export const set = createAction('set modifications')

export function getForScenario ({
  bundleId,
  scenarioId
}) {
  return serverAction({
    url: `/api/scenario/${scenarioId}/modifications`,
    next: async (response) => {
      const modifications = await response.json()
      return [
        set(modifications),
        getDataForModifications({
          bundleId,
          scenarioId,
          modifications
        })
      ]
    }
  })
}

export function copyFromScenario ({
  fromScenarioId,
  toScenarioId,
  variants
}) {
  return serverAction({
    url: `/api/scenario/${fromScenarioId}/modifications`,
    next: async (response) => {
      const modifications = await response.json()
      return modifications
        .map((modification) => {
          const newVariants = []

          for (let i = 0; i < variants.length; i++) {
            if (i < modification.variants.length) {
              newVariants.push(modification.variants[i])
            } else {
              newVariants.push(false)
            }
          }

          return replaceModification(Object.assign(modification, {
            id: uuid.v4(),
            scenario: toScenarioId,
            variants: newVariants
          }))
        })
    }
  })
}
