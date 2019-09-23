import {createAction} from 'redux-actions'

import {API} from 'lib/constants'
import fetch from 'lib/fetch-action'

export const addResource = createAction('add resource')

export const createResource = ({file, name, regionId}) => async dispatch => {
  const response = dispatch(
    fetch({
      url: API.Resources,
      options: {
        body: {
          name,
          regionId,
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type
        },
        method: 'post'
      }
    })
  )
  console.log('create resource response', response)

  const url = response.uploadUrl
    ? response.uploadUrl
    : `${API.Resources}/${response.resource._id}/upload`
  await dispatch(postFile(url, file))

  return dispatch(updateResource({...response.resource, ready: true}))
}

export const updateResource = resource =>
  fetch({
    url: `${API.Resources}/${resource._id}`,
    options: {
      body: resource,
      method: 'put'
    }
  })

function postFile(url, file) {
  const body = new window.FormData()
  body.append('file', file)
  return fetch({
    url,
    options: {
      body,
      method: 'post'
    },
    next: response => {
      console.log('post file response', response)
    }
  })
}
