// @flow
import format from 'date-fns/format'
import React from 'react'

import {REFRESH_INTERVAL_MS, START_TIME_FORMAT} from '../constants'
import type {Job} from '../types'
import {fullyConnect} from '../utils'

const formatStartTime = (ms: number) =>
  format(ms, START_TIME_FORMAT)

const add0 = (n) => n >= 10 ? n : `0${n}`

const formatDuration = (ms: number) => {
  const durationS = Math.floor((Date.now() - ms) / 1000)
  const s = durationS % 60
  const m = Math.floor((durationS / 60) % 60)
  const h = Math.floor((durationS / 60 / 60) % 60)

  return `${add0(h)}:${add0(m)}:${add0(s)}`
}

class JobDashboard extends React.PureComponent {
  props: {
    allBundlesById: Object,
    jobs: Job[],

    fetchJobs: () => void
  }

  _fetchJobsIntervalId: number
  componentDidMount () {
    this.props.fetchJobs()
    this._fetchJobsIntervalId = setInterval(() =>
      this.props.fetchJobs(),
      REFRESH_INTERVAL_MS)
  }

  componentWillUnmount () {
    clearInterval(this._fetchJobsIntervalId)
  }

  render () {
    const p = this.props
    return <table className='JobTable table'>
      <thead>
        <tr>
          <th>name</th><th>owner</th><th>bundle</th><th>worker version</th><th>resources</th><th>created at</th><th>duration</th><th>progress</th>
        </tr>
      </thead>
      <tbody>
        {p.jobs.filter(j => j.jobId !== 'SUM').map(j =>
          <JobRow
            key={j.jobId}
            bundle={p.allBundlesById[j.regionalAnalysis.bundleId]}
            {...j}
          />)}
      </tbody>
    </table>
  }
}

class JobRow extends React.PureComponent {
  render () {
    const p = this.props

    const owner = `${p.regionalAnalysis.createdBy} (${p.regionalAnalysis.accessGroup})`
    const name = p.regionalAnalysis.name
    const createdAt = formatStartTime(p.regionalAnalysis.createdAt)
    const duration = formatDuration(p.regionalAnalysis.createdAt)
    const {bundleId, projectId, regionId} = p.regionalAnalysis

    const bundleName = p.bundle ? p.bundle.name : bundleId

    return <tr
      className='JobRow'
    >
      <td className='JobName' title={name}>
        <a href={`/projects/${projectId}/regional/${p.regionalAnalysis._id}`}>{name}</a>
      </td>
      <td className='JobOwner' title={`Created by ${owner}`}>{owner}</td>
      <td className='JobBundle' title={`Bundle ${bundleName}`}>
        <a href={`/regions/${regionId}/bundles/${bundleId}`}>
          {bundleName}
        </a>
      </td>
      <td className='JobWorkerVersion' title={p.workerCommit}>
        {p.workerCommit}
      </td>
      <td className='JobProject'>
        <a href={`/projects/${projectId}`}>project</a>&nbsp;|&nbsp;
        <a href={`/regions/${regionId}`}>region</a>
      </td>
      <td className='JobStarted' title={`created at ${createdAt}`}>{createdAt}</td>
      <td className='JobDuration' title={duration}>{duration}</td>
      <td className='JobProgress' title={`${p.complete} / ${p.total} tasks completed`}>
        {p.complete} / {p.total} complete ({p.deliveries - p.complete} delivered)
      </td>
    </tr>
  }
}

export default fullyConnect(JobDashboard)
