import {faCheck, faSpinner} from '@fortawesome/free-solid-svg-icons'
import React from 'react'

import message from '../message'

import Icon from './icon'
import {File, Text} from './input'

// how often to poll when waiting for a bundle to be read on the server.
const POLL_TIMEOUT_MS = 10000
const STATUS_DONE = 'DONE'
const STATUS_ERROR = 'ERROR'
const BUNDLE_URL = `${process.env.API_URL}/bundle`

export default function CreateBundle(p) {
  const [bundleId, setBundleId] = React.useState()
  const [uploading, setUploading] = React.useState(false)
  const [uploadFailed, setUploadFailed] = React.useState(false)
  const [name, setName] = React.useState('')
  const [files, setFiles] = React.useState()

  /** check if the upload has completed */
  function checkUploadState() {
    if (bundleId != null) {
      p.fetch({
        url: `${BUNDLE_URL}/${bundleId}`,
        next: (error, response) => {
          if (error) {
            console.error(error, error.stack)
            // this request failing does not imply that the bundle failed to upload
            setTimeout(checkUploadState, POLL_TIMEOUT_MS)
          } else if (response.value.status === STATUS_DONE) {
            this.setState({
              files: undefined,
              name: undefined,
              uploading: false,
              uploadFailed: false,
              bundleId: undefined
            })
            p.addBundle(response.value)
          } else if (response.value.status === STATUS_ERROR) {
            setUploading(false)
            setUploadFailed(response.value.errorCode)
          } else {
            setTimeout(checkUploadState, POLL_TIMEOUT_MS)
          }
        }
      })
    }
  }

  function submit(e) {
    // don't submit the form
    e.preventDefault()
    if (name && files) {
      setUploading(true)
      setUploadFailed(false)

      p.fetch({
        url: BUNDLE_URL,
        options: {
          body: new window.FormData(e.target),
          method: 'post'
        },
        next: (err, response) => {
          if (err) {
            console.error(err)
            console.error(err.stack)
            setUploading(false)
            setUploadFailed(true)
          } else {
            setBundleId(response.value._id)
            setTimeout(checkUploadState, POLL_TIMEOUT_MS)
          }
        }
      })
    }
  }

  const {regionId} = p.query

  return (
    <>
      <h5>{message('bundle.create')}</h5>
      <form encType='multipart/form-data' method='post' onSubmit={submit}>
        {uploading && (
          <div className='alert alert-warning'>
            {message('bundle.processing')}
          </div>
        )}
        {uploadFailed && (
          <div className='alert alert-danger'>
            <strong>{message('bundle.failure')}</strong>
            <br />
            {uploadFailed}
          </div>
        )}
        <Text
          label={message('bundle.name')}
          name={message('common.name')}
          onChange={e => setName(e.target.value)}
          placeholder='Name'
          value={name}
        />

        <File
          label={message('bundle.files')}
          multiple
          name='files'
          onChange={e => setFiles(e.target.value)}
          value={files}
        />

        {name && files && !uploading && !uploadFailed && (
          <div className='alert alert-warning'>{message('bundle.notice')}</div>
        )}
        <input type='hidden' name='regionId' value={regionId} />
        <button
          className='btn btn-block btn-success'
          disabled={uploading || !name || !files}
          type='submit'
        >
          {uploading ? (
            <>
              <Icon icon={faSpinner} fixedWidth spin />
              {message('common.processing')}
            </>
          ) : (
            <>
              <Icon icon={faCheck} fixedWidth /> {message('common.create')}
            </>
          )}
        </button>
      </form>
    </>
  )
}
