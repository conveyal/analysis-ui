import {createAction} from 'redux-actions'
import {push} from 'react-router-redux'
import uuid from 'uuid'

import {setCenter as setMapCenter} from './map'
import {serverAction} from './network'
import {setBundles} from './'
import {setAll as setScenarios} from './scenario'
import {clear as clearBrowsochrones} from '../utils/browsochrones'

export const create = (project) => {
  project.id = uuid.v4()
  return serverAction({
    url: '/api/project',
    options: {
      body: JSON.stringify(project),
      method: 'post'
    },
    next: async (response) => [
      setLocally(project),
      push(`/projects/${project.id}`)
    ]
  })
}

export const deleteLocally = createAction('delete project')
export const deleteProject = (id) =>
  serverAction({
    options: {
      method: 'delete'
    },
    url: `/api/project/${id}`,
    next: async () => [
      deleteLocally(id),
      push('/')
    ]
  })

export const load = (id) =>
  serverAction({
    url: `/api/project/${id}`,
    next: async (response) => {
      const project = await response.json()
      clearBrowsochrones()
      return [
        setLocally({...project, bundles: [], scenarios: []}),
        setMapCenter([(project.bounds.west + project.bounds.east) / 2, (project.bounds.north + project.bounds.south) / 2]),
        setBundles(project.bundles),
        setScenarios(project.scenarios)
      ]
    }
  })

export const loadAll = () =>
  serverAction({
    url: '/api/project',
    next: async (response) => {
      const projects = await response.json()
      return setAll(projects)
    }
  })

export const save = (project) => [setLocally(project), saveToServer(project)]
const saveToServer = (project) =>
  serverAction({
    url: `/api/project/${project.id}`,
    options: {
      body: JSON.stringify(project),
      method: 'put'
    }
  })

export const setAll = createAction('set all projects')
export const setLocally = createAction('set project')
