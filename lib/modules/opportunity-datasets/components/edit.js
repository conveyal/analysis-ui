import {
  faDownload,
  faPencilAlt,
  faTrash
} from '@fortawesome/free-solid-svg-icons'
import {withRouter} from 'next/router'
import React from 'react'
import {useDispatch} from 'react-redux'

import Icon from 'lib/components/icon'
import {Button} from 'lib/components/buttons'
import {Group} from 'lib/components/input'
import message from 'lib/message'

import {
  deleteOpportunityDataset,
  deleteSourceSet,
  downloadOpportunityDataset
} from '../actions'

export default function EditOpportunityDatatset(p) {
  const dispatch = useDispatch()

  function _editName() {
    const newName = window.prompt(message('opportunityDatasets.enterName'))
    if (newName !== p.opportunityDataset.name) {
      dispatch(
        editOpportunityDataset({
          ...p.opportunityDataset,
          name: newName
        })
      )
    }
  }

  function _deleteDataset() {
    if (window.confirm(message('opportunityDatasets.confirmDelete'))) {
      dispatch(deleteOpportunityDataset(p.opportunityDataset))
    }
  }

  function _deleteSourceSet() {
    if (window.confirm(message('opportunityDatasets.confirmDeleteSource'))) {
      dispatch(deleteSourceSet(p.opportunityDataset.sourceId))
    }
  }

  function _downloadTiff() {
    dispatch(downloadOpportunityDataset(p.opportunityDataset, 'tiff'))
  }

  function _downloadGrid() {
    dispatch(downloadOpportunityDataset(p.opportunityDataset, 'grid'))
  }

  return (
    <>
      <Group label={p.opportunityDataset.name}>
        <Button
          block
          onClick={_editName}
          style='warning'
          title={message('opportunityDatasets.editName')}
        >
          <Icon icon={faPencilAlt} /> {message('opportunityDatasets.editName')}
        </Button>
        <Button
          block
          onClick={_deleteDataset}
          style='danger'
          title={message('opportunityDatasets.delete')}
        >
          <Icon icon={faTrash} /> {message('opportunityDatasets.delete')}
        </Button>
        <Button
          block
          onClick={_deleteSourceSet}
          style='danger'
          title={message('opportunityDatasets.deleteSource')}
        >
          <Icon icon={faTrash} /> {message('opportunityDatasets.deleteSource')}
        </Button>
      </Group>
      <Group label={message('analysis.gisExport')}>
        <Button
          block
          onClick={_downloadTiff}
          style='success'
          title={message('opportunityDatasets.downloadTiff')}
        >
          <Icon icon={faDownload} />{' '}
          {message('opportunityDatasets.downloadTiff')}
        </Button>
        <Button
          block
          onClick={_downloadGrid}
          style='success'
          title={message('opportunityDatasets.downloadGrid')}
        >
          <Icon icon={faDownload} />{' '}
          {message('opportunityDatasets.downloadGrid')}
        </Button>
      </Group>
    </>
  )
}
