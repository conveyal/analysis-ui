// @flow
import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'

import * as actions from './actions'
import * as select from './selectors'

export function fullyConnect (Component: any) {
  return connect(
    createStructuredSelector(select),
    actions
  )(Component)
}
