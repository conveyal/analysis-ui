/**
 * Store projects.
 * This implementation uses local storage. We'll want to switch it out for a server component at some point.
 */

import authenticatedFetch, {parseJSON} from './utils/authenticated-fetch'

export async function saveProject (project) {
  const response = await authenticatedFetch(`/api/scenario/${project.id}`, {
    method: 'put',
    body: JSON.stringify(project)
  })
  return await parseJSON(response)
}

export async function getProject (id) {
  const projectResponse = await authenticatedFetch(`/api/scenario/${id}`)
  const modsResponse = await authenticatedFetch(`/api/scenario/${id}/modifications`)
  const project = await parseJSON(projectResponse)
  const modifications = await parseJSON(modsResponse)

  project.modifications = new Map()
  modifications.forEach((m) => project.modifications.set(m.id, m))
  return project
}

export async function getProjects () {
  const response = await authenticatedFetch('/api/scenario')
  return await parseJSON(response)
}
