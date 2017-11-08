// @flow
import fetch from '@conveyal/woonerf/fetch'
import {createAction} from 'redux-actions'
import {push} from 'react-router-redux'

import {loadBundle} from './'
import {
  set as saveModification,
  getForScenario as getModificationsForScenario
} from './modifications'

import convertToR5Modification from '../utils/convert-to-r5-modification'
import downloadJson from '../utils/download-json'

import type {Scenario} from '../types'

// scenario stuff
const addScenario = createAction('add scenario')
export const create = ({bundleId, name, projectId}: {
  bundleId: string,
  name: string,
  projectId: string
}) =>
  fetch({
    url: '/api/scenario',
    options: {
      body: {
        bundleId,
        name,
        projectId,
        variants: ['Default']
      },
      method: 'post'
    },
    next (error, response) {
      if (!error) {
        const scenario = response.value
        return [addScenario(scenario), push(`/scenarios/${scenario._id}`)]
      }
    }
  })

const deleteLocally = createAction('delete scenario')
export const deleteScenario = (scenarioId: string) => [
  deleteLocally(scenarioId),
  fetch({
    url: `/api/scenario/${scenarioId}`,
    options: {
      method: 'delete'
    },
    next () {}
  })
]

export const load = (_id: string) =>
  fetch({
    url: `/api/scenario/${_id}`,
    next (error, response) {
      if (!error) {
        const scenario = response.value
        return [
          set(scenario),
          loadBundle(scenario.bundleId),
          getModificationsForScenario({
            bundleId: scenario.bundleId,
            scenarioId: scenario._id
          })
        ]
      }
    }
  })

export const saveToServer = (scenario: Scenario) =>
  fetch({
    url: `/api/scenario/${scenario._id}`,
    options: {
      body: scenario,
      method: 'put'
    },
    next: (error, response) => !error && set(response.value)
  })
export const set = createAction('set scenario')
export const setAll = createAction('set scenarios')

/**
 * Scenario Variants
 */
export const createVariant = (name: string) =>
  (dispatch: Dispatch, getState: () => any) => {
    const {scenario} = getState()
    const {variants} = scenario.currentScenario
    dispatch(
      saveToServer({
        ...scenario.currentScenario,
        variants: [...variants, name]
      })
    )
  }

export const deleteVariant = (index: number) =>
  (dispatch: Dispatch, getState: () => any) => {
    const {scenario} = getState()
    const {currentScenario, modifications} = scenario
    dispatch(
      saveToServer({
        ...currentScenario,
        variants: currentScenario.variants.filter((_, i) => i !== index)
      })
    )
    modifications.forEach(m => {
      dispatch(
        saveModification({
          ...m,
          variants: m.variants.filter((_, i) => i !== index)
        })
      )
    })
  }

export const downloadVariant = (index: number) =>
  (dispatch: Dispatch, getState: () => any) => {
    const {scenario} = getState()
    const {currentScenario, feeds, modifications} = scenario
    const variantName = currentScenario.variants[index]
    const description = `${currentScenario.name}-${variantName}`
    const feedChecksums = {}
    feeds.forEach(f => {
      feedChecksums[f.id] = f.checksum
    })

    downloadJson({
      data: {
        description,
        feedChecksums,
        _id: 0,
        modifications: modifications
          .filter(m => m.variants[index])
          .map(convertToR5Modification)
      },
      filename: `${description}.json`.replace(/[^a-zA-Z0-9]/, '-')
    })
  }

export const editVariantName = ({index, name}: {index: number, name: string}) =>
  (dispatch: Dispatch, getState: () => any) => {
    const {scenario} = getState()
    const {currentScenario} = scenario
    dispatch(
      saveToServer({
        ...currentScenario,
        variants: currentScenario.variants.map(
          (value, i) => (i === index ? name : value)
        )
      })
    )
  }

export const printVariant = (index: number) =>
  (dispatch: Dispatch, getState: () => any) => {
    const {scenario} = getState()
    const {currentScenario} = scenario
    dispatch(
      push(
        `/reports/${currentScenario.projectId}/scenarios/${currentScenario._id}/variants/${index}`
      )
    )
  }

export const showVariant = createAction('show variant')
