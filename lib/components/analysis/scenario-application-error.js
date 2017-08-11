import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import {sprintf} from 'sprintf-js'

import Collapsible from '../collapsible'
import messages from '../../utils/messages'

/** Display a scenario application error to the user */
export default class ScenarioApplicationError extends PureComponent {
  static propTypes = {
    error: PropTypes.shape({
      messages: PropTypes.arrayOf(PropTypes.string).isRequired,
      modificationId: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired
    }).isRequired
  }

  render () {
    const {error} = this.props

    // TODO we want the title in the collapsible but should this component really return a collapsible?
    return (
      <Collapsible title={error.title}>
        {/* TODO when modificationId is an actual ID, link to the offending modification */}
        <i>
          {sprintf(
            messages.analysis.errorsInModification,
            error.modificationId
          )}
        </i>
        <ul>
          {error.messages.map((msg, idx) =>
            <li key={`message-${idx}`}>
              {msg}
            </li>
          )}
        </ul>
      </Collapsible>
    )
  }
}
