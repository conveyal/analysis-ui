import Router from 'next/router'
import {stringify} from 'querystring'
import {createAction} from 'redux-actions'

import fetch from '../fetch-action'
import downloadJson from '../utils/download-json'
import getStops from '../utils/get-stops'
import cleanProjectScenarioName from '../utils/clean-project-scenario-name'
import {ADD_TRIP_PATTERN, REROUTE, RouteTo} from '../constants'

import getFeedsRoutesAndStops from './get-feeds-routes-and-stops'
import {
  saveToServer as saveModification,
  getForProject as getModificationsForProject
} from './modifications'

import {loadBundle} from './'

const PROJECT_URL = `${process.env.API_URL}/project`

export const setCurrentProject = _id => ({
  type: 'set current project',
  payload: _id
})

// project stuff
const addProject = createAction('add project')
export const create = ({bundleId, name, regionId}) => async dispatch => {
  const project = await dispatch(
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
      }
    })
  )

  dispatch(addProject(project))

  Router.push({
    pathname: RouteTo.modifications,
    query: {regionId, projectId: project._id}
  })

  return project
}

const deleteLocally = createAction('delete project')
export const deleteProject = (projectId, regionId) => async dispatch => {
  await dispatch(
    fetch({
      options: {
        method: 'delete'
      },
      url: `${PROJECT_URL}/${projectId}`
    })
  )

  dispatch(deleteLocally(projectId))

  Router.push({
    pathname: RouteTo.projects,
    query: {regionId}
  })
}

export const load = _id => async dispatch => {
  dispatch(setCurrentProject(_id))

  const project = await dispatch(
    fetch({
      url: `${PROJECT_URL}/${_id}`,
      next: r => set(r.value)
    })
  )

  const [bundle, modifications] = await Promise.all([
    dispatch(loadBundle(project.bundleId)),
    dispatch(getModificationsForProject(project._id))
  ])

  const feeds = await dispatch(
    getFeedsRoutesAndStops({
      bundleId: project.bundleId,
      forceCompleteUpdate: true,
      modifications
    })
  )

  return {bundle, feeds, modifications, project}
}

export const saveToServer = project =>
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
export const loadProjects = (query = {}) =>
  fetch({
    url: `${PROJECT_URL}?${stringify(query)}`,
    next: response => setAll(response.value)
  })

/**
 * Project Variants
 */
export const createVariant = name => (dispatch, getState) => {
  const {project} = getState()
  const {variants} = project.currentProject
  return dispatch(
    saveToServer({
      ...project.currentProject,
      variants: [...variants, name]
    })
  )
}

export const deleteVariant = index => async (dispatch, getState) => {
  const {project} = getState()
  const {currentProject, modifications} = project
  await dispatch(
    saveToServer({
      ...currentProject,
      variants: currentProject.variants.filter((_, i) => i !== index)
    })
  )
  return Promise.all(
    modifications.map(m => {
      dispatch(
        saveModification({
          ...m,
          variants: m.variants.filter((_, i) => i !== index)
        })
      )
    })
  )
}

export const downloadScenario = index => (dispatch, getState) => {
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

export const downloadLines = index => (dispatch, getState) => {
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

export const downloadStops = index => (dispatch, getState) => {
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

export const editVariantName = ({index, name}) => (dispatch, getState) => {
  const {project} = getState()
  const {currentProject} = project
  return dispatch(
    saveToServer({
      ...currentProject,
      variants: currentProject.variants.map((value, i) =>
        i === index ? name : value
      )
    })
  )
}

export const showVariant = createAction('show variant')
