import React, {Component, PropTypes} from 'react'

import {Group, Text} from './components/input'
import authenticatedFetch, {parseJSON} from './utils/authenticated-fetch'

// how often to poll when waiting for a bundle to be read on the server.
const POLL_TIMEOUT_MS = 1000

export default class CreateBundle extends Component {
  static propTypes = {
    projectId: PropTypes.string.isRequired,
    reload: PropTypes.func.isRequired
  }

  state = {
    updloading: false,
    uploadFailed: false,
    bundleId: null
  }

  submit = (e) => {
    // don't submit the form
    e.preventDefault()

    const data = new window.FormData(e.target)

    authenticatedFetch('/api/bundle', {
      method: 'post',
      body: data
    })
    .then(parseJSON)
    .then((res) => {
      this.setState({...this.state, bundleId: res.id})
      setTimeout(this.checkUploadState, POLL_TIMEOUT_MS)
    }, (err) => {
      console.error(err)
      console.error(err.stack)
      this.setState({...this.state, uploading: false, uploadFailed: true})
    })

    this.setState({...this.state, uploading: true, uploadFailed: false})
  }

  /** check if the upload has completed */
  checkUploadState = () => {
    authenticatedFetch(`/api/bundle/${this.state.bundleId}`)
    .then(parseJSON)
    .then((res) => {
      if (res.status === 'DONE') {
        this.props.reload(this.state.bundleId)
      } else {
        setTimeout(this.checkUploadState, POLL_TIMEOUT_MS)
      }
    }, (err) => {
      console.error(err, err.stack)
      // this request failing does not imply that the bundle failed to upload
      setTimeout(this.checkUploadState, POLL_TIMEOUT_MS)
    })
  }

  render () {
    const {projectId} = this.props
    const {uploadFailed, uploading} = this.state
    return (
      <form
        encType='multipart/form-data'
        method='post'
        onSubmit={this.submit}
        >
        <legend>Create new bundle</legend>

        {uploadFailed &&
          <div className='alert alert-danger'>Upload failed</div>
        }

        <Text
          placeholder='Bundle name'
          name='Name'
          />
        <Group label='GTFS files'>
          <input className='form-control' type='file' multiple name='files' />
        </Group>

        <input type='hidden' name='projectId' value={projectId} />

        <Group>
          {uploading
            ? <span><i className='fa fa-spin fa-spinner'></i>&nbsp;Uploading&nbsp;.&nbsp;.&nbsp;.</span>
            : <input className='btn btn-block btn-success' type='submit' value='Create new bundle' />
          }
        </Group>
      </form>
    )
  }
}
