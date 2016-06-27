/**
 * Store projects.
 * This implementation uses local storage. We'll want to switch it out for a server component at some point.
 */

import authenticatedFetch, {parseJSON} from './utils/authenticated-fetch'

export async function save (project) {
  const response = await authenticatedFetch(`/api/scenario/${project.id}`, {
    method: 'put',
    body: JSON.stringify(project)
  })
  return await parseJSON(response)
}

export async function get (id) {
  const projectResponse = await authenticatedFetch(`/api/scenario/${id}`)
  const modsResponse = await authenticatedFetch(`/api/scenario/${id}/modifications`)

  if (projectResponse.ok && modsResponse.ok) {
    const project = await parseJSON(projectResponse)
    const modifications = await parseJSON(modsResponse)

    project.modifications = new Map()
    modifications.forEach((m) => project.modifications.set(m.id, m))
    return project
  } else {
    throw new Error(projectResponse.statusText)
  }
}

export async function getAll () {
  const response = await authenticatedFetch('/api/scenario')
  return await parseJSON(response)
}
