import {
  faSpinner,
  faChevronUp,
  faChevronDown
} from '@fortawesome/free-solid-svg-icons'
import get from 'lodash/get'
import React from 'react'
import {useDispatch, useSelector} from 'react-redux'

import {
  setActiveAggregationArea,
  setAggregationArea,
  uploadAggregationArea
} from 'lib/actions/aggregation-areas'
import message from 'lib/message'
import OpportunityDatasets from 'lib/modules/opportunity-datasets'
import selectActiveAggregationArea from 'lib/selectors/active-aggregation-area'

import {Button} from '../buttons'
import Icon from '../icon'
import {File, Group, Text} from '../input'
import Select from '../select'

export default function AggregationArea(p) {
  const dispatch = useDispatch()
  const activeAggregationArea = useSelector(selectActiveAggregationArea)
  const aas = useSelector(state => state.region.aggregationAreas)
  const [showUpload, setShowUpload] = React.useState(false)
  const [name, setName] = React.useState('')
  const [nameAttribute, setNameAttribute] = React.useState('attribute')
  const [union, setUnion] = React.useState(true)
  const [files, setFiles] = React.useState()
  const [uploading, setUploading] = React.useState(false)

  function setActive(aa) {
    if (aa) {
      setUploading(true)
      dispatch(setAggregationArea(aa)).finally(() => setUploading(false))
    } else {
      dispatch(setActiveAggregationArea())
    }
  }

  function upload() {
    setUploading(true)

    const formData = new window.FormData()
    formData.append('name', name)
    formData.append('nameProperty', nameAttribute)
    formData.append('union', union)
    ;[...files].forEach(file => formData.append('files', file))

    dispatch(uploadAggregationArea(formData, p.regionId))
      .then(newAA => {
        setActive(newAA)
        setName('')
        setFiles()
        setShowUpload(false)
      })
      .finally(() => {
        setUploading(false)
      })
  }

  return (
    <>
      <Group label={message('analysis.aggregateTo')}>
        <Select
          isClearable
          isDisabled={uploading}
          name='aggregateTo'
          getOptionLabel={aa => aa.name}
          getOptionValue={aa => aa._id}
          options={aas}
          value={aas.find(aa => aa._id === get(activeAggregationArea, '_id'))}
          onChange={setActive}
        />
      </Group>

      <Group>
        {showUpload ? (
          <Button
            block
            size='sm'
            style='info'
            onClick={() => setShowUpload(false)}
          >
            Hide <Icon icon={faChevronUp} />
          </Button>
        ) : (
          <Button
            block
            size='sm'
            style='info'
            onClick={() => setShowUpload(true)}
          >
            {message('analysis.newAggregationArea')}{' '}
            <Icon icon={faChevronDown} />
          </Button>
        )}
      </Group>

      {showUpload && (
        <Group>
          <Text
            disabled={uploading}
            label={message('analysis.aggregationAreaName')}
            name='Name'
            onChange={e => setName(e.target.value)}
          />

          <File
            disabled={uploading}
            label={message('analysis.aggregationAreaFiles')}
            multiple
            name='files'
            onChange={e => setFiles(e.target.files)}
          />

          <Checkbox
            label='Union'
            checked={union}
            onChange={e => setUnion(e.target.checked)}
          />

          <p>
            <em>
              If unchecked, a separate aggregation area will be created for each
              feature (up to 60) in the uploaded shapefile.
            </em>
          </p>

          {!union && (
            <Text
              label='Attribute name to lookup on the shapefile'
              value={nameProperty}
              onChange={e => setNameProperty(e.target.value)}
            />
          )}

          <Button
            block
            size='sm'
            style='success'
            disabled={uploading || !name || !files}
            onClick={upload}
          >
            {uploading ? (
              <Icon icon={faSpinner} spin />
            ) : (
              message('analysis.uploadAggregationArea')
            )}
          </Button>
        </Group>
      )}

      {activeAggregationArea && (
        <Group label={message('analysis.weightBy')}>
          <OpportunityDatasets.components.Selector regionId={p.regionId} />
        </Group>
      )}
    </>
  )
}
