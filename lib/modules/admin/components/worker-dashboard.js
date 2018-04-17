// @flow
import classnames from 'classnames'
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now'
import format from 'date-fns/format'
import _max from 'lodash/max'
import _sortBy from 'lodash/sortBy'
import React from 'react'
import {connect} from 'react-redux'
import {Sparklines, SparklinesLine, SparklinesSpots} from 'react-sparklines'
import {createStructuredSelector} from 'reselect'

import {fetchWorkers} from '../actions'
import * as select from '../selectors'

const SPARKLINE_HEIGHT = 12
const SPARKLINE_WIDTH = 190
const REFRESH_INTERVAL_MS = 5000
const START_TIME_DATE_FORMAT = 'MM-DD HH:mm:ss'

const formatStartTime = (seconds: number) =>
  format(seconds * 1000, START_TIME_DATE_FORMAT)

const bytesToGB = (bytes: number) =>
  `${(bytes * 1e-9).toFixed(2)}GB`

class WorkerDashboard extends React.PureComponent {
  props: {
    maxLoad: number,
    maxTasksPerMinute: number,
    workersSortBy: any,
    workers: any,

    fetchWorkers: () => void
  }

  state = {
    workers: _sortBy(this.props.workers, this.props.workersSortBy)
  }

  _fetchWorkerIntervalId: number
  componentDidMount () {
    this.props.fetchWorkers()
    this._fetchWorkerIntervalId = setInterval(() =>
      this.props.fetchWorkers(),
      REFRESH_INTERVAL_MS)
  }

  componentWillUnmount () {
    clearInterval(this._fetchWorkerIntervalId)
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      workers: _sortBy(nextProps.workers, nextProps.workersSortBy)
    })
  }

  render () {
    const p = this.props
    const s = this.state
    return <div className='WorkerDashboard'>
      {/* s.workers.length > 0 &&
        <Select
          clearable={false}
          multi
          options={Object.keys(s.workers[0]).map(key => ({
            label: startCase(key),
            value: key
          }))}
          placeholder='Sort by...'
          value={p.workersSortBy}
          />}
      <br /> */}
      <div className='Workers'>
        {s.workers.map(w =>
          <WorkerCell
            key={w.workerId}
            maxLoad={p.maxLoad}
            maxTasksPerMinute={p.maxTasksPerMinute}
            {...w}
          />)}
      </div>
    </div>
  }
}

const lineStyle = {fill: 'none', strokeWidth: 1, stroke: '#fff'}
const spotStyle = {fill: '#fff', stroke: '#fff'}

const WorkerSparkline = ({data, max}) =>
  <td className='Sparkline'>
    <Sparklines
      data={data}
      margin={2}
      max={max || _max(data)}
      height={SPARKLINE_HEIGHT}
      width={SPARKLINE_WIDTH}
    >
      <SparklinesLine style={lineStyle} />
      <SparklinesSpots size={1} style={spotStyle} />
    </Sparklines>
  </td>

class WorkerCell extends React.PureComponent {
  render () {
    const p = this.props
    const ageMs = Date.now() - p.lastSeenAt

    const active = p.tasksPerMinute > 0
    const stale = ageMs > REFRESH_INTERVAL_MS * 3
    const dead = ageMs > REFRESH_INTERVAL_MS * 10

    const workerClassNames = classnames('Worker', {
      active,
      stale,
      dead
    })

    const createdAt = formatStartTime(p.jvmStartTime)
    const name = `${p.workerName}@${p.workerVersion}`

    const showLastSeen = (Date.now() - p.lastSeenAt) > REFRESH_INTERVAL_MS * 5

    return <div className={workerClassNames} title={p.workerId}>
      <span className='WorkerName' title={name}>{name}</span>
      <span className='WorkerRegion' title={p.ec2region}>{p.ec2region}</span>
      <span className='WorkerStarted' title={`created at ${createdAt}`}>{createdAt}</span>
      <span className='WorkerIp' title={p.ipAddress}>{p.ipAddress}</span>
      {showLastSeen &&
        <span className='WorkerLastSeen'>
          seen {distanceInWordsToNow(p.lastSeenAt, {addSuffix: true})}
        </span>}

      {p.bundles && p.bundles.length > 0 &&
        <div className='WorkerBundles'>
          {p.bundles.map(b =>
            <div className='WorkerBundle' key={b._id}>
              <span className='WorkerBundleName' title={`Bundle ${b.name}`}>
                <a href={`/regions/${b.regionId}/bundles/${b._id}`}>
                  {b.name}
                </a>
              </span>
              <span
                className='WorkerBundleAccessGroup'
                title={`Access group: ${b.accessGroup}`}
              >
                {b.accessGroup}
              </span>
            </div>)}
        </div>}

      <table className='Bottom'>
        <tbody>
          <tr className='WorkerSparkline' title='Memory Usage'>
            <td className='SparklineTitle'>M</td>
            <WorkerSparkline data={p.memoryHistory} max={p.memoryMax} />
            <td className='SparklineValue'>{bytesToGB(p.memoryTotal)}</td>
          </tr>
          <tr className='WorkerSparkline' title='Load'>
            <td className='SparklineTitle'>L</td>
            <WorkerSparkline data={p.loadHistory} max={p.maxLoad} />
            <td className='SparklineValue'>{p.loadAverage.toFixed(2)}</td>
          </tr>
          <tr className='WorkerSparkline' title='Tasks per minute'>
            <td className='SparklineTitle'>T</td>
            <WorkerSparkline data={p.taskHistory} max={p.maxTasksPerMinute} />
            <td className='SparklineValue'>{p.tasksPerMinute}</td>
          </tr>
        </tbody>
      </table>
    </div>
  }
}

export default connect(
  createStructuredSelector(select),
  {fetchWorkers}
)(WorkerDashboard)
