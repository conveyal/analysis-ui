import {faPlus, faUsers} from '@fortawesome/free-solid-svg-icons'
import differenceInHours from 'date-fns/difference_in_hours'
import {useRouter} from 'next/router'
import React from 'react'
import {useDispatch, useSelector} from 'react-redux'

import {Button} from 'lib/components/buttons'
import Icon from 'lib/components/icon'
import {Group} from 'lib/components/input'
import Link from 'lib/components/link'
import useInterval from 'lib/hooks/use-interval'
import message from 'lib/message'

import {checkUploadStatus, clearStatus, downloadLODES} from '../actions'
import * as select from '../selectors'

import EditOpportunityDataset from './edit'
import Selector from './selector'
import Status from './status'

const uploadingOrProcessing = s => ['UPLOADING', 'PROCESSING'].includes(s)
const UPLOAD_STATUS_CHECK_INTERVAL = 5000 // five seconds

export default function ListOpportunityDatasets(p) {
  const dispatch = useDispatch()
  const router = useRouter()
  const activeOpportunityDataset = useSelector(select.activeOpportunityDataset)
  const uploadStatuses = useSelector(select.uploadStatuses)
  const {regionId} = router.query

  useInterval(() => {
    if (uploadStatuses.find(status => uploadingOrProcessing(status.status))) {
      dispatch(checkUploadStatus(regionId))
    }
  }, UPLOAD_STATUS_CHECK_INTERVAL)

  function _clearStatus(statusId) {
    dispatch(clearStatus(statusId))
  }

  function _downloadLODES() {
    if (window.confirm(message('opportunityDatasets.confirmLODES'))) {
      dispatch(downloadLODES(regionId))
    }
  }

  const recentStatuses = uploadStatuses.filter(
    status =>
      differenceInHours(status.completedAt || status.createdAt, new Date()) < 24
  )

  return (
    <>
      {recentStatuses.length > 0 && <h5>Upload Status</h5>}
      {recentStatuses.map((status, i) => (
        <Status
          clear={() => _clearStatus(status.id)}
          key={`us-${i}`}
          {...status}
        />
      ))}
      <Group>
        <Link to='opportunitiesUpload' regionId={regionId}>
          <Button
            block
            style='success'
            title={message('opportunityDatasets.upload')}
          >
            <Icon icon={faPlus} /> {message('opportunityDatasets.upload')}
          </Button>
        </Link>
        <Button
          block
          onClick={_downloadLODES}
          style='primary'
          title={message('opportunityDatasets.downloadLODES')}
        >
          <Icon icon={faUsers} /> {message('opportunityDatasets.downloadLODES')}
        </Button>
      </Group>
      <p className='text-center'>{message('opportunityDatasets.select')}</p>
      <Group>
        <Selector regionId={regionId} />
      </Group>
      {activeOpportunityDataset && (
        <EditOpportunityDataset opportunityDataset={activeOpportunityDataset} />
      )}
    </>
  )
}
