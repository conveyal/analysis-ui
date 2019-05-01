// @flow
import {
  faBolt,
  faCalendar,
  faClock,
  faCodeBranch,
  faCubes,
  faDatabase,
  faHashtag,
  faHourglassHalf,
  faMap,
  faUsers
} from '@fortawesome/free-solid-svg-icons'
import format from 'date-fns/format'
import React from 'react'

import Icon from 'lib/components/icon'

import {REFRESH_INTERVAL_MS, START_TIME_FORMAT} from '../constants'
import type {Job} from '../types'
import * as utils from '../utils'

const formatStartTime = (ms: number) => format(ms, START_TIME_FORMAT)

class JobDashboard extends React.PureComponent {
  props: {
    allBundlesById: Object,
    clearJob: () => void,

    fetchJobs: () => void,
    highlightJob: () => void,
    jobsWithWorkers: Job[],
    selectJob: () => void
  }

  _fetchJobsIntervalId: number
  componentDidMount() {
    this.props.fetchJobs()
    this._fetchJobsIntervalId = setInterval(
      () => this.props.fetchJobs(),
      REFRESH_INTERVAL_MS
    )
  }

  componentWillUnmount() {
    clearInterval(this._fetchJobsIntervalId)
  }

  render() {
    const p = this.props
    return (
      <table className='JobTable table'>
        <thead>
          <tr>
            <th>
              <Icon icon={faHashtag} /> name
            </th>
            <th>
              <Icon icon={faDatabase} /> bundle
            </th>
            <th>
              <Icon icon={faUsers} /> owner
            </th>
            <th>
              <Icon icon={faCodeBranch} /> worker version
            </th>
            <th>
              <Icon icon={faCubes} /> resources
            </th>
            <th>
              <Icon icon={faCalendar} /> created at
            </th>
            <th>
              <Icon icon={faClock} /> duration
            </th>
            <th>
              <Icon icon={faMap} /> taui
            </th>
            <th>
              <Icon icon={faHourglassHalf} /> progress
            </th>
            <th>
              <Icon icon={faBolt} /> worker(s)
            </th>
          </tr>
        </thead>
        <tbody>
          {p.jobsWithWorkers.map(j => (
            <JobRow
              key={j.jobId}
              bundle={p.allBundlesById[j.regionalAnalysis.bundleId]}
              clearJob={p.clearJob}
              highlightJob={p.highlightJob}
              selectJob={p.selectJob}
              {...j}
            />
          ))}
        </tbody>
      </table>
    )
  }
}

class JobRow extends React.PureComponent {
  _highlightJob = () => {
    const p = this.props
    p.highlightJob(p.jobId, p.workers)
  }

  _toggleJob = () => {
    const p = this.props
    if (p.selected) {
      p.clearJob()
    } else {
      p.selectJob(p.jobId, p.workers)
    }
  }

  render() {
    const p = this.props

    const owner = `${p.regionalAnalysis.createdBy} (${
      p.regionalAnalysis.accessGroup
    })`
    const name = p.regionalAnalysis.name
    const createdAt = formatStartTime(p.regionalAnalysis.createdAt)
    const duration = utils.msToDuration(p.regionalAnalysis.createdAt)
    const {bundleId, projectId, regionId} = p.regionalAnalysis

    const bundleName = p.bundle ? p.bundle.name : bundleId
    const makeStatic = p.regionalAnalysis.request.makeStaticSite

    return (
      <tr className='JobRow'>
        <td className='JobName' title={name}>
          <a
            href={`/regions/${regionId}/regional/${p.regionalAnalysis._id}`}
            target='_blank'
          >
            {name}
          </a>
        </td>
        <td className='JobBundle' title={`Bundle ${bundleName}`}>
          <a href={`/regions/${regionId}/bundles/${bundleId}`} target='_blank'>
            {bundleName}
          </a>
        </td>
        <td className='JobOwner' title={`Created by ${owner}`}>
          {owner}
        </td>
        <td className='JobWorkerVersion'>
          {p.workerCommit === 'UNKNOWN' ? (
            'UNKNOWN'
          ) : (
            <a href={utils.createR5Url(p.workerCommit)} target='_blank'>
              {p.workerCommit}
            </a>
          )}
        </td>
        <td className='JobProject'>
          <a
            href={`/regions/${regionId}/projects/${projectId}`}
            target='_blank'
          >
            project
          </a>
          &nbsp;|&nbsp;
          <a href={`/regions/${regionId}`} target='_blank'>
            region
          </a>
        </td>
        <td className='JobStarted' title={`created at ${createdAt}`}>
          {createdAt}
        </td>
        <td className='JobDuration' title={duration}>
          {duration}
        </td>
        <td title='Making Static Site?'>{makeStatic ? 'Y' : 'N'}</td>
        <td
          className='JobProgress'
          style={{
            background: utils.createLinearGradientForJob(
              p.complete,
              p.deliveries,
              p.total
            )
          }}
          title={`${p.complete} / ${p.deliveries - p.complete} / ${
            p.total
          } tasks complete / delivered / total`}
        >
          <span>{((p.complete / p.total) * 100).toFixed(1)}%</span>
          <span className='pull-right'>
            {p.complete} / {p.deliveries - p.complete} / {p.total}
          </span>
        </td>
        <td>{p.workers.length}</td>
      </tr>
    )
  }
}

export default utils.fullyConnect(JobDashboard)
