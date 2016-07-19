import {createAction} from 'redux-actions'
import {push} from 'react-router-redux'
import uuid from 'uuid'

import {serverAction} from './network'
import {loadAll as loadScenariosForProject} from './scenario'

export const create = ({
  bounds,
  description,
  name,
  r5Version = '1.0.0'
}) =>
  serverAction({
    options: {
      body: JSON.stringify({
        bounds,
        description,
        id: uuid.v4(),
        name,
        r5Version
      }),
      method: 'post'
    },
    url: '/api/project',
    next: async (response) => {
      const project = await response.json()
      return setAndLoadScenarios({project})
    }
  })

export const load = (id) =>
  serverAction({
    url: `/api/project/${id}`,
    next: async (response) => {
      const project = await response.json()
      return setAndLoadScenarios({project})
    }
  })

export const loadAll = () =>
  serverAction({
    url: '/api/project',
    next: async (response) => {
      const projects = await response.json()
      const projectsExist = projects && projects.length > 0
      if (projectsExist) {
        return setAll(projects)
      } else {
        return push('/projects/create')
      }
    }
  })

export const saveToServer = (project) =>
  serverAction({
    url: `/api/project/${project.id}`,
    options: {
      body: JSON.stringify(project),
      method: 'put'
    },
    next: async (response) => {
      const project = await response.json()
      return set(project)
    }
  })
export const set = createAction('set project')
export const setAll = createAction('set all projects')

export const setAndLoadScenarios = ({
  currentScenarioId,
  project
}) => [
  set(project),
  loadScenariosForProject({
    currentScenarioId,
    projectId: project.id
  })
]
