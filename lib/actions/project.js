// @flow
import fetch from '@conveyal/woonerf/fetch'
import {createAction} from 'redux-actions'
import {push} from 'react-router-redux'

import {setBundles} from './'
import {setCenter as setMapCenter} from './map'
import {setAll as setScenarios} from './scenario'
import timeout from '../utils/timeout'

import OpportunityDatasets from '../modules/opportunity-datasets'

import type {Bookmark, Project} from '../types'

const saveToServer = (
  project: Project,
  customOpenStreetMapData?: File,
  method: string
) => {
  const formData = new window.FormData()
  formData.append('project', JSON.stringify(project))
  if (customOpenStreetMapData) {
    formData.append('customOpenStreetMapData', customOpenStreetMapData)
  }

  return fetch({
    url: method.toLowerCase() === 'put'
      ? `/api/project/${project._id}`
      : '/api/project',
    options: {
      body: formData,
      method
    },
    next: (error, response) =>
      !error && [
        setLocally(response.value),
        awaitLoad(response.value._id, () =>
          push(`/projects/${response.value._id}`)
        )
      ]
  })
}

export const create = ({
  project,
  customOpenStreetMapData
}: {
  project: Project,
  customOpenStreetMapData?: File
}) => saveToServer(project, customOpenStreetMapData, 'post')

export const save = ({
  project,
  customOpenStreetMapData
}: {
  project: Project,
  customOpenStreetMapData?: File
}) => [
  setLocally(project),
  saveToServer(project, customOpenStreetMapData, 'put')
]

export const deleteLocally = createAction('delete project')
export const deleteProject = (_id: string) =>
  fetch({
    options: {
      method: 'delete'
    },
    url: `/api/project/${_id}`,
    next: error => !error && [deleteLocally(_id), push('/')]
  })

export const load = (id: string) =>
  fetch({
    url: `/api/project/${id}`,
    next (error, response) {
      if (!error) {
        const project = response.value
        return [
          setLocally({...project, bundles: [], scenarios: []}),
          setMapCenter([
            (project.bounds.west + project.bounds.east) / 2,
            (project.bounds.north + project.bounds.south) / 2
          ]),
          setBundles(project.bundles),
          setScenarios(project.scenarios)
        ]
      }
    }
  })

export const awaitLoad = (_id: string, next: () => void) =>
  fetch({
    url: `/api/project/${_id}`,
    next (err, response) {
      if (!err) {
        if (response.value.loadStatus !== 'DONE') {
          return [
            setLocally(response.value),
            timeout(5000).then(() => awaitLoad(_id, next))
          ]
        } else return [setLocally(response.value), next()]
      }
    }
  })

export const loadAll = () =>
  fetch({
    url: '/api/project',
    next: (error, response) => !error && setAll(response.value)
  })

const setProjectLocally = createAction('set project')

export const setAll = createAction('set all projects')
export const setLocally = (project: Project) => {
  if (project.opportunityDatasets != null && project.opportunityDatasets.length > 0) {
    const dataset = project.opportunityDatasets.find(i => i.key === 'Jobs_total') ||
      project.opportunityDatasets[0]
    return [
      setProjectLocally(project),
      OpportunityDatasets.actions.setOpportunityDatasets(project.opportunityDatasets),
      OpportunityDatasets.actions.loadOpportunityDataset(dataset)
    ]
  } else {
    return setProjectLocally(project)
  }
}

const createBookmarkLocally = createAction('create bookmark')
export const createBookmark = (bookmark: Bookmark) => [
  fetch({
    url: `/api/project/${bookmark.projectId}/bookmark`,
    options: {
      body: bookmark,
      method: 'post'
    },
    next (error, response) {
      if (!error) return createBookmarkLocally(response.value)
    }
  })
]
