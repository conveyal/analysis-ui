import React from 'react'

import {loadProjects} from '../lib/actions/project'
import {load} from '../lib/actions/region'
import SelectProject from '../lib/containers/select-project'

SelectProject.getInitialProps = async ctx => {
  await ctx.reduxStore.dispatch(load(ctx.query.regionId))
  await ctx.reduxStore.dispatch(loadProjects({regionId: ctx.query.regionId}))
}

export default SelectProject
