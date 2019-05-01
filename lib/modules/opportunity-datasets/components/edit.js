import {
  faDownload,
  faPencilAlt,
  faTrash
} from '@fortawesome/free-solid-svg-icons'
import React from 'react'

import Icon from 'lib/components/icon'
import {Button} from 'lib/components/buttons'
import {Group} from 'lib/components/input'
import message from 'lib/message'

export default function EditOpportunityDatatset(p) {
  function editName() {
    const newName = window.prompt(message('opportunityDatasets.enterName'))
    if (newName !== p.activeOpportunityDataset.name) {
      p.editOpportunityDataset({
        ...p.activeOpportunityDataset,
        name: newName
      })
    }
  }

  function deleteDataset() {
    if (window.confirm(message('opportunityDatasets.confirmDelete'))) {
      p.deleteOpportunityDataset(p.activeOpportunityDataset)
    }
  }

  function deleteSourceSet() {
    if (window.confirm(message('opportunityDatasets.confirmDeleteSource'))) {
      p.deleteSourceSet(p.activeOpportunityDataset.sourceId)
    }
  }

  function downloadTiff() {
    p.downloadOpportunityDataset(p.activeOpportunityDataset, 'tiff')
  }

  function downloadGrid() {
    p.downloadOpportunityDataset(p.activeOpportunityDataset, 'grid')
  }

  return (
    <>
      <Group label={p.activeOpportunityDataset.name}>
        <Button
          block
          onClick={editName}
          style='warning'
          title={message('opportunityDatasets.editName')}
        >
          <Icon icon={faPencilAlt} /> {message('opportunityDatasets.editName')}
        </Button>
        <Button
          block
          onClick={deleteDataset}
          style='danger'
          title={message('opportunityDatasets.delete')}
        >
          <Icon icon={faTrash} /> {message('opportunityDatasets.delete')}
        </Button>
        <Button
          block
          onClick={deleteSourceSet}
          style='danger'
          title={message('opportunityDatasets.deleteSource')}
        >
          <Icon icon={faTrash} /> {message('opportunityDatasets.deleteSource')}
        </Button>
      </Group>
      <Group label={message('analysis.gisExport')}>
        <Button
          block
          onClick={downloadTiff}
          style='success'
          title={message('opportunityDatasets.downloadTiff')}
        >
          <Icon icon={faDownload} />{' '}
          {message('opportunityDatasets.downloadTiff')}
        </Button>
        <Button
          block
          onClick={downloadGrid}
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
