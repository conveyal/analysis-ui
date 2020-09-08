import {
  Box,
  FormControl,
  FormLabel,
  Select,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Stack,
  FormControlProps
} from '@chakra-ui/core'
import {useCallback, memo} from 'react'
import {useDispatch, useSelector} from 'react-redux'

import {
  setMaxTripDurationMinutes,
  setTravelTimePercentile
} from 'lib/actions/analysis'
import useInput from 'lib/hooks/use-controlled-input'
import selectMaxTripDurationMinutes from 'lib/selectors/max-trip-duration-minutes'
import selectTravelTimePercentile from 'lib/selectors/travel-time-percentile'

import {TRAVEL_TIME_PERCENTILES} from 'lib/constants'

export function CutoffSlider({isDisabled, ...p}) {
  const dispatch = useDispatch()
  const onChangeCutoff = useCallback(
    (cutoff) => dispatch(setMaxTripDurationMinutes(cutoff)),
    [dispatch]
  )
  const cutoffSlider = useInput({
    onChange: onChangeCutoff,
    value: useSelector(selectMaxTripDurationMinutes)
  })

  return (
    <FormControl isDisabled={isDisabled} {...p}>
      <Stack align='center' isInline spacing={5}>
        <FormLabel whiteSpace='nowrap' pb={0}>
          Time cutoff
        </FormLabel>
        <Slider
          isDisabled={isDisabled}
          min={1}
          max={120}
          onChange={cutoffSlider.onChange}
          value={cutoffSlider.value}
        >
          <SliderTrack />
          <SliderFilledTrack />
          <SliderThumb aria-label='Time cutoff' ref={cutoffSlider.ref} size='8'>
            <Box fontSize='sm' fontWeight='bold'>
              {cutoffSlider.value}
            </Box>
          </SliderThumb>
        </Slider>
        <FormLabel pb={0}>minute(s)</FormLabel>
      </Stack>
    </FormControl>
  )
}

type PercentileSliderProps = {
  isDisabled: boolean
}

export const PercentileSlider = memo<PercentileSliderProps & FormControlProps>(
  function PercentileSlider({isDisabled, ...p}) {
    const dispatch = useDispatch()
    const onChangePercentile = useCallback(
      (percentile) => dispatch(setTravelTimePercentile(percentile)),
      [dispatch]
    )
    const percentileSlider = useInput({
      onChange: onChangePercentile,
      value: useSelector(selectTravelTimePercentile)
    })
    return (
      <FormControl isDisabled={isDisabled} {...p}>
        <FormLabel>Travel time percentile</FormLabel>
        <Select {...percentileSlider}>
          {TRAVEL_TIME_PERCENTILES.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </Select>
      </FormControl>
    )
  }
)
