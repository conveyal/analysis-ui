/**
 * Store projects.
 * This implementation uses local storage. We'll want to switch it out for a server component at some point.
 */

import authenticatedFetch from './utils/authenticated-fetch'

export function saveProject (project, modifications) {
  const scenarioPut = authenticatedFetch(`/api/scenario/${project.id}`, {
    method: 'put',
    body: JSON.stringify(Object.assign(project, {
      modifications: modifications.map((m) => m.id)
    }))
  })

  const modificationsPut = modifications.map((m, id) => {
    return authenticatedFetch(`/api/modification/${m.id}`, {
      method: 'put',
      body: JSON.stringify(m)
    })
  })

  return Promise.all([scenarioPut, ...modificationsPut])
}

export function getProject (projectId) {
  const projectPromise = authenticatedFetch(`/api/scenario/${projectId}`).then((res) => res.json())
  const modsPromise = authenticatedFetch(`/api/scenario/${projectId}/modifications`).then((res) => res.json())

  return Promise.all([projectPromise, modsPromise])
    .then(([project, modifications]) => {
      project.modifications = new Map()
      modifications.forEach((m) => project.modifications.set(m.id, m))
      return project
    })
}

export function getProjects () {
  return authenticatedFetch('/api/scenario').then((res) => res.json())
}
