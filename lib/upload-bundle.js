/** upload a new bundle */

import React, { Component } from 'react'

export default class UploadBundle extends Component {
  render () {
    return <div>
      <form action='/bundle' method='post' encType='multipart/form-data'>
        <label>Name <input type='text' name='name' /></label><br/>
        <label>GTFS files: <input type='file' multiple name='files' /></label><br/>
        { /* TODO */}
        <input type='hidden' name='projectId' value='changeme' />
        <input type='submit' />
      </form>
    </div>
  }
}
