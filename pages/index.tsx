import useSWR from 'swr'

import FullSpinner from 'lib/components/full-spinner'
import SelectRegion from 'lib/components/select-region'
import withAuth from 'lib/with-auth'

const fetcher = (query) =>
  fetch('/api/graphql', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({query})
  })
    .then((res) => res.json())
    .then((json) => json.data)

function SelectRegionPage() {
  const {data} = useSWR('{regions {name, _id}}', fetcher)
  if (!data) return <FullSpinner />
  else return <SelectRegion regions={data.regions} />
}

export default withAuth(SelectRegionPage)
