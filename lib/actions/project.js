// @flow
import fetch from '@conveyal/woonerf/fetch'
import {createAction} from 'redux-actions'
import {push} from 'react-router-redux'

import {loadBundle} from './'
import {setProfileRequest} from './analysis'
import {
  set as saveModification,
  getForProject as getModificationsForProject
} from './modifications'
import OpportunityDatasets from '../modules/opportunity-datasets'
import R5Version from '../modules/r5-version'

import downloadJson from '../utils/download-json'

import type {Project} from '../types'

// project stuff
const addProject = createAction('add project')
export const create = ({bundleId, name, regionId}: {
  bundleId: string,
  name: string,
  regionId: string
}) =>
  fetch({
    url: '/api/project',
    options: {
      body: {
        bundleId,
        name,
        regionId,
        variants: ['Default']
      },
      method: 'post'
    },
    next (response) {
      const project = response.value
      return [addProject(project), push(`/projects/${project._id}`)]
    }
  })

const deleteLocally = createAction('delete project')
export const deleteProject = (projectId: string) => [
  deleteLocally(projectId),
  fetch({
    url: `/api/project/${projectId}`,
    options: {
      method: 'delete'
    }
  })
]

export const load = (_id: string) => (dispatch: Dispatch) =>
  dispatch(fetch({
    url: `/api/project/${_id}`,
    next (response) {
      const project = response.value
      dispatch([
        set(project),
        loadBundle(project.bundleId),
        getModificationsForProject({
          bundleId: project.bundleId,
          projectId: project._id
        })
      ])

      if (project.analysisRequestSettings) {
        dispatch(setProfileRequest(project.analysisRequestSettings))
        if (project.analysisRequestSettings.opportunityDatasetKey) {
          dispatch(OpportunityDatasets.actions.loadOpportunityDataset({
            key: project.analysisRequestSettings.opportunityDatasetKey
          }))
        }
        if (project.analysisRequestSettings.workerVersion) {
          dispatch(R5Version.actions.setCurrentR5Version(project.analysisRequestSettings.workerVersion))
        }
      }
    }
  }))

export const saveToServer = (project: Project) =>
  fetch({
    url: `/api/project/${project._id}`,
    options: {
      body: project,
      method: 'put'
    },
    next: (response) => set(response.value)
  })
export const set = createAction('set project')
export const setAll = createAction('set projects')

/**
 * Project Variants
 */
export const createVariant = (name: string) =>
  (dispatch: Dispatch, getState: () => any) => {
    const {project} = getState()
    const {variants} = project.currentProject
    dispatch(
      saveToServer({
        ...project.currentProject,
        variants: [...variants, name]
      })
    )
  }

export const deleteVariant = (index: number) =>
  (dispatch: Dispatch, getState: () => any) => {
    const {project} = getState()
    const {currentProject, modifications} = project
    dispatch(
      saveToServer({
        ...currentProject,
        variants: currentProject.variants.filter((_, i) => i !== index)
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

export const downloadScenario = (index: number) =>
  (dispatch: Dispatch, getState: () => any) => {
    const {project} = getState()
    const {currentProject, feeds, modifications} = project
    const variantName = currentProject.variants[index]
    const description = `${currentProject.name}-${variantName}`
    const feedChecksums = {}
    feeds.forEach(f => {
      feedChecksums[f.id] = f.checksum
    })

    downloadJson({
      data: {
        description,
        feedChecksums,
        _id: 0,
        modifications: modifications.filter(m => m.variants[index])
      },
      filename: `${description}.json`.replace(/[^a-zA-Z0-9]/, '-')
    })
  }

export const editVariantName = ({index, name}: {index: number, name: string}) =>
  (dispatch: Dispatch, getState: () => any) => {
    const {project} = getState()
    const {currentProject} = project
    dispatch(
      saveToServer({
        ...currentProject,
        variants: currentProject.variants.map(
          (value, i) => (i === index ? name : value)
        )
      })
    )
  }

export const showVariant = createAction('show variant')
