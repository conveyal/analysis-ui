/** Create a grid by uploading files */

import React, { Component, PropTypes } from 'react'
import authenticatedFetch from '../utils/authenticated-fetch'
import Icon from './icon'
import {File, Text} from './input'
import {Body, Heading, Panel} from './panel'
import messages from '../utils/messages'

export default class CreateGrid extends Component {
  static propTypes = {
    projectId: PropTypes.string.isRequired,
    finish: PropTypes.func.isRequired
  }

  state = {
    uploading: false,
    id: null
  }

  render () {
    const { uploading } = this.state

    return <Panel>
      <Heading>{messages.analysis.createGrid}</Heading>
      { uploading ? this.renderUploading() : this.renderForm()}
    </Panel>
  }

  renderUploading () {
    return <Body>
      <Icon type='spinner' className='fa-spin pull-left' />
      {messages.analysis.uploading}
    </Body>
  }

  onSubmit = async (e) => {
    e.preventDefault()

    this.setState({ ...this.state, uploading: true })

    const body = new window.FormData(e.target)
    const { projectId, finish } = this.props

    // TODO make the backend async
    await authenticatedFetch(`/api/grid/${projectId}`, {
      method: 'post',
      body
    })

    // TODO handle error

    finish(projectId)
  }

  renderForm () {
    let { name, files, uploading, latField, lonField } = this.state

    return <Body>
      <form onSubmit={this.onSubmit} method='post' enctype='multipart/form-data'>
        <Text name='Name'
          label={messages.analysis.gridName}
          placeholder={messages.analysis.gridName}
          value={name}
          onChange={e => this.setState({...this.state, name: e.target.value})}
          />

        {/* TODO these next few are specific to CSV upload */}
        <Text name='latField'
          label={messages.analysis.latField}
          placeholder={messages.analysis.latField}
          value={latField}
          onChange={e => this.setState({...this.state, latField: e.target.value})}
          />

        <Text name='lonField'
          label={messages.analysis.lonField}
          placeholder={messages.analysis.lonField}
          value={lonField}
          onChange={e => this.setState({...this.state, lonField: e.target.value})}
          />

        <File
          multiple
          label={messages.analysis.gridFiles}
          name='files'
          onChange={(e) => this.setState({...this.state, files: e.target.value})}
          value={files}
          />

        <input
          className='btn btn-block btn-success'
          disabled={uploading || !name || !files}
          type='submit'
          value={messages.analysis.createGrid}
          />
      </form>
    </Body>
  }
}
