// @flow
import Icon from '@conveyal/woonerf/components/icon'
import React, {Component} from 'react'

import {File, Text} from './input'
import messages from '../utils/messages'

import type {Bundle} from '../types'

// how often to poll when waiting for a bundle to be read on the server.
const POLL_TIMEOUT_MS = 10000
const STATUS_DONE = 'DONE'

type Props = {
  projectId: string,

  addBundle: (Bundle) => void,
  deleteBundle: () => void,
  fetch: (any) => void,
  saveBundle: (Bundle) => void
}

export default class CreateBundle extends Component {
  props: Props

  state = {
    bundleId: null,
    files: undefined,
    name: '',
    uploading: false,
    uploadFailed: false
  }

  _submit = (e: Event) => {
    // don't submit the form
    e.preventDefault()
    const {fetch} = this.props
    const {files, name} = this.state
    if (name && files) {
      fetch({
        url: '/api/bundle',
        options: {
          body: new window.FormData(e.target),
          method: 'post'
        },
        next: (err, response) => {
          if (err) {
            console.error(err)
            console.error(err.stack)
            this.setState({uploading: false, uploadFailed: true})
          } else {
            this.setState({bundleId: response.value.id})
            setTimeout(this._checkUploadState, POLL_TIMEOUT_MS)
          }
        }
      })

      this.setState({uploading: true, uploadFailed: false})
    }
  }

  /** check if the upload has completed */
  _checkUploadState = () => {
    const {addBundle, fetch} = this.props
    if (this.state.bundleId != null) {
      fetch({
        url: `/api/bundle/${this.state.bundleId}`,
        next: (error, response) => {
          if (error) {
            console.error(error, error.stack)
            // this request failing does not imply that the bundle failed to upload
            setTimeout(this._checkUploadState, POLL_TIMEOUT_MS)
          } else if (response.value.status === STATUS_DONE) {
            this.setState({
              files: undefined,
              name: undefined,
              uploading: false,
              uploadFailed: false,
              bundleId: undefined
            })
            addBundle(response.value)
          } else {
            setTimeout(this._checkUploadState, POLL_TIMEOUT_MS)
          }
        }
      })
    }
  }

  _setName = (e: Event & {target: HTMLInputElement}) => {
    this.setState({name: e.target.value})
  }

  render () {
    const {projectId} = this.props
    const {files, name, uploadFailed, uploading} = this.state
    return (
      <div>
        <h5>{messages.bundle.create}</h5>
        <form
          encType='multipart/form-data'
          method='post'
          onSubmit={this._submit}
        >
          {uploadFailed &&
            <div className='alert alert-danger'>Upload failed</div>}

          <Text
            name='Name'
            onChange={this._setName}
            placeholder='Bundle name'
            value={name}
          />

          <File
            label='GTFS files'
            multiple
            name='files'
            onChange={e =>
              this.setState({files: e.target.value})}
            value={files}
          />

          <input type='hidden' name='projectId' value={projectId} />
          <input
            className='btn btn-block btn-success'
            disabled={uploading || !name || !files}
            type='submit'
            value={messages.bundle.create}
          />

          {uploading &&
            <span>
              <Icon className='fa-spin' type='spinner' /> Processing &hellip;
            </span>}
        </form>
      </div>
    )
  }
}
