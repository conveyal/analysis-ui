import useSWR from 'swr'

import SelectRegion from 'lib/components/select-region'
import withAuth from 'lib/with-auth'

export default withAuth(function SelectRegionPage() {
  const {data} = useSWR('/api/regions')
  return <SelectRegion regions={data} />
})
