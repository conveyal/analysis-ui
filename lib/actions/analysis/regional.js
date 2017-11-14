// @flow
/** Actions for regional analysis */

import {createGrid} from 'browsochrones'
import {classifiers} from '@conveyal/gridualizer'
import fetch, {fetchMultiple} from '@conveyal/woonerf/fetch'
import {createAction} from 'redux-actions'
import {push} from 'react-router-redux'

import colors from '../../constants/colors'
import {
  REGIONAL_ANALYSIS_SAMPLING_DISTRIBUTION_COMPONENT
} from '../../constants/map'
import {addComponent} from '../map'
import selectCurrentProject from '../../selectors/current-project'
import authenticatedFetch from '../../utils/authenticated-fetch'
import convertToR5Modification from '../../utils/convert-to-r5-modification'

import OpportunityDatasets from '../../modules/opportunity-datasets'
import R5Version from '../../modules/r5-version'

import type {Bounds, LonLat} from '../../types'

export const setRegionalAnalyses = createAction('set regional analyses')

export const load = (projectId: string) =>
  fetch({
    url: `/api/project/${projectId}/regional`,
    next: (error, response) => !error && setRegionalAnalyses(response.value)
  })

export const setActiveRegionalAnalyses = createAction(
  'set active regional analyses'
)
export const setRegionalAnalysisGrids = createAction(
  'set regional analysis grids'
)
export const setMinimumImprovementProbability = createAction(
  'set minimum improvement probability'
)
export const setRegionalAnalysisBounds = createAction(
  'set regional analysis bounds'
)
const setRegionalAnalysisOriginLocally = createAction(
  'set regional analysis origin'
)
const setRegionalAnalysisSamplingDistribution = createAction(
  'set regional analysis sampling distribution'
)
const setComparisonRegionalAnalysisSamplingDistribution = createAction(
  'set comparison regional analysis sampling distribution'
)

/** This also does not add anything to the map */
export const loadRegionalAnalysisGrids = async ({
  _id,
  comparisonId
}: {
  _id: string,
  comparisonId: string
}) => {
  if (comparisonId) {
    return [
      setActiveRegionalAnalyses({
        _id,
        comparisonId
      }),
      // TODO use serverAction below so we get spinner &c.
      Promise.all(
        [
          // grid/grid indicates that we want a grid in grid format, you could also do grid/png
          // or grid/tiff
          authenticatedFetch(`/api/regional/${_id}/grid/grid`).catch(res => {
            console.error(res)
            return res
          }),
          authenticatedFetch(
            `/api/regional/${comparisonId}/grid/grid`
          ).catch(res => {
            console.error(res)
            return res
          }),
          // comparison query is the _base_, i.e. what is subtracted
          authenticatedFetch(
            `/api/regional/${comparisonId}/${_id}/grid`
          ).catch(res => {
            console.error(res)
            return res
          })
        ]
          // We redirect to S3, and due to a bug in Chrome 57, the auth header is forwarded and S3
          // chokes on that. So we make the request again without the auth header.
          // There's no way to get the URL of the redirect without following it due to browser security
          // restrictions.
          // Do this here so that each request is chained individually, otherwise the signed URLs can expire
          // while we are waiting for other responses.
          .map(req =>
            req.then(res =>
              window.fetch(res.url).then(res2 => res2.arrayBuffer())
            )
          )
      ).then(([gridRaw, comparisonGridRaw, probabilityGridRaw]) => {
        const comparisonGrid = createGrid(comparisonGridRaw)
        const grid = createGrid(gridRaw)
        const probabilityGrid = createGrid(probabilityGridRaw)
        const differenceGrid = subtract(grid, comparisonGrid)
        const classifier = classifiers.ckmeans({})
        const breaks = classifier(
          differenceGrid,
          colors.REGIONAL_COMPARISON_GRADIENT.length
        )
        return setRegionalAnalysisGrids({
          classifier,
          grid,
          comparisonGrid,
          probabilityGrid,
          differenceGrid,
          breaks
        })
      })
    ]
  } else {
    return [
      setActiveRegionalAnalyses({_id, comparisonId}),
      authenticatedFetch(`/api/regional/${_id}/grid/grid`)
        .catch(res => res)
        .then(res => window.fetch(res.url).then(res2 => res2.arrayBuffer()))
        .then(async gridData => {
          const grid = createGrid(gridData)
          const classifier = classifiers.ckmeans({})
          const breaks = classifier(grid, colors.REGIONAL_GRADIENT.length)
          return setRegionalAnalysisGrids({
            classifier,
            grid,
            breaks
          })
        })
    ]
  }
}

export const createRegionalAnalysis = ({
  bounds,
  name,
  profileRequest,
  travelTimePercentile,
  variantId
}: {
  bounds: Bounds,
  name: string,
  profileRequest: any,
  travelTimePercentile: number,
  variantId: number
}) => (dispatch: () => void, getState: () => any) => {
  const state = getState()
  const project = selectCurrentProject(state, {})
  const {analysis, scenario} = state
  const {north, south, east, west} = bounds
  const {isochroneCutoff} = analysis
  const {currentScenario} = scenario

  const opportunityDataset = OpportunityDatasets.selectors.selectActiveOpportunityDataset(state, {})
  const workerVersion = R5Version.selectors.selectCurrentR5Version(state, {})

  if (!opportunityDataset || !opportunityDataset.key) {
    window.alert('Opportunity dataset must be selected.')
    return
  }

  dispatch(
    fetch({
      options: {
        method: 'POST',
        body: JSON.stringify({
          name,
          workerVersion,
          projectId: project._id,
          scenarioId: currentScenario._id,
          bundleId: currentScenario.bundleId,
          variant: variantId,
          grid: opportunityDataset.key,
          cutoffMinutes: isochroneCutoff,
          travelTimePercentile,
          bounds: {
            type: 'Polygon',
            coordinates: [
              [
                [west, north],
                [east, north],
                [east, south],
                [west, south],
                [west, north]
              ]
            ]
          },
          request: {
            ...profileRequest,
            workerVersion,
            scenario: {
              modifications: scenario.modifications
                .filter(m => m.variants[variantId])
                .map(convertToR5Modification)
            },
            type: 'REGIONAL_ANALYSIS'
          }
        })
      },
      url: '/api/regional',
      next: error => !error && push(`/scenarios/${currentScenario._id}/regional`)
    })
  )
}

const deleteRegionalAnalysisLocally = createAction('delete regional analysis')
export const deleteRegionalAnalysis = (analysisId: string) => [
  // run local delete first so it seems snappier. The worst that will happen is
  // that a regional analysis will pop back up in a few seconds when we refresh
  // regional analyses
  deleteRegionalAnalysisLocally(analysisId),
  fetch({
    url: `/api/regional/${analysisId}`,
    options: {
      method: 'DELETE'
    },
    next () {}
  })
]

const setAggregationAreaLocally = createAction('set aggregation area')
const setAggregationAreaId = createAction('set aggregation area id')
export const setAggregationArea = async ({
  projectId,
  aggregationAreaId
}: {
  projectId: string,
  aggregationAreaId: string
}) => [
  setAggregationAreaLocally(null), // clear existing so UI doesn't show results that don't match now-selected aggregation area
  setAggregationAreaId(aggregationAreaId),
  fetch({
    url: `/api/project/${projectId}/aggregationArea/${aggregationAreaId}?redirect=false`,
    next: (err, res) =>
      !err &&
      fetch({
        url: res.value.url,
        options: {
          headers: {
            Authorization: null // don't pass our auth header through to S3, causes 401 err
          }
        },
        next: (err, res) =>
          !err && setAggregationAreaLocally(createGrid(res.value))
      })
  })
]

const setAggregationWeightsLocally = createAction('set aggregation weights')
const setAggregationWeightsId = createAction('set aggregation weights id')
export const setAggregationWeights = ({
  projectId,
  aggregationWeightsId
}: {
  projectId: string,
  aggregationWeightsId: string
}) => [
  // clear existing so UI doesn't show results that don't match now-selected aggregaton weights
  setAggregationWeightsLocally(null),
  setAggregationWeightsId(aggregationWeightsId),
  fetch({
    url: `/api/grid/${projectId}/${aggregationWeightsId}?redirect=false`,
    next: (err, res) =>
      !err &&
      fetch({
        url: res.value.url,
        options: {
          headers: {
            Authorization: null // don't pass our auth header through to S3, causes 401 err
          }
        },
        next: (err, res) =>
          !err && setAggregationWeightsLocally(createGrid(res.value))
      })
  })
]

const setAggregationAreaUploading = createAction(
  'set aggregation area uploading'
)
/** This triggers a reducer in project to inject the aggregation area into the current project */
const addAggregationAreaLocally = createAction('add aggregation area locally')

/** Upload an aggregation area */
export const uploadAggregationArea = ({
  name,
  files,
  projectId
}: {
  name: string,
  files: FileList,
  projectId: string
}) => {
  const formData = new window.FormData()
  formData.append('name', name)
  ;[...files].forEach(file => formData.append('files', file))

  return [
    setAggregationAreaUploading(true),
    fetch({
      url: `/api/project/${projectId}/aggregationArea`,
      options: {
        method: 'post',
        body: formData
      },
      next: (err, res) =>
        !err && [
          addAggregationAreaLocally(res.value),
          setAggregationAreaUploading(false)
        ]
    })
  ]
}

/** non-destructively subtract grid B from grid A */
function subtract (a, b) {
  const gridsDoNotAlign =
    a.west !== b.west ||
    a.north !== b.north ||
    a.zoom !== b.zoom ||
    a.width !== b.width ||
    a.height !== b.height

  if (gridsDoNotAlign) {
    throw new Error('Grids do not align for subtraction')
  }

  const {north, west, zoom, width, height} = a

  const newGrid = {
    north,
    west,
    zoom,
    width,
    height,
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

export function downloadGridFromS3 (url: string) {
  return fetch({
    url,
    next: (err, response) => {
      if (err) window.alert(err)
      else window.open(response.url)
    }
  })
}

/** set the origin for showing a bootstrapped sampling distribution of travel time */
export const setRegionalAnalysisOrigin = ({
  comparisonRegionalAnalysisId,
  lonlat,
  regionalAnalysisId
}: {
  comparisonRegionalAnalysisId: string,
  lonlat: LonLat,
  regionalAnalysisId: string
}) => {
  const fetches = [
    {
      url: `/api/regional/${regionalAnalysisId}/samplingDistribution/${lonlat.lat}/${lonlat.lon}`
    }
  ]

  if (comparisonRegionalAnalysisId) {
    fetches.push({
      url: `/api/regional/${comparisonRegionalAnalysisId}/samplingDistribution/${lonlat.lat}/${lonlat.lon}`
    })
  }

  return fetchMultiple({
    fetches,
    next: (err, response) => {
      // UI will lock if there's an error, no need to handle explicitly
      if (!err) {
        return [
          setRegionalAnalysisOriginLocally(lonlat),
          setRegionalAnalysisSamplingDistribution(response[0].value),
          setComparisonRegionalAnalysisSamplingDistribution(
            comparisonRegionalAnalysisId ? response[1].value : null
          ),
          addComponent(REGIONAL_ANALYSIS_SAMPLING_DISTRIBUTION_COMPONENT)
        ]
      }
    }
  })
}
