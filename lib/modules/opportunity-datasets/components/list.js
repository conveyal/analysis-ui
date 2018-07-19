// @flow
import message from '@conveyal/woonerf/message'
import Icon from '@conveyal/woonerf/components/icon'
import differenceInHours from 'date-fns/difference_in_hours'
import distanceInWords from 'date-fns/distance_in_words_to_now'
import memoize from 'lodash/memoize'
import React, {PureComponent} from 'react'
import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'

import {Button} from '../../../components/buttons'
import EditOpportunityDataset from './edit'
import {Group} from '../../../components/input'
import * as actions from '../actions'
import * as select from '../selectors'
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
  activeOpportunityDataset?: OpportunityDataset,
  uploadStatuses: UploadStatus[],

  checkUploadStatus: () => void,
  clearStatus: (statusId: string) => void,
  deleteOpportunityDataset: (dataset: OpportunityDataset) => void,
  deleteSourceSet: (sourceId: string) => void,
  downloadOpportunityDataset: (dataset: OpportunityDataset, format: string) => void,
  goToUpload: () => void
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
    this._startCheckUpload()
  }

  componentWillUnmount () {
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

  render () {
    const {activeOpportunityDataset, goToUpload} = this.props
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
          title={message('opportunityDatasets.upload')}
          ><Icon type='plus' /> Upload a new dataset
        </Button>
      </Group>
      <p className='center'>{message('opportunityDatasets.select')}</p>
      <Group>
        <Selector />
      </Group>
      {activeOpportunityDataset &&
        <EditOpportunityDataset {...this.props} />}
    </div>
  }
}

const Status = (status: UploadStatus & {clear: () => void}) =>
  <div className={`alert alert-${statusToStyle(status.status)}`}>
    {isErrorOrDone(status.status) &&
      <button
        className='close'
        onClick={status.clear}
        type='button'>&times;</button>}
    <p><strong>{status.name} ({status.status})</strong></p>
    {status.status === 'DONE' &&
      <p>
        {message('opportunityDatasets.finishedUploading', {
          total: status.totalFeatures,
          completedAt: distanceInWords(status.completedAt)
        })}
        <a
          onClick={() => { status.clear(); window.location.reload(true) }}
          tabIndex={0}
        >{message('opportunityDatasets.reloadPage')}</a>
      </p>}
    {!isErrorOrDone(status.status) &&
      <p>
        {message('opportunityDatasets.uploadProgress', {
          createdAt: distanceInWords(status.createdAt),
          completed: status.completedFeatures,
          total: status.totalFeatures
        })}
      </p>}
    {status.message && status.message.length > 0 && <p>{status.message}</p>}
  </div>

export default connect(createStructuredSelector(select), {
  ...actions,
  goToUpload: () => actions.goTo('/upload')
})(ListOpportunityDatasets)
