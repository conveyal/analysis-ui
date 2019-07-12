//
import _max from 'lodash/max'
import {createSelector} from 'reselect'

export const jobs = state => state.admin.jobs
export const workers = state => state.admin.workers
export const workersSortBy = state => state.admin.workersSortBy

export const jobsWithWorkers = createSelector(
  jobs,
  workers,
  (jobs, workers) =>
    jobs.map(job => ({
      ...job,
      workers: workers.filter(
        w => w.scenarios[0] === job.regionalAnalysis.request.jobId
      )
    }))
)

export const allBundlesById = createSelector(
  workers,
  workers => {
    const bundles = {}
    workers.forEach(w =>
      (w.bundles || []).forEach(b => {
        bundles[b._id] = b
      })
    )
    return bundles
  }
)

export const maxTasksPerMinute = createSelector(
  workers,
  workers => _max(workers.map(w => _max(w.taskHistory)))
)

export const maxLoad = createSelector(
  workers,
  workers => _max(workers.map(w => _max(w.loadHistory)))
)
