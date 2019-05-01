import {faPlus, faUsers} from '@fortawesome/free-solid-svg-icons'
import differenceInHours from 'date-fns/difference_in_hours'
import distanceInWords from 'date-fns/distance_in_words_to_now'
import React from 'react'
import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'

import {Button, ButtonLink} from '../../../components/buttons'
import Icon from '../../../components/icon'
import {Group} from '../../../components/input'
import {RouteTo} from '../../../constants'
import useInterval from '../../../hooks/use-interval'
import message from '../../../message'
import * as actions from '../actions'
import * as select from '../selectors'

import Selector from './selector'
import EditOpportunityDataset from './edit'

const UPLOAD_STATUS_CHECK_INTERVAL = 5000 // five seconds

const isErrorOrDone = status => status === 'ERROR' || status === 'DONE'
function statusToStyle(status) {
  switch (status) {
    case 'ERROR':
      return 'danger'
    case 'UPLOADING':
    case 'PROCESSING':
      return 'info'
    case 'DONE':
      return 'success'
    default:
      return 'warning'
  }
}

export function ListOpportunityDatasets(p) {
  const [uploadStatuses, setUploadStatuses] = React.useState(p.uploadStatuses)

  useInterval(() => {
    if (p.uploadStatuses.find(status => !isErrorOrDone(status.status))) {
      p.checkUploadStatus()
    }
  }, UPLOAD_STATUS_CHECK_INTERVAL)

  function clearStatus(statusId) {
    setUploadStatuses(us => us.filter(s => s.id !== statusId))
    p.clearStatus(statusId)
  }

  function downloadLODES() {
    if (window.confirm(message('opportunityDatasets.confirmLODES'))) {
      p.downloadLODES()
    }
  }

  return (
    <>
      {uploadStatuses.length > 0 && <h5>Upload Status</h5>}
      {uploadStatuses
        .filter(
          status =>
            differenceInHours(
              status.completedAt || status.createdAt,
              new Date()
            ) < 24
        )
        .map((status, i) => (
          <Status
            clear={() => clearStatus(status.id)}
            key={`us-${i}`}
            {...status}
          />
        ))}
      <Group>
        <ButtonLink
          block
          href={{
            pathname: RouteTo.opportunitiesUpload,
            query: {regionId: p.query.regionId}
          }}
          style='success'
          title={message('opportunityDatasets.upload')}
        >
          <Icon icon={faPlus} fixedWidth />{' '}
          {message('opportunityDatasets.upload')}
        </ButtonLink>
        <Button
          block
          onClick={downloadLODES}
          style='primary'
          title={message('opportunityDatasets.downloadLODES')}
        >
          <Icon icon={faUsers} fixedWidth />{' '}
          {message('opportunityDatasets.downloadLODES')}
        </Button>
      </Group>
      <p className='center'>{message('opportunityDatasets.select')}</p>
      <Group>
        <Selector />
      </Group>
      {p.activeOpportunityDataset && <EditOpportunityDataset {...p} />}
    </>
  )
}

const Status = p => (
  <div className={`alert alert-${statusToStyle(p.status)}`}>
    {isErrorOrDone(p.status) && (
      <button className='close' onClick={p.clear} type='button'>
        &times;
      </button>
    )}
    <p>
      <strong>
        {p.name} ({p.status})
      </strong>
    </p>
    {p.status === 'DONE' && (
      <p>
        {message('opportunityDatasets.finishedUploading', {
          total: `${p.totalGrids}`,
          completedAt: distanceInWords(p.completedAt)
        })}
        <a
          onClick={() => {
            p.clear()
            window.location.reload(true)
          }}
          tabIndex={0}
        >
          {' '}
          {message('opportunityDatasets.reloadPage')}
        </a>
      </p>
    )}
    {p.status === 'UPLOADING' && (
      <p>
        {message('opportunityDatasets.uploadProgress', {
          createdAt: distanceInWords(p.createdAt),
          completed: `${p.uploadedGrids}`,
          total: `${p.totalGrids}`
        })}
      </p>
    )}
    {p.message && p.message.length > 0 && <p>{p.message}</p>}
  </div>
)

export default connect(
  createStructuredSelector(select),
  actions
)(ListOpportunityDatasets)
