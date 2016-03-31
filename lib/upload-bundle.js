/** upload a new bundle */

import React, { Component, PropTypes } from 'react'

import {Group, Text} from './components/input'
import authenticatedFetch from './utils/authenticated-fetch'

export default class UploadBundle extends Component {
  static propTypes = {
    close: PropTypes.func.isRequired
  }

  state = {
    updloading: false,
    uploadFailed: false
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
      // promise is only rejected if network error occurs: https://www.tjvantoll.com/2015/09/13/fetch-and-errors/
      if (!res.ok) {
        this.setState(Object.assign({}, this.state, { uploading: false, uploadFailed: true }))
      } else {
        this.props.close()
      }
    }, (err) => {
      console.error(err, err.stack)
      this.setState(Object.assign({}, this.state, { uploading: false, uploadFailed: true }))
    })

    this.setState(Object.assign({}, this.state, { uploading: true, uploadFailed: false }))
  }

  render () {
    return (
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
    )
  }
}
