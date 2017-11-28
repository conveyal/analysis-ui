// @flow
import Icon from '@conveyal/woonerf/components/icon'
import differenceInHours from 'date-fns/difference_in_hours'
import distanceInWords from 'date-fns/distance_in_words_to_now'
import memoize from 'lodash/memoize'
import React, {PureComponent} from 'react'
import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'
import messages from '../../../utils/messages'

import {Button} from '../../../components/buttons'
import {Group} from '../../../components/input'
import {
  addOpportunityComponent,
  checkUploadStatus,
  clearStatus,
  createGoTo,
  deleteOpportunityDataset,
  downloadOpportunityDataset,
  removeOpportunityComponent
} from '../actions'
import {
  selectActiveOpportunityDataset,
  selectUploadStatuses
} from '../selectors'
import Selector from './selector'

import type {OpportunityDataset, UploadStatus} from '../types'

const UPLOAD_STATUS_CHECK_INTERVAL = 5000 // five seconds

const isErrorOrDone = (status) => status === 'ERROR' || status === 'DONE'
function statusToStyle (status): string {
  switch (status) {
    case 'ERROR': return 'danger'
    case 'UPLOADING':
    case 'PROCESSING': return 'info'
    case 'DONE': return 'success'
    default: return 'warning'
  }
}

type Props = {
  activeDataset?: OpportunityDataset,
  uploadStatuses: UploadStatus[],

  addOpportunityComponent: () => void,
  checkUploadStatus: () => void,
  clearStatus: (statusId: string) => void,
  deleteOpportunityDataset: (dataset: OpportunityDataset) => void,
  downloadOpportunityDataset: (dataset: OpportunityDataset, format: string) => void,
  goToUpload: () => void,
  removeOpportunityComponent: () => void
}

export class ListOpportunityDatasets extends PureComponent {
  props: Props
  state = {
    uploadStatuses: this.props.uploadStatuses
  }

  _uploadStatusTimeout: number
  _checkUploadStatus () {
    this.props.checkUploadStatus()
    this._uploadStatusTimeout = setTimeout(() => {
      if (this.props.uploadStatuses.find((status) => !isErrorOrDone(status.status))) {
        this._checkUploadStatus()
      }
    }, UPLOAD_STATUS_CHECK_INTERVAL)
  }

  _startCheckUpload () {
    this._checkUploadStatus()
  }

  componentDidMount () {
    this.props.addOpportunityComponent()
    this._startCheckUpload()
  }

  componentWillUnmount () {
    this.props.removeOpportunityComponent()
    clearTimeout(this._uploadStatusTimeout)
  }

  componentWillReceiveProps (nextProps: Props) {
    this.setState({
      uploadStatuses: nextProps.uploadStatuses
    })
  }

  _clearStatus = memoize((statusId) => () => {
    this.setState({
      uploadStatuses: this.state.uploadStatuses.filter((s) => s.id !== statusId)
    })
    this.props.clearStatus(statusId)
  })

  _deleteDataset = () => {
    const {activeDataset} = this.props
    if (window.confirm('Are you sure you would like to delete this dataset?') && activeDataset) {
      this.props.deleteOpportunityDataset(activeDataset)
    }
  }

  _downloadTiff = () => {
    const {activeDataset} = this.props
    if (activeDataset) {
      this.props.downloadOpportunityDataset(activeDataset, 'tiff')
    }
  }

  _downloadGrid = () => {
    const {activeDataset} = this.props
    if (activeDataset) {
      this.props.downloadOpportunityDataset(activeDataset, 'grid')
    }
  }

  render () {
    const {activeDataset, goToUpload} = this.props
    const {uploadStatuses} = this.state
    return <div>
      {uploadStatuses.length > 0 && <h5>Upload Status</h5>}
      {uploadStatuses
          .filter((status) => differenceInHours(status.completedAt || status.createdAt, new Date()) < 24)
          .map((status, i) =>
            <Status
              clear={this._clearStatus(status.id)}
              key={`us-${i}`}
              {...status}
              />)}
      <Group>
        <Button
          block
          onClick={goToUpload}
          style='success'
          title={messages.opportunityDatasets.upload}
          ><Icon type='plus' /> Upload a new dataset
        </Button>
      </Group>
      <p className='center'>{messages.opportunityDatasets.select}</p>
      <Group>
        <Selector />
      </Group>
      {activeDataset && activeDataset.key &&
        <Button
          block
          onClick={this._deleteDataset}
          style='danger'
          title='Delete dataset'
          ><Icon type='trash' /> {messages.opportunityDatasets.delete}
        </Button>}
      {activeDataset && activeDataset.key &&
        <Group label={messages.analysis.gisExport}>
          <Button
            block
            onClick={this._downloadTiff}
            style='success'
            title='Download dataset'
            ><Icon type='download' /> {messages.opportunityDatasets.downloadTiff}
          </Button>
          <Button
            block
            onClick={this._downloadGrid}
            style='success'
            title='Download dataset'
            ><Icon type='download' /> {messages.opportunityDatasets.downloadGrid}
          </Button>
      </Group>}
    </div>
  }
}

const Status = (status: UploadStatus & {clear: () => void}) =>
  <div className={`alert alert-${statusToStyle(status.status)}`}>
    {isErrorOrDone(status.status) &&
      <button className='close' onClick={status.clear} type='button'>&times;</button>}
    <p><strong>{status.name} ({status.status})</strong></p>
    {status.status === 'DONE' &&
      <p>Finished uploading {status.totalFeatures} features {distanceInWords(status.completedAt)} ago. <a onClick={() => {
        status.clear()
        window.location.reload(true)
      }} tabIndex={0}>Reload page</a> to see results</p>}
    {!isErrorOrDone(status.status) && <p>Started {distanceInWords(status.createdAt)} ago and completed {status.completedFeatures}/{status.totalFeatures} features.</p>}
    {status.message && status.message.length > 0 && <p>{status.message}</p>}
  </div>

export default connect(createStructuredSelector({
  activeDataset: selectActiveOpportunityDataset,
  uploadStatuses: selectUploadStatuses
}), {
  addOpportunityComponent,
  checkUploadStatus,
  clearStatus,
  deleteOpportunityDataset,
  downloadOpportunityDataset,
  goToUpload: createGoTo('/upload'),
  removeOpportunityComponent
})(ListOpportunityDatasets)
