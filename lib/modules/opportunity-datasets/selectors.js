// @flow
import {classifiers, colorizers} from '@conveyal/gridualizer'
import sortBy from 'lodash/sortBy'
import {createSelector} from 'reselect'

import colors from '../../constants/colors'
import selectCurrentProjectId from '../../selectors/current-project-id'

import type {State} from './types'

/**
 * Select all of the Opportunity Datasets for a project
 */
export const selectOpportunityDatasets = createSelector(
  (state) => state.opportunityDatasets.datasets,
  (datasets) => sortBy(datasets, ['dataSource', 'key'])
)

/**
 * Select the active dataset for a project
 */
export const selectActiveOpportunityDataset = createSelector(
  selectOpportunityDatasets,
  (state) => state.opportunityDatasets.activeDataset,
  (datasets, key) => datasets.find((d) => d.key === key)
)

/**
 * Select the grid of an active dataset for a project
 */
export const selectActiveOpportunityDatasetGrid = createSelector(
  selectActiveOpportunityDataset,
  (dataset) => dataset && dataset.grid
)

/**
 * Select the project ID and create the base url for opportunity dataset
 * management
 */
export const selectOpportunitiesUrl = createSelector(
  selectCurrentProjectId,
  (projectId) => `/projects/${projectId}/opportunities`
)

/**
 * Select the active dataset and create a grid colorizer for it
 */
export const selectActiveOpportunityDatasetColorizer = createSelector(
  selectActiveOpportunityDatasetGrid,
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
export const selectUploadStatuses = (state: {
  opportunityDatasets: State
}) =>
  state.opportunityDatasets.uploadStatuses
