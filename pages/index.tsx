import useSWR from 'swr'

import FullSpinner from 'lib/components/full-spinner'
import SelectRegion from 'lib/components/select-region'
import withAuth from 'lib/with-auth'

function SelectRegionPage() {
  const {data} = useSWR('{regions {name, _id}}')
  if (!data) return <FullSpinner />
  return <SelectRegion regions={data.regions} />
}

export default withAuth(SelectRegionPage)
