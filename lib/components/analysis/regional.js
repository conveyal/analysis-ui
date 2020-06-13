import {Box, Select, Stack} from '@chakra-ui/core'
import {faPencilAlt, faTrash} from '@fortawesome/free-solid-svg-icons'
import dynamic from 'next/dynamic'
import React, {useCallback} from 'react'
import {useDispatch, useSelector} from 'react-redux'

import {setSearchParameter} from 'lib/actions'
import {
  deleteRegionalAnalysis,
  updateRegionalAnalysis
} from 'lib/actions/analysis/regional'
import useControlledInput from 'lib/hooks/use-controlled-input'
import message from 'lib/message'
import selectCutoff from 'lib/selectors/regional-display-cutoff'
import selectPercentile from 'lib/selectors/regional-display-percentile'

import {Button, Group} from '../buttons'
import Icon from '../icon'

import ProfileRequestDisplay from './profile-request-display'

const AggregationArea = dynamic(() => import('../map/aggregation-area'), {
  ssr: false
})
const AnalysisBounds = dynamic(() => import('../map/analysis-bounds'), {
  ssr: false
})
const DotMap = dynamic(
  () => import('lib/modules/opportunity-datasets/components/dotmap'),
  {ssr: false}
)
const RegionalLayer = dynamic(() => import('../map/regional'), {
  ssr: false
})
const RegionalResults = dynamic(() => import('./regional-results'), {
  ssr: false
})

export default function Regional(p) {
  const {analysis, isComplete} = p
  const dispatch = useDispatch()
  const cutoffsMinutes = analysis.cutoffsMinutes
  const percentiles = analysis.travelTimePercentiles

  const onChangeCutoff = useCallback(
    (v) => dispatch(setSearchParameter('cutoff', v)),
    [dispatch]
  )
  const cutoffInput = useControlledInput({
    onChange: onChangeCutoff,
    value: useSelector(selectCutoff)
  })
  const cutoff = cutoffInput.value

  const onChangePercentile = useCallback(
    (v) => dispatch(setSearchParameter('percentile', v)),
    [dispatch]
  )
  const percentileInput = useControlledInput({
    onChange: onChangePercentile,
    value: useSelector(selectPercentile)
  })
  const percentile = percentileInput.value

  function _deleteAnalysis() {
    if (
      window.confirm('Are you sure you wish to remove this regional analysis?')
    ) {
      dispatch(deleteRegionalAnalysis(analysis._id))
      dispatch(setSearchParameter('analysisId'))
    }
  }

  function _renameAnalysis() {
    const name = window.prompt('Please enter a new name', p.analysis.name)
    if (name != null && name !== p.analysis.name) {
      dispatch(updateRegionalAnalysis({...analysis, name}))
    }
  }

  return (
    <>
      {!isComplete ? (
        <AnalysisBounds analysis={analysis} />
      ) : (
        <>
          <DotMap />
          <RegionalLayer />
          <AggregationArea />
        </>
      )}

      <Stack spacing={4}>
        <Box>
          <ProfileRequestDisplay
            defaultExpanded
            {...p.analysis}
            {...p.analysis.request}
          />
        </Box>

        {Array.isArray(cutoffsMinutes) && (
          <Select {...cutoffInput}>
            {cutoffsMinutes.map((m) => (
              <option key={m} value={m}>
                {m} minutes
              </option>
            ))}
          </Select>
        )}
        {Array.isArray(percentiles) && (
          <Select {...percentileInput}>
            {percentiles.map((p) => (
              <option key={p} value={p}>
                {p}th percentile
              </option>
            ))}
          </Select>
        )}

        <Box>
          <Group justified>
            <Button onClick={_renameAnalysis} size='sm' style='warning'>
              <Icon icon={faPencilAlt} />{' '}
              {message('analysis.renameRegionalAnalysis')}
            </Button>
            <Button onClick={_deleteAnalysis} size='sm' style='danger'>
              <Icon icon={faTrash} />{' '}
              {message('analysis.deleteRegionalAnalysis')}
            </Button>
          </Group>
        </Box>

        {isComplete && (
          <Box>
            <RegionalResults
              analysisId={p.analysis._id}
              regionId={p.analysis.regionId}
              {...p}
            />
          </Box>
        )}
      </Stack>
    </>
  )
}
