// @flow
import Icon from '@conveyal/woonerf/components/icon'
import classnames from 'classnames'
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now'
import _sortBy from 'lodash/sortBy'
import React from 'react'

import {REFRESH_INTERVAL_MS} from '../constants'
import * as utils from '../utils'
import WorkerSparkline from './sparkline'

const bytesToGB = (bytes: number) => (bytes * 1e-9).toFixed(2)

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

class WorkerCell extends React.PureComponent {
  render () {
    const p = this.props
    const staleMs = Date.now() - p.lastSeenAt

    const active = p.tasksPerMinute > 0
    const stale = staleMs > REFRESH_INTERVAL_MS * 3
    const dead = staleMs > REFRESH_INTERVAL_MS * 10

    const workerClassNames = classnames('Worker', {
      active,
      stale,
      dead
    })

    const duration = utils.msToDuration(p.jvmStartTime * 1000)
    const lastSeenAt = distanceInWordsToNow(p.lastSeenAt, {addSuffix: true})

    return <div className={workerClassNames}>
      {p.ec2instanceId &&
        <div>
          <Icon type='bolt' />&nbsp;
          <a
            href={utils.createWorkerUrl(p.ec2instanceId, p.ec2region)}
            target='_blank'
          >
            {p.ec2instanceId}
          </a>&nbsp;
          (<a
            href={utils.createCloudWatchUrl(p.ec2instanceId, p.ec2region)}
            target='_blank'
          >cloudwatch logs</a>)
        </div>}
      {p.workerVersion !== 'UNKNOWN' &&
        <div>
          <Icon type='code-fork' />&nbsp;
          <a href={utils.createR5Url(p.workerVersion)} target='_blank'>
            {p.workerVersion}
          </a>
        </div>}
      {p.bundles && p.bundles.length > 0 && p.bundles.map(b =>
        <div key={b._id}>
          <Icon type='database' />&nbsp;
          <a href={`/regions/${b.regionId}/bundles/${b._id}`} target='_blank'>
            {b.name} ({b.accessGroup})
          </a>
        </div>)}
      <div title={`Running for ${duration} (hh:mm:ss)`}>
        <Icon type='clock-o' /> {duration}
      </div>
      <table className='Bottom'>
        <tbody>
          <tr className='WorkerSparkline' title='Memory Usage'>
            <td className='SparklineTitle'><Icon type='microchip' /></td>
            <td className='Sparkline'>
              <WorkerSparkline data={p.memoryHistory} max={p.memoryMax} />
            </td>
            <td className='SparklineValue'>{bytesToGB(p.memoryTotal)} / {bytesToGB(p.memoryMax)} GB</td>
          </tr>
          <tr className='WorkerSparkline' title='Load'>
            <td className='SparklineTitle'><Icon type='dashboard' /></td>
            <td className='Sparkline'>
              <WorkerSparkline data={p.loadHistory} max={p.processors * 2} />
            </td>
            <td className='SparklineValue'>{p.loadAverage.toFixed(2)} / {p.processors * 2} cores</td>
          </tr>
          <tr className='WorkerSparkline' title='Tasks per minute'>
            <td className='SparklineTitle'><Icon type='tasks' /></td>
            <td className='Sparkline'>
              <WorkerSparkline data={p.taskHistory} max={p.maxTasksPerMinute} />
            </td>
            <td className='SparklineValue'>{p.tasksPerMinute} tasks / min</td>
          </tr>
        </tbody>
      </table>

      {staleMs > (REFRESH_INTERVAL_MS * 5) &&
        <div>
          <Icon type='warning' /> last seen {lastSeenAt}
        </div>}
    </div>
  }
}

export default utils.fullyConnect(WorkerDashboard)
