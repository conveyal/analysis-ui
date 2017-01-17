import {push} from 'react-router-redux'
import {createAction} from 'redux-actions'
import uuid from 'uuid'

import getFeedsRoutesAndStops from './get-feeds-routes-and-stops'
import {lockUiWithError, serverAction} from './network'
import {
  create as createModification,
  formatForServer,
  isValid
} from '../utils/modification'

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

          return set({
            ...modification,
            id: uuid.v4(),
            scenario: toScenarioId,
            variants: newVariants
          })
        })
    }
  })
}

export const create = ({
  feedId,
  projectId,
  scenarioId,
  type,
  variants
}) =>
  serverAction({
    url: '/api/modification',
    options: {
      body: JSON.stringify(createModification({
        feedId,
        scenarioId,
        type,
        variants
      })),
      method: 'post'
    },
    next: async (response) => {
      const modification = await response.json()
      return [
        setLocally(modification),
        push(`/projects/${projectId}/scenarios/${scenarioId}/modifications/${modification.id}`)
      ]
    }
  })

const deleteLocally = createAction('delete modification')
const deleteOnServer = (id) =>
  serverAction({
    url: `/api/modification/${id}`,
    options: {
      method: 'delete'
    }
  })
export const deleteModification = (id) => [deleteLocally(id), deleteOnServer(id)]

export function getForScenario ({
  bundleId,
  scenarioId
}) {
  return serverAction({
    url: `/api/scenario/${scenarioId}/modifications`,
    next: async (response) => {
      const modifications = await response.json()
      return [
        setAll(modifications),
        getFeedsRoutesAndStops({
          bundleId,
          modifications
        })
      ]
    }
  })
}

export const saveToServer = (m) =>
  serverAction({
    url: `/api/modification/${m.id}`,
    options: {
      body: JSON.stringify(formatForServer(m)),
      method: 'put'
    }
  })

export const set = (m) => [setLocally(m), saveToServer(m)]
export const setActive = createAction('set active modification')
const setAll = createAction('set modifications')
export const setAndRetrieveData = ({
  bundleId,
  modification
}) => (
    isValid(modification)
    ? [set(modification), getFeedsRoutesAndStops({bundleId, modifications: [modification]})]
    : [lockUiWithError('Modification is not valid after operation')]
)

export const setLocally = createAction('set modification')
