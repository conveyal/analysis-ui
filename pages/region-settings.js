import React from 'react'

import {setLocally} from '../lib/actions/region'
import * as API from '../lib/api'
import EditRegion from '../lib/containers/edit-region'

EditRegion.getInitialProps = async ctx => {
  const region = await API.getRegion(ctx.query.regionId)
  ctx.reduxStore.dispatch(setLocally(region))
  return {region}
}

export default EditRegion
