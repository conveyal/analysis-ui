// @flow
import Icon from '@conveyal/woonerf/components/icon'
import message from '@conveyal/woonerf/message'
import React, {PureComponent} from 'react'

import Collapsible from '../collapsible'
import {secondsToHhMmString} from '../../utils/time'

/** Display the parameters of a profile request */
export default class ProfileRequestDisplay extends PureComponent {
  props: {
    accessModes: string,
    bundleId: string,
    date: string,
    defaultExpanded: boolean,
    directModes: string,
    fromTime: number,
    maxRides: number,
    monteCarloDraws: number,
    name: string,
    projectId: string,
    regionId: string,
    toTime: number,
    transitModes: string,
    workerVersion: string
  }

  render () {
    const {
      accessModes,
      bundleId,
      date,
      defaultExpanded,
      directModes,
      fromTime,
      maxRides,
      monteCarloDraws,
      name,
      projectId,
      regionId,
      toTime,
      transitModes,
      workerVersion
    } = this.props
    const hasTransit = transitModes !== ''
    return (
      <Collapsible title={`${name} settings`} defaultExpanded={defaultExpanded}>
        <table className='table table-striped table-condensed'>
          <tbody>
            <tr>
              <th>Resources</th>
              <td>
                <a href={`/regions/${regionId}/bundles/${bundleId}`} target='_blank'>GTFS Bundle</a>&nbsp;/&nbsp;
                <a href={`/regions/${regionId}/projects/${projectId}`} target='_blank'>Project</a>
              </td>
            </tr>
            <tr>
              <th>{message('r5Version.title')}</th>
              <td>{workerVersion}</td>
            </tr>
            <tr>
              <th>
                {message('analysis.date')}
              </th>
              <td>
                {date}
              </td>
            </tr>
            <tr>
              <th>
                {message('analysis.fromTime')}
              </th>
              <td>
                {secondsToHhMmString(fromTime)}
              </td>
            </tr>
            <tr>
              <th>
                {message('analysis.toTime')}
              </th>
              <td>
                {secondsToHhMmString(toTime)}
              </td>
            </tr>
            <tr>
              <th>
                {message('analysis.transfers')}
              </th>
              {/* Max transfers is max rides - 1 */}
              <td>
                {maxRides - 1}
              </td>
            </tr>
            <tr>
              <th>
                {message('analysis.monteCarloDraws')}
              </th>
              <td>
                {monteCarloDraws}
              </td>
            </tr>
            <tr>
              <th>
                {message('analysis.accessModes')}
              </th>
              <td>
                <Modes modes={hasTransit ? accessModes : directModes} />
              </td>
            </tr>
            <tr>
              <th>
                {message('analysis.modes.transit')}
              </th>
              <td>
                {hasTransit ? message('common.yes') : message('common.no')}
              </td>
            </tr>
          </tbody>
        </table>
      </Collapsible>
    )
  }
}

/**
 * Render a mode set
 */
function Modes ({modes}: {modes: string}) {
  return (
    <span>
      {modes.split(',').map(mode => {
        switch (mode) {
          case 'WALK':
            // NB font awesome does not have a walking icon, but this one is close.
            // see Font Awesome issue 844
            return (
              <Icon key={mode} type='male' title={message('analysis.modes.walk')} />
            )
          case 'BICYCLE':
            return (
              <Icon
                key={mode}
                type='bicycle'
                title={message('analysis.modes.bicycle')}
              />
            )
          case 'CAR':
            return <Icon key={mode} type='car' title={message('analysis.modes.car')} />
          case 'BICYCLE_RENT':
            return (
              <span
                key={mode}
                className='fa-stack fa-lg'
                title={message('analysis.modes.bicycleRent')}
              >
                <i className='fa fa-credit-card fa-stack-2x' />
                <i className='fa fa-bicycle fa-stack-1x' />
              </span>
            )
          case 'CAR_PARK':
            // TODO non-ideal parking icon
            return (
              <b key={mode} title={message('analysis.modes.carPark')}>
                P
              </b>
            )
        }
      })}
    </span>
  )
}
