import React from 'react'
import {setLocally as setRegionLocally} from '../lib/actions/region'
import SelectProject from '../lib/containers/select-project'
import * as API from '../lib/api'

SelectProject.getInitialProps = async ctx => {
  const region = await API.getRegion(ctx.query.regionId)
  ctx.reduxStore.dispatch(setRegionLocally(region))

  return {region}
}

export default SelectProject
