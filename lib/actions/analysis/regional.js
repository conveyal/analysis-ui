/** Actions for regional analysis */
import {createGrid} from 'browsochrones'
import {classifiers} from '@conveyal/gridualizer'
import sortBy from 'lodash/sortBy'
import Router from 'next/router'
import {createAction} from 'redux-actions'

import {API, PROFILE_REQUEST_DEFAULTS, RouteTo} from 'lib/constants'
import colors from 'lib/constants/colors'
import fetch from 'lib/fetch-action'
import * as select from 'lib/selectors'
import {fetchSignedS3Url} from 'lib/utils/fetch-signed-s3-url'
import {activeOpportunityDataset} from 'lib/modules/opportunity-datasets/selectors'
import R5Version from 'lib/modules/r5-version'

import {storeProfileRequestSettings} from './profile-request'

const REGION_URL = API.Region
const REGIONAL_URL = API.Regional

export const setRegionalAnalysis = createAction('set regional analysis')

export const setRegionalAnalyses = createAction('set regional analyses')

export const load = regionId =>
  fetch({
    url: `${REGION_URL}/${regionId}/regional`,
    next(response) {
      const analyses = sortBy(response.value, a => -a.createdAt) // newest at the top
      return [
        setRegionalAnalyses(analyses),
        R5Version.actions.setUsedVersions(
          analyses.map(a => ({
            name: a.name,
            version: a.workerVersion
          }))
        )
      ]
    }
  })

export const setActiveRegionalAnalyses = createAction(
  'set active regional analyses'
)
export const setRegionalAnalysisGrids = createAction(
  'set regional analysis grids'
)
const setRegionalAnalysisOriginLocally = createAction(
  'set regional analysis origin'
)

/**
 * This also does not add anything to the map.
 * TODO store raw data and create grids, classifier, breaks in selectors.
 */
export const loadRegionalAnalysisGrids = ({
  _id,
  comparisonId
}) => async dispatch => {
  const results = {}
  dispatch(setActiveRegionalAnalyses({_id, comparisonId}))

  const rawGrid = await dispatch(
    fetchSignedS3Url(`${REGIONAL_URL}/${_id}/grid/grid`)
  )

  results.classifier = classifiers.ckmeans({})
  results.grid = createGrid(rawGrid)

  if (comparisonId) {
    const rawComparisonGrid = await dispatch(
      fetchSignedS3Url(`${REGIONAL_URL}/${comparisonId}/grid/grid`)
    )

    // Create the grids
    results.comparisonGrid = createGrid(rawComparisonGrid)

    // Create a difference grid
    results.differenceGrid = subtract(results.grid, results.comparisonGrid)
    results.breaks = results.classifier(
      results.differenceGrid,
      colors.REGIONAL_COMPARISON_GRADIENT.length
    )
  } else {
    results.breaks = results.classifier(
      results.grid,
      colors.REGIONAL_GRADIENT.length
    )
  }

  dispatch(setRegionalAnalysisGrids(results))
  return results
}

export const createRegionalAnalysis = ({name, profileRequest}) => async (
  dispatch,
  getState
) => {
  const state = getState()
  const currentProjectId = select.currentProjectId(state, {})
  const currentRegionId = select.currentRegionId(state, {})
  const maxTripDurationMinutes = select.maxTripDurationMinutes(state)
  const opportunityDataset = activeOpportunityDataset(state, {})
  const workerVersion = R5Version.select.currentVersion(state, {})

  if (!opportunityDataset || !opportunityDataset._id) {
    window.alert('Opportunity dataset must be selected.')
    return
  }

  const finalProfileRequest = {
    ...PROFILE_REQUEST_DEFAULTS,
    ...profileRequest,
    maxTripDurationMinutes,
    opportunityDatasetId: opportunityDataset._id,
    projectId: currentProjectId,
    workerVersion
  }

  // Store the profile request settings for the user/region
  dispatch(storeProfileRequestSettings(profileRequest))

  const createResult = await dispatch(
    fetch({
      options: {
        method: 'POST',
        body: {
          ...finalProfileRequest,
          name,
          percentiles: [profileRequest.travelTimePercentile || 50]
        }
      },
      url: REGIONAL_URL
    })
  )

  Router.push({
    pathname: RouteTo.regionalAnalyses,
    query: {regionId: currentRegionId}
  })

  return createResult
}

const deleteRegionalAnalysisLocally = createAction('delete regional analysis')
export const deleteRegionalAnalysis = analysisId => dispatch => {
  // run local delete first so it seems snappier. The worst that will happen is
  // that a regional analysis will pop back up in a few seconds when we refresh
  // regional analyses
  dispatch(deleteRegionalAnalysisLocally(analysisId))

  return dispatch(
    fetch({
      url: `${REGIONAL_URL}/${analysisId}`,
      options: {
        method: 'DELETE'
      }
    })
  )
}

const setAggregationAreaLocally = createAction('set aggregation area')
const setAggregationAreaId = createAction('set aggregation area id')
export const setAggregationArea = opts => async dispatch => {
  dispatch(setAggregationAreaId(opts && opts.aggregationAreaId))
  // clear existing so UI doesn't show results that don't match now-selected aggregation area
  dispatch(setAggregationAreaLocally(null))

  if (opts) {
    const rawGrid = await dispatch(
      fetchSignedS3Url(
        `${REGION_URL}/${opts.regionId}/aggregationArea/${opts.aggregationAreaId}`
      )
    )
    const grid = createGrid(rawGrid)
    dispatch(setAggregationAreaLocally(createGrid(rawGrid)))

    return grid
  }
}

const setAggregationAreaUploading = createAction(
  'set aggregation area uploading'
)
/** This triggers a reducer in region to inject the aggregation area into the current region */
const addAggregationAreaLocally = createAction('add aggregation area locally')

/** Upload an aggregation area */
export const uploadAggregationArea = ({name, files, regionId}) => {
  const formData = new window.FormData()
  formData.append('name', name)
  ;[...files].forEach(file => formData.append('files', file))

  return [
    setAggregationAreaUploading(true),
    fetch({
      url: `${REGION_URL}/${regionId}/aggregationArea`,
      options: {
        method: 'post',
        body: formData
      },
      next: res => [
        addAggregationAreaLocally(res.value),
        setAggregationAreaUploading(false)
      ]
    })
  ]
}

/**
 * Non-destructively subtract grid B from grid A
 */
function subtract(a, b) {
  const gridsDoNotAlign =
    a.west !== b.west ||
    a.north !== b.north ||
    a.zoom !== b.zoom ||
    a.width !== b.width ||
    a.height !== b.height

  if (gridsDoNotAlign) {
    throw new Error('Grids do not align for subtraction')
  }

  const {width, height} = a
  const newGrid = {
    ...a,
    data: new Int32Array(width * height),
    min: Infinity,
    max: -Infinity
  }

  for (let pixel = 0; pixel < width * height; pixel++) {
    const val = a.data[pixel] - b.data[pixel]
    newGrid.min = Math.min(newGrid.min, val)
    newGrid.max = Math.max(newGrid.max, val)
    newGrid.data[pixel] = val
  }

  return newGrid
}

export function downloadGridFromS3(url) {
  return fetch({
    url,
    next: (err, response) => {
      if (err) window.alert(err)
      else window.open(response.url)
    }
  })
}

/**
 * NB: THIS FUNCTIONALITY IS CURRENTLY DISABLED.
 *
 * Set the origin for showing a bootstrapped sampling distribution of travel
 * time.
 */
export const setRegionalAnalysisOrigin = opts => {
  if (!opts) return setRegionalAnalysisOriginLocally(null)
  else return setRegionalAnalysisOriginLocally(opts.lonlat)
}

/**
 * Update a regional analysis
 */
export const updateRegionalAnalysis = regionalAnalysis =>
  fetch({
    options: {
      method: 'put',
      body: regionalAnalysis
    },
    url: `${REGIONAL_URL}/${regionalAnalysis._id}`,
    next: response => setRegionalAnalysis(response.value)
  })
