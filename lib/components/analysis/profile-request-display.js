// @flow
import Icon from '@conveyal/woonerf/components/icon'
import React, {PureComponent} from 'react'

import {secondsToHhMmString} from '../../utils/time'
import messages from '../../utils/messages'

/** Display the parameters of a profile request */
export default class ProfileRequestDisplay extends PureComponent {
  props: {
    accessModes: string,
    date: string,
    directModes: string,
    fromTime: number,
    maxRides: number,
    monteCarloDraws: number,
    toTime: number,
    transitModes: string
  }

  render () {
    const {
      accessModes,
      date,
      directModes,
      fromTime,
      maxRides,
      monteCarloDraws,
      toTime,
      transitModes
    } = this.props
    const {analysis, common} = messages
    const hasTransit = transitModes !== ''
    return (
      <table className='table table-striped table-condensed'>
        <tbody>
          <tr>
            <th>
              {analysis.date}
            </th>
            <td>
              {date}
            </td>
          </tr>
          <tr>
            <th>
              {analysis.fromTime}
            </th>
            <td>
              {secondsToHhMmString(fromTime)}
            </td>
          </tr>
          <tr>
            <th>
              {analysis.toTime}
            </th>
            <td>
              {secondsToHhMmString(toTime)}
            </td>
          </tr>
          <tr>
            <th>
              {analysis.transfers}
            </th>
            {/* Max transfers is max rides - 1 */}
            <td>
              {maxRides - 1}
            </td>
          </tr>
          <tr>
            <th>
              {analysis.monteCarloDraws}
            </th>
            <td>
              {monteCarloDraws}
            </td>
          </tr>
          <tr>
            <th>
              {analysis.accessModes}
            </th>
            <td>
              <Modes modes={hasTransit ? accessModes : directModes} />
            </td>
          </tr>
          <tr>
            <th>
              {analysis.modes.transit}
            </th>
            <td>
              {hasTransit ? common.yes : common.no}
            </td>
          </tr>
        </tbody>
      </table>
    )
  }
}

/**
 * Render a mode set
 */
function Modes ({modes}: {modes: string}) {
  const {walk, bicycle, car, bicycleRent, carPark} = messages.analysis.modes
  return (
    <span>
      {modes.split(',').map(mode => {
        switch (mode) {
          case 'WALK':
            // NB font awesome does not have a walking icon, but this one is close.
            // see Font Awesome issue 844
            return (
              <Icon key={mode} type='male' aria-label={walk} title={walk} />
            )
          case 'BICYCLE':
            return (
              <Icon
                key={mode}
                type='bicycle'
                aria-label={bicycle}
                title={bicycle}
              />
            )
          case 'CAR':
            return <Icon key={mode} type='car' aria-label={car} title={car} />
          case 'BICYCLE_RENT':
            return (
              <span
                key={mode}
                className='fa-stack fa-lg'
                aria-label={bicycleRent}
                title={bicycleRent}
              >
                <i className='fa fa-credit-card fa-stack-2x' />
                <i className='fa fa-bicycle fa-stack-1x' />
              </span>
            )
          case 'CAR_PARK':
            // TODO non-ideal parking icon
            return (
              <b key={mode} aria-label={carPark} title={carPark}>
                P
              </b>
            )
        }
      })}
    </span>
  )
}
