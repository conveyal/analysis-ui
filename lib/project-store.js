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

    project.modifications = modifications
    project.modificationsById = arrayToObject(modifications)

    return project
  } else {
    throw new Error(projectResponse.statusText)
  }
}

function arrayToObject (a) {
  const o = {}
  for (let i = 0; i < a.length; i++) o[a[i].id] = a[i]
  return o
}

export async function getAll () {
  const response = await authenticatedFetch('/api/scenario')
  return await parseJSON(response)
}
