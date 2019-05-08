import Router from 'next/router'
import {stringify} from 'querystring'
import {createAction} from 'redux-actions'

import fetch from 'lib/fetch-action'
import {RouteTo} from 'lib/constants'

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
export const deleteProject = projectId =>
  fetch({
    options: {
      method: 'delete'
    },
    url: `${PROJECT_URL}/${projectId}`,
    next: () => deleteLocally(projectId)
  })

export const loadProject = _id => async dispatch => {
  dispatch(setCurrentProject(_id))

  return await dispatch(
    fetch({
      url: `${PROJECT_URL}/${_id}`,
      next: r => set(r.value)
    })
  )
}

export const loadProjectAndModifications = _id => async dispatch => {
  const project = await dispatch(loadProject(_id))
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
