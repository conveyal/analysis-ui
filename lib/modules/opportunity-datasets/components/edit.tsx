import {Button, Heading, Stack} from '@chakra-ui/core'
import {useDispatch} from 'react-redux'

import message from 'lib/message'

import {
  deleteOpportunityDataset,
  deleteSourceSet,
  downloadOpportunityDataset,
  editOpportunityDataset
} from '../actions'

export default function EditOpportunityDatatset(p) {
  const dispatch = useDispatch<any>()

  function _editName() {
    const newName = window.prompt(message('opportunityDatasets.enterName'))
    if (newName && newName !== p.opportunityDataset.name) {
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

  async function _downloadTiff() {
    const value = await dispatch(
      downloadOpportunityDataset(p.opportunityDataset, 'tiff')
    )
    window.open(value.url)
  }

  async function _downloadGrid() {
    const value = await dispatch(
      downloadOpportunityDataset(p.opportunityDataset, 'grid')
    )
    window.open(value.url)
  }

  return (
    <Stack spacing={4}>
      <Stack spacing={2}>
        <Heading size='md'>{p.opportunityDataset.name}</Heading>
        <Button
          leftIcon='edit'
          onClick={_editName}
          variantColor='yellow'
          title={message('opportunityDatasets.editName')}
        >
          {message('opportunityDatasets.editName')}
        </Button>
        <Button
          leftIcon='delete'
          onClick={_deleteDataset}
          variantColor='red'
          title={message('opportunityDatasets.delete')}
        >
          {message('opportunityDatasets.delete')}
        </Button>
        <Button
          leftIcon='delete'
          onClick={_deleteSourceSet}
          variantColor='red'
          title={message('opportunityDatasets.deleteSource')}
        >
          {message('opportunityDatasets.deleteSource')}
        </Button>
      </Stack>
      <Stack spacing={2}>
        <Heading size='md'>{message('analysis.gisExport')}</Heading>
        <Button
          leftIcon='download'
          onClick={_downloadTiff}
          variantColor='green'
          title={message('opportunityDatasets.downloadTiff')}
        >
          {message('opportunityDatasets.downloadTiff')}
        </Button>
        <Button
          leftIcon='download'
          onClick={_downloadGrid}
          variantColor='green'
          title={message('opportunityDatasets.downloadGrid')}
        >
          {message('opportunityDatasets.downloadGrid')}
        </Button>
      </Stack>
    </Stack>
  )
}
