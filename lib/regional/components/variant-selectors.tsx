import {
  Box,
  Select,
  Stack,
  Alert,
  AlertIcon,
  AlertDescription
} from '@chakra-ui/react'

import Tip from 'lib/components/tip'
import useControlledInput from 'lib/hooks/use-controlled-input'

import DestinationPointsetSelector from './destination-pointset-select'

export default function VariantSelectors({
  analysisVariant,
  onChangeCutoff,
  onChangePercentile,
  onChangePointSet
}: {
  analysisVariant: CL.RegionalAnalysisVariant
  onChangeCutoff: (cutoff: number) => void
  onChangePercentile: (percentile: number) => void
  onChangePointSet: (pointSetId: string) => void
}) {
  const {analysis} = analysisVariant
  const cutoffsMinutes = analysis.cutoffsMinutes ?? []
  const percentiles = analysis.travelTimePercentiles ?? []
  const cutoffInput = useControlledInput({
    onChange: onChangeCutoff,
    parse: parseInt,
    value: analysisVariant.cutoff
  })
  const percentileInput = useControlledInput({
    onChange: onChangePercentile,
    parse: parseInt,
    value: analysisVariant.percentile
  })

  return (
    <Stack>
      {analysis.request?.originPointSetKey != null ? (
        <Alert status='info'>
          <AlertIcon />
          <AlertDescription>
            Results for this analysis cannot be displayed on this map.
          </AlertDescription>
        </Alert>
      ) : (
        <Stack>
          {Array.isArray(analysis.destinationPointSetIds) && (
            <Box>
              <DestinationPointsetSelector
                analysis={analysis}
                onChange={onChangePointSet}
                value={analysisVariant.pointSetId}
              />
            </Box>
          )}

          <Stack isInline>
            {Array.isArray(cutoffsMinutes) && (
              <Tip label='Travel time: Cutoff (minutes)'>
                <Select {...cutoffInput}>
                  {cutoffsMinutes.map((m) => (
                    <option key={m} value={m}>
                      {m} minutes
                    </option>
                  ))}
                </Select>
              </Tip>
            )}

            {Array.isArray(percentiles) && (
              <Tip label='Travel time: Percentile'>
                <Select {...percentileInput}>
                  {percentiles.map((p) => (
                    <option key={p} value={p}>
                      {p}th percentile
                    </option>
                  ))}
                </Select>
              </Tip>
            )}
          </Stack>
        </Stack>
      )}
    </Stack>
  )
}
