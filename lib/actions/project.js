import {createAction} from 'redux-actions'
import {push} from 'react-router-redux'
import uuid from 'uuid'

import {serverAction} from './network'
import {setBundles} from './'
import {setAll as setScenarios, setAndLoadModifications} from './scenario'

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
    setLocally(Object.assign({}, project, { bundles: [], scenarios: [] })),
    setBundles(project.bundles),
    setScenarios(project.scenarios),
    finalAction
  ]
}
