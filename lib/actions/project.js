// @flow
import {stringify} from 'querystring'

import fetch from '@conveyal/woonerf/fetch'
import {createAction} from 'redux-actions'
import {push} from 'react-router-redux'

import downloadJson from '../utils/download-json'
import getStops from '../utils/get-stops'
import cleanProjectScenarioName from '../utils/clean-project-scenario-name'
import type {Project} from '../types'
import {ADD_TRIP_PATTERN, REROUTE} from '../constants'

import {
  saveToServer as saveModification,
  getForProject as getModificationsForProject
} from './modifications'

import {loadBundle} from './'

const PROJECT_URL = `${process.env.API_URL}/project`

export const setCurrentProject = (_id: string) => ({
  type: 'set current project',
  payload: _id
})

// project stuff
const addProject = createAction('add project')
export const create = ({
  bundleId,
  name,
  regionId
}: {
  bundleId: string,
  name: string,
  regionId: string
}) =>
  fetch({
    url: PROJECT_URL,
    options: {
      body: {
        bundleId,
        name,
        regionId,
        variants: ['Default']
      },
      method: 'post'
    },
    next(response) {
      const project = response.value
      return [
        addProject(project),
        push(`/regions/${regionId}/projects/${project._id}`)
      ]
    }
  })

const deleteLocally = createAction('delete project')
export const deleteProject = (_projectId: string, _regionId: string) => [
  fetch({
    options: {
      method: 'delete'
    },
    url: `${PROJECT_URL}/${_projectId}`,
    next: () => [push(`/regions/${_regionId}/`), deleteLocally(_projectId)]
  })
]

export const load = (_id: string, done?: Function) => (dispatch: Dispatch) => {
  dispatch(setCurrentProject(_id))
  dispatch(
    fetch({
      url: `${PROJECT_URL}/${_id}`,
      next(response) {
        const project = response.value
        dispatch([
          set(project),
          loadBundle(project.bundleId),
          getModificationsForProject({
            bundleId: project.bundleId,
            projectId: project._id
          })
        ])

        done && done()
      }
    })
  )
}

export const saveToServer = (project: Project) =>
  fetch({
    url: `${PROJECT_URL}/${project._id}`,
    options: {
      body: project,
      method: 'put'
    },
    next: response => set(response.value)
  })
export const set = createAction('set project')
export const setAll = createAction('set projects')
export const loadProjects = (query: any = {}) =>
  fetch({
    url: `${PROJECT_URL}?${stringify(query)}`,
    next: response => setAll(response.value)
  })

/**
 * Project Variants
 */
export const createVariant = (name: string) => (
  dispatch: Dispatch,
  getState: () => any
) => {
  const {project} = getState()
  const {variants} = project.currentProject
  dispatch(
    saveToServer({
      ...project.currentProject,
      variants: [...variants, name]
    })
  )
}

export const deleteVariant = (index: number) => (
  dispatch: Dispatch,
  getState: () => any
) => {
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

export const downloadScenario = (index: number) => (
  dispatch: Dispatch,
  getState: () => any
) => {
  const {project} = getState()
  const {currentProject, feeds, modifications} = project
  const description = cleanProjectScenarioName(currentProject, index)
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
    filename: `${description}.json`
  })
}

export const downloadLines = (index: number) => (
  dispatch: Dispatch,
  getState: () => any
) => {
  const {project} = getState()
  const {currentProject, modifications} = project
  const file = cleanProjectScenarioName(currentProject, index)
  const features = []

  modifications
    .filter(m => m.variants[index])
    .forEach(mod => {
      if (mod.type === ADD_TRIP_PATTERN || mod.type === REROUTE) {
        const f = {
          type: 'Feature',
          properties: {
            name: mod.name,
            bidirectional: mod.bidirectional,
            timetables: mod.timetables
          },
          geometry: {
            type: 'LineString',
            properties: null,
            coordinates: []
          }
        }
        if (mod.segments) {
          const start = mod.segments[0]
          const coord = start.geometry.coordinates[0]
          f.geometry.coordinates.push(coord)
          mod.segments.forEach(seg =>
            f.geometry.coordinates.push(...seg.geometry.coordinates.slice(1))
          )
        }
        features.push(f)
      }
    })

  saveAsGeoJson(features, file + '-new-alignments.geojson')
}

export const downloadStops = (index: number) => (
  dispatch: Dispatch,
  getState: () => any
) => {
  const state = getState()
  const project = state.project
  const {currentProject, modifications} = project
  const file = cleanProjectScenarioName(currentProject, index)
  const features = []

  modifications
    .filter(m => m.variants[index])
    .forEach(mod => {
      if (mod.type === ADD_TRIP_PATTERN || mod.type === REROUTE) {
        getStops(mod.segments).forEach(stop => {
          features.push({
            type: 'Feature',
            properties: {
              name: mod.name,
              distanceFromStart: stop.distanceFromStart,
              stopId: stop.stopId
            },
            geometry: {
              type: 'Point',
              properties: null,
              coordinates: [stop.lon, stop.lat]
            }
          })
        })
      }
    })

  saveAsGeoJson(features, file + '-new-stops.geojson')
}

const saveAsGeoJson = (features, filename) => {
  downloadJson({
    data: {
      type: 'FeatureCollection',
      features
    },
    filename
  })
}

export const editVariantName = ({
  index,
  name
}: {
  index: number,
  name: string
}) => (dispatch: Dispatch, getState: () => any) => {
  const {project} = getState()
  const {currentProject} = project
  dispatch(
    saveToServer({
      ...currentProject,
      variants: currentProject.variants.map((value, i) =>
        i === index ? name : value
      )
    })
  )
}

export const showVariant = createAction('show variant')
