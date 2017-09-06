// @flow
import Icon from '@conveyal/woonerf/components/icon'
import React, {Component} from 'react'

import {Button} from './buttons'
import {Body, Heading, Panel} from './panel'
import {File, Text} from './input'
import messages from '../utils/messages'

import type {Bundle} from '../types'

// how often to poll when waiting for a bundle to be read on the server.
const POLL_TIMEOUT_MS = 1000
const STATUS_DONE = 'DONE'

type Props = {
  bundle?: Bundle,
  bundleId?: string,
  name?: string,
  projectId: string,

  addBundle: (Bundle) => void,
  deleteBundle: () => void,
  fetch: (any) => void,
  saveBundle: (Bundle) => void
}

export default class CreateBundle extends Component {
  props: Props

  state = {
    files: undefined,
    name: this.props.name,
    uploading: false,
    uploadFailed: false,
    bundleId: this.props.bundleId
  }

  componentWillReceiveProps (nextProps: Props) {
    this.setState({
      name: nextProps.name
    })
  }

  _submit = (e: Event) => {
    // don't submit the form
    e.preventDefault()
    const {bundle, fetch, saveBundle} = this.props
    const {files, name} = this.state
    if (bundle && name) {
      bundle.name = name
      saveBundle(bundle)
    } else if (name && files) {
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

  _deleteBundle = () => {
    if (window.confirm(messages.bundle.deleteConfirmation)) {
      this.props.deleteBundle()
    }
  }

  _setName = (e: Event & {target: HTMLInputElement}) => {
    this.setState({name: e.target.value})
  }

  render () {
    const {bundleId, projectId} = this.props
    const {files, name, uploadFailed, uploading} = this.state
    return (
      <Panel>
        <Heading>
          {bundleId ? messages.bundle.edit : messages.bundle.create}
        </Heading>
        <Body>
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

            {!bundleId &&
              <File
                label='GTFS files'
                multiple
                name='files'
                onChange={e =>
                  this.setState({files: e.target.value})}
                value={files}
              />}

            <input type='hidden' name='projectId' value={projectId} />
            <input
              className='btn btn-block btn-success'
              disabled={uploading || !name || (!bundleId && !files)}
              type='submit'
              value={bundleId ? messages.bundle.edit : messages.bundle.create}
            />
            {bundleId &&
              <Button block style='danger' onClick={this._deleteBundle}>
                <Icon type='trash' /> {messages.bundle.delete}
              </Button>}
            {uploading &&
              <span>
                <Icon className='fa-spin' type='spinner' />{' '}
                {bundleId ? 'Uploading' : 'Processing'}&hellip;
              </span>}
          </form>
        </Body>
      </Panel>
    )
  }
}
