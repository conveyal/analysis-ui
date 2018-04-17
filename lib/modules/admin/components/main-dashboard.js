// @flow
import React from 'react'

import JobDashboard from './job-dashboard'
import WorkerDashboard from './worker-dashboard'

export default class MainDashboard extends React.PureComponent {
  render () {
    return <div className='AdminDashboard'>
      <h3>jobs</h3>
      <JobDashboard />
      <h3>workers</h3>
      <WorkerDashboard />
    </div>
  }
}
