// @flow
import {classifiers, colorizers} from '@conveyal/gridualizer'
import sortBy from 'lodash/sortBy'
import {createSelector} from 'reselect'

import colors from '../../constants/colors'

import selectCurrentRegionId from '../../selectors/current-region-id'

import type {State} from './types'

/**
 * Select all of the Opportunity Datasets for a region
 */
export const opportunityDatasets = createSelector(
  (state) => state.opportunityDatasets.datasets,
  (datasets) => sortBy(datasets, ['dataSource', 'key'])
)

/**
 * Select the active dataset for a region
 */
export const activeOpportunityDataset = createSelector(
  opportunityDatasets,
  (state) => state.opportunityDatasets.activeDataset,
  (datasets, key) => datasets.find((d) => d.key === key)
)

/**
 * Select the grid of an active dataset for a region
 */
export const activeOpportunityDatasetGrid = createSelector(
  activeOpportunityDataset,
  (dataset) => dataset && dataset.grid
)

/**
 * Select the region ID and create the base url for opportunity dataset
 * management
 */
export const opportunitiesUrl = createSelector(
  selectCurrentRegionId,
  (regionId) => `/regions/${regionId}/opportunities`
)

/**
 * Select the active dataset and create a grid colorizer for it
 */
export const activeOpportunityDatasetColorizer = createSelector(
  activeOpportunityDatasetGrid,
  (grid) => {
    if (grid) {
      const classifier = classifiers.diverging({scheme: classifiers.quantile})
      const breaks = classifier(grid, colors.REGIONAL_COMPARISON_GRADIENT.length)
      return colorizers.dot(colors.REGIONAL_COMPARISON_GRADIENT, breaks)
    } else {
      return () => ''
    }
  }
)

/**
 * Get all of the dataset upload statuses
 */
export const uploadStatuses = (state: {
  opportunityDatasets: State
}) =>
  state.opportunityDatasets.uploadStatuses
