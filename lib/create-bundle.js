import React, {Component, PropTypes} from 'react'

import {Group, Text} from './components/input'
import authenticatedFetch, {parseJSON} from './utils/authenticated-fetch'

// how often to poll when waiting for a bundle to be read on the server.
const POLL_TIMEOUT_MS = 1000

export default class CreateBundle extends Component {
  static propTypes = {
    projectId: PropTypes.string.isRequired,
    onBundleCreate: PropTypes.func.isRequired
  }

  state = {
    files: null,
    name: null,
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
        this.setState({files: [], name: '', uploading: false, uploadFailed: false})
        this.props.onBundleCreate(res)
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
    const {files, name, uploadFailed, uploading} = this.state
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
          name='Name'
          onChange={(e) => this.setState({...this.state, name: e.target.value})}
          placeholder='Bundle name'
          value={name}
          />
        <Group label='GTFS files'>
          <input
            className='form-control'
            multiple
            name='files'
            onChange={(e) => this.setState({...this.state, files: e.target.value})}
            type='file'
            value={files}
            />
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
