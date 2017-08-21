import fetch from '@conveyal/woonerf/fetch'
import {createAction} from 'redux-actions'
import {push} from 'react-router-redux'
import uuid from 'uuid'

import {loadBundle} from './'
import {
  set as saveModification,
  getForScenario as getModificationsForScenario
} from './modifications'

import convertToR5Modification from '../utils/convert-to-r5-modification'
import downloadJson from '../utils/download-json'

// scenario stuff
const addScenario = createAction('add scenario')
export const create = ({bundleId, name, projectId}) =>
  fetch({
    url: '/api/scenario',
    options: {
      body: {
        bundleId,
        id: uuid.v4(),
        name,
        projectId,
        variants: ['Default']
      },
      method: 'post'
    },
    next (error, response) {
      if (!error) {
        const scenario = response.value
        return [addScenario(scenario), push(`/scenarios/${scenario.id}`)]
      }
    }
  })

const deleteLocally = createAction('delete scenario')
export const deleteScenario = scenarioId => [
  deleteLocally(scenarioId),
  fetch({
    url: `/api/scenario/${scenarioId}`,
    options: {
      method: 'delete'
    },
    next () {}
  })
]

export const load = id =>
  fetch({
    url: `/api/scenario/${id}`,
    next (error, response) {
      if (!error) {
        const scenario = response.value
        return [
          set(scenario),
          loadBundle(scenario.bundleId),
          getModificationsForScenario({
            bundleId: scenario.bundleId,
            scenarioId: scenario.id
          })
        ]
      }
    }
  })

export const saveToServer = scenario =>
  fetch({
    url: `/api/scenario/${scenario.id}`,
    options: {
      body: scenario,
      method: 'put'
    },
    next: (error, response) => !error && set(response.value)
  })
export const set = createAction('set scenario')
export const setAll = createAction('set scenarios')

export const setAndLoadModifications = scenario => [
  set(scenario),
  getModificationsForScenario({
    bundleId: scenario.bundleId,
    scenarioId: scenario.id
  })
]

/**
 * Scenario Variants
 */
export const createVariant = (name) => (dispatch, getState) => {
  const {scenario} = getState()
  const {variants} = scenario.currentScenario
  dispatch(saveToServer({
    ...scenario.currentScenario,
    variants: [...variants, name]
  }))
}

export const deleteVariant = (index) => (dispatch, getState) => {
  const {scenario} = getState()
  const {currentScenario, modifications} = scenario
  dispatch(saveToServer({
    ...currentScenario,
    variants: currentScenario.variants.filter((_, i) => i !== index)
  }))
  modifications.forEach((m) => {
    dispatch(saveModification({
      ...m,
      variants: m.variants.filter((_, i) => i !== index)
    }))
  })
}

export const downloadVariant = (index) => (_, getState) => {
  const {scenario} = getState()
  const {currentScenario, feeds, modifications} = scenario
  const description = `${currentScenario.name}-${currentScenario.variants[index]}`
  const feedChecksums = {}
  feeds.forEach(f => {
    feedChecksums[f.id] = f.checksum
  })

  downloadJson({
    data: {
      description,
      feedChecksums,
      id: 0,
      modifications: modifications
        .filter((m) => m.variants[index])
        .map(convertToR5Modification)
    },
    filename: `${description}.json`.replace(/[^a-zA-Z0-9]/, '-')
  })
}

export const editVariantName = ({index, name}) => (dispatch, getState) => {
  const {scenario} = getState()
  const {currentScenario} = scenario
  dispatch(saveToServer({
    ...currentScenario,
    variants: currentScenario.variants.map((value, i) => i === index ? name : value)
  }))
}

export const printVariant = (index) => (dispatch, getState) => {
  const {scenario} = getState()
  const {currentScenario} = scenario
  dispatch(push(`/reports/${currentScenario.projectId}/scenarios/${currentScenario.id}/variants/${index}`))
}

export const showVariant = createAction('show variant')
