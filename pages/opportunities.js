import React from 'react'

import {loadOpportunityDatasets} from 'lib/modules/opportunity-datasets/actions'
import Heading from 'lib/modules/opportunity-datasets/components/heading'
import List from 'lib/modules/opportunity-datasets/components/list'

function Opportunities(p) {
  return (
    <Heading>
      <List {...p} />
    </Heading>
  )
}

Opportunities.getInitialProps = async ctx => {
  await ctx.reduxStore.dispatch(loadOpportunityDatasets(ctx.query.regionId))
}

export default Opportunities
