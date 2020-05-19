import React from 'react'
import {useDispatch, useSelector} from 'react-redux'

import Select from 'lib/components/select'
import useOnMount from 'lib/hooks/use-on-mount'

import {
  loadOpportunityDataset,
  loadOpportunityDatasets,
  setActiveOpportunityDataset
} from '../actions'
import * as select from '../selectors'

export default function OpportunityDatasetSelector(p) {
  const {regionId} = p
  const [loading, setLoading] = React.useState(false)
  const dispatch = useDispatch()
  const activeDatasetId = useSelector(
    (s) => s.opportunityDatasets.activeDataset
  )
  const allDatasets = useSelector(select.opportunityDatasets)

  // Load datasets on mount
  useOnMount(() => {
    dispatch(loadOpportunityDatasets(regionId))
  })

  // Load OD
  React.useEffect(() => {
    const activeDataset = allDatasets.find((d) => d._id === activeDatasetId)
    if (activeDataset) {
      setLoading(true)
      dispatch(loadOpportunityDataset(activeDataset)).finally(() =>
        setLoading(false)
      )
    }
  }, [activeDatasetId, allDatasets, dispatch])

  function selectOpportunityDataset(dataset) {
    if (!dataset) return dispatch(setActiveOpportunityDataset())
    dispatch(setActiveOpportunityDataset(dataset._id))
  }

  return (
    <Select
      name='select-opportunity-dataset'
      inputId='select-opportunity-dataset'
      isClearable
      isDisabled={p.isDisabled || loading}
      options={allDatasets}
      getOptionLabel={(d) => `${d.sourceName}: ${d.name}`}
      getOptionValue={(d) => d._id}
      onChange={selectOpportunityDataset}
      value={allDatasets.find((d) => d._id === activeDatasetId)}
    />
  )
}
