import {createAction} from 'redux-actions'
import {push} from 'react-router-redux'
import uuid from 'uuid'

import {getForScenario as getModificationsForScenario} from './modifications'
import {serverAction} from './network'

export const create = ({
  bundleId,
  name,
  projectId
}) =>
  serverAction({
    url: '/api/scenario',
    options: {
      body: JSON.stringify({
        bundleId,
        id: uuid.v4(),
        name,
        projectId,
        variants: ['Default']
      }),
      method: 'post'
    },
    next: async (response) => {
      const scenario = await response.json()
      return [addScenario(scenario), push(`/projects/${projectId}/scenarios/${scenario.id}`)]
    }
  })

export const load = (id) =>
  serverAction({
    url: `/api/scenario/${id}`,
    next: async (response) => {
      const scenario = await response.json()
      return [
        set(scenario),
        getModificationsForScenario({bundleId: scenario.bundleId, scenarioId: scenario.id})
      ]
    }
  })

/** add a scenario into the local store */
export const addScenario = createAction('add scenario')

export const saveToServer = (scenario) =>
  serverAction({
    url: `/api/scenario/${scenario.id}`,
    options: {
      body: JSON.stringify(scenario),
      method: 'put'
    },
    next: async (response) => {
      const scenario = await response.json()
      return set(scenario)
    }
  })
export const set = createAction('set scenario')
export const setAll = createAction('set scenarios')

export const setAndLoadModifications = (scenario) => [
  set(scenario),
  getModificationsForScenario({
    bundleId: scenario.bundleId,
    scenarioId: scenario.id
  })
]
