import {
  Box,
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList
} from '@chakra-ui/core'
import {
  faChartArea,
  faFileCsv,
  faFileImage,
  faGlobe,
  faSplotch
} from '@fortawesome/free-solid-svg-icons'
import get from 'lodash/get'
import snakeCase from 'lodash/snakeCase'
import React from 'react'
import {useDispatch, useSelector} from 'react-redux'

import {
  fetchTravelTimeSurface,
  setIsochroneFetchStatus
} from 'lib/actions/analysis'
import {abortFetch} from 'lib/actions/fetch'
import {createRegionalAnalysis} from 'lib/actions/analysis/regional'
import {FETCH_TRAVEL_TIME_SURFACE} from 'lib/constants'
import message from 'lib/message'
import {activeOpportunityDataset} from 'lib/modules/opportunity-datasets/selectors'
import selectCurrentProject from 'lib/selectors/current-project'
import selectIsochrone from 'lib/selectors/isochrone'
import selectCutoff from 'lib/selectors/max-trip-duration-minutes'
import selectPercentileCurves from 'lib/selectors/percentile-curves'
import selectProfileRequest from 'lib/selectors/profile-request'
import selectProfileRequestHasChanged from 'lib/selectors/profile-request-has-changed'
import selectRegionalAnalyses from 'lib/selectors/regional-analyses'
import cleanProjectScenarioName from 'lib/utils/clean-project-scenario-name'
import downloadCSV from 'lib/utils/download-csv'
import downloadGeoTIFF from 'lib/utils/download-geotiff'
import downloadJson from 'lib/utils/download-json'

import Icon from '../icon'

export default function AnalysisTitle() {
  const dispatch = useDispatch()
  const isochrone = useSelector(selectIsochrone)
  const isochroneFetchStatus = useSelector((s) =>
    get(s, 'analysis.isochroneFetchStatus')
  )
  const cutoff = useSelector(selectCutoff)
  const currentProject = useSelector(selectCurrentProject)
  const profileRequest = useSelector(selectProfileRequest)
  const profileRequestHasChanged = useSelector(selectProfileRequestHasChanged)
  const regionalAnalyses = useSelector(selectRegionalAnalyses)
  const percentileCurves = useSelector(selectPercentileCurves)
  const opportunityDataset = useSelector(activeOpportunityDataset)
  const projectName = cleanProjectScenarioName(
    currentProject,
    get(profileRequest, 'variantIndex')
  )
  const isFetchingIsochrone = !!isochroneFetchStatus

  function downloadIsochrone() {
    downloadJson({
      data: {
        ...isochrone,
        properties: {} // TODO set this in jsolines
      },
      filename:
        snakeCase(`conveyal isochrone ${projectName} at ${cutoff} minutes`) +
        '.json'
    })
  }

  function downloadOpportunitiesCSV() {
    const header =
      Array(120)
        .fill(0)
        .map((_, i) => i + 1)
        .join(',') + '\n'
    const csvContent = percentileCurves.map((row) => row.join(',')).join('\n')
    const name = snakeCase(
      `Conveyal ${projectName} percentile access to ${get(
        opportunityDataset,
        'name'
      )}`
    )
    downloadCSV(header + csvContent, name)
  }

  function fetchGeoTIFF() {
    return dispatch(fetchTravelTimeSurface(true))
      .then((r) => r.arrayBuffer())
      .then((data) => {
        downloadGeoTIFF({
          data,
          filename: snakeCase(`conveyal geotiff ${projectName}`) + '.geotiff'
        })
      })
  }

  function abort() {
    dispatch(abortFetch({type: FETCH_TRAVEL_TIME_SURFACE}))
    dispatch(setIsochroneFetchStatus(false))
  }

  function onCreateRegionalAnalysis() {
    if (currentProject) {
      const name = window.prompt(
        'Enter a name and click ok to begin a regional analysis job for this project and settings:',
        `Analysis ${regionalAnalyses.length + 1}: ${currentProject.name} ` +
          `${currentProject.variants[profileRequest.variantIndex] || ''}`
      )
      if (name && name.length > 0) {
        dispatch(createRegionalAnalysis({name, profileRequest}))
      }
    }
  }

  return (
    <Flex
      align='center'
      borderBottom='1px solid #ddd'
      justify='space-between'
      p='12px'
      width='640px'
    >
      <Box fontSize='14px'>
        <Icon icon={faChartArea} />{' '}
        {isFetchingIsochrone ? isochroneFetchStatus : 'Analysis'}
      </Box>
      {isFetchingIsochrone ? (
        <Button rightIcon='small-close' onClick={abort} variantColor='red'>
          Abort
        </Button>
      ) : (
        <Flex>
          <Menu>
            <MenuButton
              as={Button}
              isDisabled={
                !currentProject || !isochrone || profileRequestHasChanged
              }
              justified
              mr={2}
              rightIcon='chevron-down'
              variantColor='green'
            >
              Actions
            </MenuButton>
            <MenuList>
              <MenuItem onClick={onCreateRegionalAnalysis}>
                <Icon icon={faGlobe} />
                &nbsp;&nbsp;{message('analysis.newRegionalAnalysis')}
              </MenuItem>
              <MenuDivider />
              <MenuGroup title='Download' fontWeight='bold'>
                <MenuItem onClick={downloadIsochrone}>
                  <Icon icon={faSplotch} />
                  &nbsp;&nbsp;Isochrone as GeoJSON
                </MenuItem>
                <MenuItem onClick={fetchGeoTIFF}>
                  <Icon icon={faFileImage} />
                  &nbsp;&nbsp;Isochrone as GeoTIFF
                </MenuItem>
                <MenuItem
                  isDisabled={!percentileCurves}
                  onClick={downloadOpportunitiesCSV}
                  title={
                    percentileCurves
                      ? ''
                      : 'Opportunity dataset must be selected'
                  }
                >
                  <Icon icon={faFileCsv} />
                  &nbsp;&nbsp;Access to opportunities as CSV
                </MenuItem>
              </MenuGroup>
            </MenuList>
          </Menu>
          <Button
            isDisabled={!currentProject}
            rightIcon='repeat'
            onClick={() => dispatch(fetchTravelTimeSurface())}
            variantColor='blue'
            title={!currentProject ? message('analysis.disableFetch') : ''}
          >
            {message('analysis.refresh')}
          </Button>
        </Flex>
      )}
    </Flex>
  )
}
