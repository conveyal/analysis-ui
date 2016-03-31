/** upload a new bundle */

import React, { Component, PropTypes } from 'react'
import authenticatedFetch from './utils/authenticated-fetch'

export default class UploadBundle extends Component {
  static propTypes = {
    close: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)
    this.state = { uploading: false, uploadFailed: false }
  }

  submit = (e) => {
    // don't submit the form
    e.preventDefault()

    let data = new window.FormData(e.target)

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
      this.setState(Object.assign({}, this.state, { uploading: false, uploadFailed: true }))
    })

    this.setState(Object.assign({}, this.state, { uploading: true, uploadFailed: false }))
  }

  render () {
    return (
      <form onSubmit={this.submit} method='post' encType='multipart/form-data'>
        <legend>Upload Bundle</legend>

        {this.state.uploadFailed ? <div className='alert alert-danger'>Upload failed</div> : []}

        <div className='form-group'>
          <label>Name</label>
          <input className='form-control' type='text' name='name' />
        </div>
        <div className='form-group'>
          <label>GTFS files</label>
          <input type='file' multiple name='files' />
        </div>
        <input type='hidden' name='projectId' value='changeme' />
        {this.state.uploading ? <span><i className='fa fa-spin fa-spinner'></i>&nbsp;Uploading&nbsp;.&nbsp;.&nbsp;.</span> : <input className='btn btn-default' type='submit' />}
      </form>
    )
  }
}
