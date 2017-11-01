// @flow
import Icon from '@conveyal/woonerf/components/icon'
import memoize from 'lodash/memoize'
import React, {PureComponent} from 'react'
import {connect} from 'react-redux'

import {Button} from '../../../components/buttons'
import {File, Text} from '../../../components/input'
import {Body} from '../../../components/panel'
import messages from '../../../utils/messages'

import {uploadOpportunityDataset} from '../actions'

/** Create an opportunity dataset by uploading files */
export class UploadOpportunityDataset extends PureComponent {
  props: {
    uploadOpportunityDataset: (body: FormData) => void
  }

  state: {
    csv: boolean,
    files: void | FileList,
    name: void | string
  }

  form: HTMLFormElement

  state = {
    files: undefined,
    csv: false,
    latField: null,
    lonField: null,
    name: null,
    uploading: false
  }

  _submit = (e: Event & {target: EventTarget}) => {
    e.preventDefault()
    const body = new window.FormData(this.form)
    this.setState({uploading: true})
    this.props.uploadOpportunityDataset(body)
  }

  _setFiles = (e: Event & {target: HTMLInputElement}) => {
    const files = e.target.files
    // signal if it's a CSV file; if so, we need to show extra fields
    // if it's a shapefile, this is not needed
    const csv =
      files.length === 1 && files[0].name.toLowerCase().endsWith('.csv')
    this.setState({files, csv})
  }

  _setStateFromTargetValue = memoize((name) =>
    (e: Event & {target: HTMLInputElement}) =>
      this.setState({[name]: e.target.value}))

  render () {
    const {csv, files, latField, lonField, name, uploading} = this.state

    return (
      <Body>
        <h5>{messages.analysis.createGrid}</h5>
        <p>{messages.analysis.createGridTooltip}</p>
        <form
          encType='multipart/form-data'
          ref={(form) => { this.form = form }}
          >
          <Text
            name='Name'
            label={`${messages.analysis.gridName}*`}
            placeholder={messages.analysis.gridName}
            value={name}
            onChange={this._setStateFromTargetValue('name')}
          />

          <File
            multiple
            label={`${messages.analysis.gridFiles}*`}
            name='files'
            onChange={this._setFiles}
          />

          {csv &&
            <span>
              <Text
                name='latField'
                label={messages.analysis.latField}
                placeholder={messages.analysis.latField}
                value={latField}
                onChange={this._setStateFromTargetValue('latField')}
              />

              <Text
                name='lonField'
                label={messages.analysis.lonField}
                placeholder={messages.analysis.lonField}
                value={lonField}
                onChange={this._setStateFromTargetValue('lonField')}
              />
            </span>}

          <Button
            className='btn btn-block btn-success'
            disabled={uploading || !name || !files}
            onClick={this._submit}
            type='success'
            >{uploading
              ? <span>
                <Icon type='spinner' className='fa-spin' /> {messages.analysis.uploading}
              </span>
              : <span><Icon type='plus' /> {messages.analysis.createGrid}</span>}
          </Button>
        </form>
      </Body>
    )
  }
}

export default connect(null, {
  uploadOpportunityDataset
})(UploadOpportunityDataset)
