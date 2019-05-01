// @flow
import message from 'lib/message'
import React, {PureComponent} from 'react'

/**
 * Show days of service
 */
export default class DaysOfService extends PureComponent {
  render() {
    const {
      monday,
      tuesday,
      wednesday,
      thursday,
      friday,
      saturday,
      sunday
    } = this.props
    return (
      <span>
        <span
          className={monday ? 'DaysOfService-active' : 'DaysOfService-inactive'}
          aria-hidden={!monday}
        >
          {message('report.days.monday')}
        </span>
        &nbsp;
        <span
          className={
            tuesday ? 'DaysOfService-active' : 'DaysOfService-inactive'
          }
          aria-hidden={!tuesday}
        >
          {message('report.days.tuesday')}
        </span>
        &nbsp;
        <span
          className={
            wednesday ? 'DaysOfService-active' : 'DaysOfService-inactive'
          }
          aria-hidden={!wednesday}
        >
          {message('report.days.wednesday')}
        </span>
        &nbsp;
        <span
          className={
            thursday ? 'DaysOfService-active' : 'DaysOfService-inactive'
          }
          aria-hidden={!thursday}
        >
          {message('report.days.thursday')}
        </span>
        &nbsp;
        <span
          className={friday ? 'DaysOfService-active' : 'DaysOfService-inactive'}
          aria-hidden={!friday}
        >
          {message('report.days.friday')}
        </span>
        &nbsp;
        <span
          className={
            saturday ? 'DaysOfService-active' : 'DaysOfService-inactive'
          }
          aria-hidden={!saturday}
        >
          {message('report.days.saturday')}
        </span>
        &nbsp;
        <span
          className={sunday ? 'DaysOfService-active' : 'DaysOfService-inactive'}
          aria-hidden={!sunday}
        >
          {message('report.days.sunday')}
        </span>
      </span>
    )
  }
}
