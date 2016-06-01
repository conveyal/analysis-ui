/**
 * Store projects.
 * This implementation uses local storage. We'll want to switch it out for a server component at some point.
 */

import authenticatedFetch from './utils/authenticated-fetch'

export function saveProject (project, modifications) {
  return authenticatedFetch(`/api/scenario/${project.id}`, {
    method: 'put',
    body: JSON.stringify(project)
  })
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
