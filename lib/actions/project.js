import {createAction} from 'redux-actions'
import {push} from 'react-router-redux'
import uuid from 'uuid'

import {setCenter as setMapCenter} from './map'
import {serverAction} from './network'
import {setBundles} from './'
import {setAll as setScenarios} from './scenario'
import {clear as clearBrowsochrones, setGrids} from '../utils/browsochrones'

export const create = () => {
  let id = uuid.v4()

  return [
    setLocally({
      bounds: DEFAULT_BOUNDS,
      description: 'Project description',
      id,
      name: 'Project name'
    }),
    push(`/projects/${id}/create`)
  ]
}

export const DEFAULT_BOUNDS = {
  north: 39.02345139405932,
  east: -76.81503295898438,
  south: 38.777640223073355,
  west: -77.25723266601562
}
const deleteLocally = createAction('delete project')
export const deleteProject = (id) =>
  serverAction({
    options: {
      method: 'delete'
    },
    url: `/api/project/${id}`,
    next: async () => {
      return [
        deleteLocally(id),
        push('/')
      ]
    }
  })

export const load = (id) =>
  serverAction({
    url: `/api/project/${id}`,
    next: async (response) => {
      const project = await response.json()
      clearBrowsochrones()
      setGrids([]) // TODO load accessibility grids
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
