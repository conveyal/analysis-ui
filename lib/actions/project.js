import {createAction} from 'redux-actions'
import {push} from 'react-router-redux'

import {serverAction} from './network'
import {loadAll as loadScenariosForProject} from './scenario'

export const load = (id) =>
  serverAction({
    url: `/api/project/${id}`,
    next: async (response) => {
      const project = await response.json()
      return [
        set(project)
      ]
    }
  })

export const loadAll = ({
  currentProjectId,
  currentScenarioId
}) =>
  serverAction({
    url: '/api/project',
    next: async (response) => {
      const projects = await response.json()
      const projectsExist = projects && projects.length > 0
      if (projectsExist) {
        const foundCurrentProject = projects.find((project) => project.id === currentProjectId)
        const currentProject = foundCurrentProject || projects[0]
        return [
          setAll(projects),
          setAndLoadScenarios({
            currentScenarioId,
            project: currentProject
          })
        ]
      } else {
        return push('/create-project')
      }
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
