/** Display the parameters of a profile request */

import React, { Component, PropTypes } from 'react'
import Icon from '../icon'
import {secondsToHhMmString} from '../../utils/time'
import messages from '../../utils/messages'

export default class ProfileRequestDisplay extends Component {
  static propTypes = {
    request: PropTypes.shape({
      date: PropTypes.string.isRequired,
      accessModes: PropTypes.string.isRequired,
      fromTime: PropTypes.number.isRequired,
      toTime: PropTypes.number.isRequired
    })
  }

  /** Render a mode set */
  renderModes (modes) {
    const {walk, bicycle, car, bicycleRent, carPark} = messages.analysis.modes
    return modes.split(',')
      .map(mode => {
        switch (mode) {
          case 'WALK':
            // NB font awesome does not have a walking icon, but this one is close.
            // see Font Awesome issue 844
            return <Icon
              key={mode}
              type='blind'
              aria-label={walk}
              title={walk} />
          case 'BICYCLE':
            return <Icon
              key={mode}
              type='bicycle'
              aria-label={bicycle}
              title={bicycle} />
          case 'CAR':
            return <Icon
              key={mode}
              type='car'
              aria-label={car}
              title={car} />
          case 'BICYCLE_RENT':
            return <span
              key={mode}
              className='fa-stack fa-lg'
              aria-label={bicycleRent}
              title={bicycleRent}
              >
              <i className='fa fa-credit-card fa-stack-2x' />
              <i className='fa fa-bicycle fa-stack-1x' />
            </span>
          case 'CAR_PARK':
            // TODO non-ideal parking icon
            return <b
              key={mode}
              aria-label={carPark}
              title={carPark}>P</b>
        }
      })
  }

  render () {
    const {request} = this.props
    const {analysis} = messages
    return <table className='table table-striped table-condensed'>
      <tbody>
        <tr>
          <th>{analysis.date}</th>
          <td>{request.date}</td>
        </tr>
        <tr>
          <th>{analysis.fromTime}</th>
          <td>{secondsToHhMmString(request.fromTime)}</td>
        </tr>
        <tr>
          <th>{analysis.toTime}</th>
          <td>{secondsToHhMmString(request.toTime)}</td>
        </tr>
        <tr>
          <th>{analysis.transfers}</th>
          {/* Max transfers is max rides - 1 */}
          <td>{request.maxRides - 1}</td>
        </tr>
        <tr>
          <th>{analysis.monteCarloDraws}</th>
          <td>{request.monteCarloDraws}</td>
        </tr>
        <tr>
          <th>{analysis.accessModes}</th>
          <td>{this.renderModes(request.accessModes)}</td>
        </tr>
      </tbody>
    </table>
  }
}
