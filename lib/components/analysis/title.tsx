import {Button, Flex, Heading} from '@chakra-ui/core'
import {faChartArea} from '@fortawesome/free-solid-svg-icons'
import get from 'lodash/get'
import {useDispatch, useSelector} from 'react-redux'

import {
  fetchTravelTimeSurface,
  setIsochroneFetchStatus
} from 'lib/actions/analysis'
import {abortFetch} from 'lib/actions/fetch'
import {FETCH_TRAVEL_TIME_SURFACE} from 'lib/constants'
import message from 'lib/message'

import selectAccessibility from 'lib/selectors/accessibility'
import selectCurrentProject from 'lib/selectors/current-project'
import selectIsochrone from 'lib/selectors/isochrone'

import Icon from '../icon'

export default function AnalysisTitle({isDisabled}) {
  const dispatch = useDispatch()
  const accessibility = useSelector(selectAccessibility)
  const isochrone = useSelector(selectIsochrone)
  const isochroneFetchStatus = useSelector((s) =>
    get(s, 'analysis.isochroneFetchStatus')
  )
  const currentProject = useSelector(selectCurrentProject)
  const requestsSettings = useSelector((s) =>
    get(s, 'analysis.requestsSettings')
  )

  const isFetchingIsochrone = !!isochroneFetchStatus

  function abort() {
    dispatch(abortFetch({type: FETCH_TRAVEL_TIME_SURFACE}))
    dispatch(setIsochroneFetchStatus(false))
  }

  const title = isFetchingIsochrone
    ? isochroneFetchStatus
    : !isochrone
    ? 'Compute travel time'
    : !accessibility
    ? 'Select opportunity dataset'
    : 'Analyze results'

  return (
    <Flex
      align='center'
      borderBottom='1px solid #E2E8F0'
      justify='space-between'
      px={6}
      py={4}
      width='640px'
    >
      <Heading fontWeight='500' size='md'>
        <Icon icon={faChartArea} /> {title}
      </Heading>
      {isFetchingIsochrone ? (
        <Button rightIcon='small-close' onClick={abort} variantColor='red'>
          Abort
        </Button>
      ) : (
        <Button
          isDisabled={!currentProject}
          rightIcon='repeat'
          onClick={() => dispatch(fetchTravelTimeSurface(requestsSettings))}
          variantColor='blue'
          title={!currentProject ? message('analysis.disableFetch') : ''}
        >
          {message('analysis.refresh')}
        </Button>
      )}
    </Flex>
  )
}
