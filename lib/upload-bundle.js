/** upload a new bundle */

import React, { Component } from 'react'

export default class UploadBundle extends Component {
  render () {
    return (
      <form action='/api/bundle' method='post' encType='multipart/form-data'>
        <legend>Upload Bundle</legend>
        <div className='form-group'>
          <label>Name</label>
          <input className='form-control' type='text' name='name' />
        </div>
        <div className='form-group'>
          <label>GTFS files</label>
          <input type='file' multiple name='files' />
        </div>
        <input type='hidden' name='projectId' value='changeme' />
        <input className='btn btn-default' type='submit' />
      </form>
    )
  }
}
