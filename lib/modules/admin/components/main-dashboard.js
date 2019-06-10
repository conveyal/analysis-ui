import React from 'react'

import * as utils from '../utils'

import JobDashboard from './job-dashboard'
import WorkerDashboard from './worker-dashboard'

function MainDashboard(p) {
  return (
    <div className='AdminDashboard'>
      <h3>jobs ({p.jobs.length})</h3>
      <JobDashboard />
      <h3>workers ({p.workers.length})</h3>
      <WorkerDashboard />
    </div>
  )
}

export default utils.fullyConnect(MainDashboard)
