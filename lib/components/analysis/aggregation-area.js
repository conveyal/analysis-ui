import {faSpinner} from '@fortawesome/free-solid-svg-icons'
import React from 'react'

import message from 'lib/message'
import OpportunityDatasets from 'lib/modules/opportunity-datasets'

import {Button} from '../buttons'
import Icon from '../icon'
import {File, Group, Text} from '../input'
import Select from '../select'

export default function AggregationArea(p) {
  const [showUpload, setShowUpload] = React.useState(false)
  const [name, setName] = React.useState('')
  const [files, setFiles] = React.useState()

  return (
    <>
      <Group label={message('analysis.aggregateTo')}>
        <Select
          name='aggregateTo'
          getOptionLabel={aa => aa.name}
          getOptionValue={aa => aa._id}
          options={p.areas}
          value={p.areas.find(aa => aa._id === p.activeId)}
          onChange={aa => p.setActive(aa)}
        />
      </Group>
      <Group>
        <Button
          block
          size='sm'
          style='success'
          onClick={() => setShowUpload(true)}
        >
          {message('analysis.newAggregationArea')}
        </Button>
      </Group>

      {showUpload && (
        <>
          <Group label={message('analysis.aggregationAreaName')}>
            <Text name='Name' onChange={e => setName(e.target.value)} />
          </Group>

          <Group label={message('analysis.aggregationAreaFiles')}>
            <File
              multiple
              name='files'
              onChange={e => setFiles(e.target.files)}
            />
          </Group>

          <Button
            block
            size='sm'
            style='success'
            disabled={p.ploading || !name || !files}
            onClick={e => {
              e.preventDefault()
              p.uploadAggregationArea({
                name,
                files,
                regionId: p.regionId
              })
              setName('')
              setFiles()
              setShowUpload(false)
            }}
          >
            {message('analysis.uploadAggregationArea')}
          </Button>
        </>
      )}

      {p.activeId && (
        <Group label={message('analysis.weightBy')}>
          <OpportunityDatasets.components.Selector regionId={p.regionId} />
        </Group>
      )}

      {p.uploading && (
        <p>
          <Icon icon={faSpinner} spin />
          &nbsp;{message('analysis.uploading')}
        </p>
      )}
    </>
  )
}
