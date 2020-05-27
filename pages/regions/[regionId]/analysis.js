import dynamic from 'next/dynamic'

import {load} from 'lib/actions/region'
import {loadBookmarks} from 'lib/actions/bookmark'
import {
  setScenarioApplicationErrors,
  setScenarioApplicationWarnings
} from 'lib/actions/analysis'
import {load as loadAllRegionalAnalyses} from 'lib/actions/analysis/regional'
import MapLayout from 'lib/layouts/map'
import {setActiveOpportunityDataset} from 'lib/modules/opportunity-datasets/actions'
import withInitialFetch from 'lib/with-initial-fetch'

// Loads many map components
const SinglePointAnalysis = dynamic(() => import('lib/components/analysis'), {
  ssr: false
})

const AnalysisPage = withInitialFetch(
  SinglePointAnalysis,
  async (dispatch, query) => {
    // Set the active id
    dispatch(setActiveOpportunityDataset(query.opportunityDatasetId))
    dispatch(setScenarioApplicationWarnings(null))
    dispatch(setScenarioApplicationErrors(null))

    const [totalRegion, bookmarks, regionalAnalyses] = await Promise.all([
      dispatch(load(query.regionId)),
      dispatch(loadBookmarks(query.regionId)),
      dispatch(loadAllRegionalAnalyses(query.regionId))
    ])

    return {
      bookmarks,
      regionalAnalyses,
      ...totalRegion
    }
  }
)

AnalysisPage.Layout = MapLayout

export default AnalysisPage
