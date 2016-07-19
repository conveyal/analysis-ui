import {createAction} from 'redux-actions'
import {push} from 'react-router-redux'
import uuid from 'uuid'

import {serverAction} from './network'
import {setBundles} from './'
import {setAll as setScenarios, setAndLoadModifications} from './scenario'

export const create = ({
  bounds,
  description,
  name,
  r5Version = '1.1.0'
}) =>
  serverAction({
    options: {
      body: JSON.stringify({
        // TEMPORARY HACK TO SET BOUNDS
        bounds: {
          north: 39.0093,
          east: -76.7862,
          south: 38.7779,
          west: -77.2428
        },
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
}) => {
  const {scenarios} = project
  const scenariosExist = scenarios && scenarios.length > 0
  let finalAction // either loading chosen scenario or going to create scenario page

  if (scenariosExist) {
    const foundCurrentScenario = scenarios.find((scenario) => scenario.id === currentScenarioId)
    const currentScenario = foundCurrentScenario || scenarios[0]
    finalAction = setAndLoadModifications(currentScenario)
  } else {
    finalAction = push(`/projects/${project.id}/scenarios/create`)
  }

  return [
    set(Object.assign({}, project, { bundles: [], scenarios: [] })),
    setBundles(project.bundles),
    setScenarios(project.scenarios),
    finalAction
  ]
}
