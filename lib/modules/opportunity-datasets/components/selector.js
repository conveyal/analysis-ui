import React from 'react'
import {useDispatch, useSelector} from 'react-redux'

import Select from 'lib/components/select'
import useInput from 'lib/hooks/use-controlled-input'
import useOnMount from 'lib/hooks/use-on-mount'

import {
  loadOpportunityDataset,
  loadOpportunityDatasets,
  setActiveOpportunityDataset
} from '../actions'
import * as select from '../selectors'

export default function OpportunityDatasetSelector({isDisabled, regionId}) {
  const [loading, setLoading] = React.useState(false)
  const dispatch = useDispatch()
  const activeDatasetId = useSelector(
    (s) => s.opportunityDatasets.activeDataset
  )
  const allDatasets = useSelector(select.opportunityDatasets)

  function selectOpportunityDataset(dataset) {
    if (!dataset) return dispatch(setActiveOpportunityDataset())
    setLoading(true)
    dispatch(loadOpportunityDataset(dataset)).finally(() => setLoading(false))
  }
  const input = useInput(activeDatasetId, selectOpportunityDataset)

  // Load datasets on mount
  useOnMount(() => {
    dispatch(loadOpportunityDatasets(regionId)).then((datasets) => {
      const activeDataset = datasets.find((d) => d._id === activeDatasetId)
      if (activeDataset) {
        setLoading(true)
        dispatch(loadOpportunityDataset(activeDataset)).finally(() =>
          setLoading(false)
        )
      }
    })
  })

  return (
    <Select
      name='select-opportunity-dataset'
      inputId='select-opportunity-dataset'
      isClearable
      isDisabled={isDisabled || loading}
      isLoading={loading}
      ref={input.ref}
      options={allDatasets}
      getOptionLabel={(d) => `${d.sourceName}: ${d.name}`}
      getOptionValue={(d) => d._id}
      onChange={input.onChange}
      value={allDatasets.find((d) => d._id === input.value)}
    />
  )
}
