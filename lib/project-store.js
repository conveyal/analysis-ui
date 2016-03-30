/**
 * Store projects.
 * This implementation uses local storage. We'll want to switch it out for a server component at some point.
 */

import authenticatedFetch from './utils/authenticated-fetch'

class ProjectStore {
  constructor (store) {
    store.subscribe(() => {
      let state = store.getState()
      // NB this won't overwrite the project when it is being loaded as the reducer for switching projects
      // loads the modifications
      if (state.id) this.saveProject(state.id, { id: state.id, name: state.name, modifications: state.modifications, bundleId: state.bundleId })
    })
  }

  saveProject (projectId, project) {
    let projectToStore = Object.assign({}, project)
    projectToStore.modifications = []

    project.modifications.forEach((m, id) => projectToStore.modifications.push(id))

    let promises = []

    promises.push(authenticatedFetch(`/api/scenario/${project.id}`, {
      method: 'put',
      body: JSON.stringify(projectToStore)
    }))

    project.modifications.forEach((m, id) => {
      promises.push(authenticatedFetch(`/api/modification/${m.id}`, {
        method: 'put',
        body: JSON.stringify(m)
      }))
    })

    return Promise.all(promises)
  }

  getProject (projectId) {
    let projectPromise = authenticatedFetch(`/api/scenario/${projectId}`).then((res) => res.json())
    let modsPromise = authenticatedFetch(`/api/scenario/${projectId}/modifications`).then((res) => res.json())

    return Promise.all([projectPromise, modsPromise])
        .then(([project, modifications]) => {
          project.modifications = new Map()
          modifications.forEach((m) => project.modifications.set(m.id, m))
          return project
        })
  }

  getProjects () {
    return authenticatedFetch('/api/scenario').then((res) => res.json())
  }
}

export default ProjectStore
