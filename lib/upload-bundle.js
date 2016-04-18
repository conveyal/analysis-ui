/** upload a new bundle */

import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {push} from 'react-router-redux'

import {Group, Text} from './components/input'
import Modal from './components/modal'
import authenticatedFetch from './utils/authenticated-fetch'

// how often to poll when waiting for a bundle to be read on the server.
const POLL_TIMEOUT_MS = 1000

function mapDispatchToProps (dispatch) {
  return {
    close: () => dispatch(push('/'))
  }
}

class UploadBundle extends Component {
  static propTypes = {
    close: PropTypes.func.isRequired
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
    .then((res) => {
      // https://developers.google.com/web/updates/2015/03/introduction-to-fetch?hl=en
      if (res.ok) return res.json()
      else return Promise.reject(new Error(res.statusText))
    })
    .then((res) => {
      this.setState(Object.assign({}, this.state, { bundleId: res.id }))
      setTimeout(this.checkUploadState, POLL_TIMEOUT_MS)
    }, (err) => {
      console.error(err)
      console.error(err.stack)
      this.setState(Object.assign({}, this.state, { uploading: false, uploadFailed: true }))
    })

    this.setState(Object.assign({}, this.state, { uploading: true, uploadFailed: false }))
  }

  /** check if the upload has completed */
  checkUploadState = (e) => {
    authenticatedFetch(`/api/bundle/${this.state.bundleId}`)
    .then((res) => {
      // https://developers.google.com/web/updates/2015/03/introduction-to-fetch?hl=en
      if (res.ok) return res.json()
      else return Promise.reject(new Error(res.statusText))
    })
    .then((res) => {
      if (res.status === 'DONE') {
        this.props.close()
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
    return (
      <Modal
        onRequestClose={this.props.close}
        >
        <form onSubmit={this.submit} method='post' encType='multipart/form-data'>
          <legend>Upload Bundle</legend>

          {this.state.uploadFailed ? <div className='alert alert-danger'>Upload failed</div> : []}

          <Text
            label='Name'
            name='Name'
            />
          <Group label='GTFS files'>
            <input className='form-control' type='file' multiple name='files' />
          </Group>

          <input type='hidden' name='projectId' value='changeme' />
          {this.state.uploading ? <span><i className='fa fa-spin fa-spinner'></i>&nbsp;Uploading&nbsp;.&nbsp;.&nbsp;.</span> : <input className='btn btn-success' type='submit' name='Upload' />}
        </form>
      </Modal>
    )
  }
}

export default connect((state) => state, mapDispatchToProps)(UploadBundle)
