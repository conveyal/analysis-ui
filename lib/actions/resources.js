import {stringify} from 'querystring'
import {createAction} from 'redux-actions'

import {API} from 'lib/constants'
import fetch from 'lib/fetch-action'

export const addResource = createAction('add resource')

export const createResource = ({file, name, regionId}) => async dispatch => {
  const resource = await dispatch(
    fetch({
      url: API.Resources,
      options: {
        body: {
          name,
          regionId,
          filename: file.name,
          size: file.size,
          contentType: file.type
        },
        method: 'post'
      }
    })
  )

  const url = `${API.Resources}/${resource._id}/upload`
  const body = new window.FormData()
  body.append('file', file)

  if (resource.offline) {
    return dispatch(
      fetch({
        url,
        options: {
          body,
          method: 'post'
        }
      })
    )
  } else {
    // get the S3 upload URL
    const uploadUrl = await dispatch(fetch({url}))
    await dispatch(
      fetch({
        url: uploadUrl,
        options: {
          body,
          headers: {
            Authorization: null
          },
          // Required by S3
          // https://docs.aws.amazon.com/AmazonS3/latest/dev/PresignedUrlUploadObjectJavaSDK.html
          method: 'put'
        }
      })
    )

    // Update the resource with it's URL and a ready status
    return dispatch(
      fetch({
        url: `${API.Resources}/${resource._id}`,
        options: {
          body: {
            ...resource,
            ready: true,
            url: uploadUrl.split('?')[0] // drop the query parameters
          },
          method: 'put'
        }
      })
    )
  }
}

export const deleteResource = resource =>
  fetch({
    url: `${API.Resources}/${resource._id}`,
    options: {
      method: 'delete'
    }
  })

export const downloadResource = resource =>
  fetch({
    url: `${API.Resources}/${resource._id}/download`
  })

export const loadAllResources = query =>
  fetch({
    url: `${API.Resources}?${stringify(query)}`
  })

export const updateResource = resource =>
  fetch({
    url: `${API.Resources}/${resource._id}`,
    options: {
      body: resource,
      method: 'put'
    }
  })
