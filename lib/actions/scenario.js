import {createAction} from 'redux-actions'
import {push} from 'react-router-redux'

import {getForScenario as getModificationsForScenario} from './modifications'
import {serverAction} from './network'

export const load = (id) =>
  serverAction({
    url: `/api/scenario/${id}`,
    next: async (response) => {
      const scenario = await response.json()
      return setAndLoadModifications(scenario)
    }
  })

export const loadAll = ({
  currentScenarioId,
  projectId
}) =>
  serverAction({
    url: `/api/project/${projectId}/scenario`,
    next: async (response) => {
      const scenarios = await response.json()
      const scenariosExist = scenarios && scenarios.length > 0
      if (scenariosExist) {
        const foundCurrentScenario = scenarios.find((scenario) => scenario.id === currentScenarioId)
        const currentScenario = foundCurrentScenario || scenarios[0]
        return [
          setAll(scenarios),
          setAndLoadModifications(currentScenario)
        ]
      } else {
        return push('/create-scenario')
      }
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
