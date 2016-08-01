import {createAction} from 'redux-actions'
import {push} from 'react-router-redux'
import uuid from 'uuid'

import {serverAction} from './network'
import {setBundles} from './'
import {setAll as setScenarios} from './scenario'

export const DEFAULT_BOUNDS = {
  north: 39.02345139405932,
  east: -76.81503295898438,
  south: 38.777640223073355,
  west: -77.25723266601562
}

export const create = () =>
  serverAction({
    options: {
      body: JSON.stringify({
        bounds: DEFAULT_BOUNDS,
        description: 'Project description',
        id: uuid.v4(),
        name: 'Project name',
        r5Version: '1.1.0'
      }),
      method: 'post'
    },
    url: '/api/project',
    next: async (response) => {
      const project = await response.json()
      return [
        setLocally(project),
        push(`/projects/${project.id}/edit`)
      ]
    }
  })

export const load = (id) =>
  serverAction({
    url: `/api/project/${id}`,
    next: async (response) => {
      const project = await response.json()
      return [
        setLocally({...project, bundles: [], scenarios: []}),
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

const saveToServer = (project) =>
  serverAction({
    url: `/api/project/${project.id}`,
    options: {
      body: JSON.stringify(project),
      method: 'put'
    }
  })

const setLocally = createAction('set project')
export const save = (project) => [setLocally(project), saveToServer(project)]
export const setAll = createAction('set all projects')
