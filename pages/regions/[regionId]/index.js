import {load} from 'lib/actions/region'
import SelectProject from 'lib/components/select-project'
import MapLayout from 'lib/layouts/map'
import withInitialFetch from 'lib/with-initial-fetch'

const SelectProjectPage = withInitialFetch(SelectProject, (store, query) => {
  return store.dispatch(load(query.regionId)) // {bundle, projects, region}
})

SelectProjectPage.Layout = MapLayout

export default SelectProjectPage
