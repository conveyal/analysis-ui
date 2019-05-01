import fetch from 'lib/fetch-action'

const JOBS_URL = `${process.env.API_URL}/jobs`
const WORKERS_URL = `${process.env.API_URL}/workers`

export const setJobs = payload => ({
  type: 'admin/SET_JOBS',
  payload
})

export const setWorkers = payload => ({
  type: 'admin/SET_WORKERS',
  payload
})

export const fetchJobs = () =>
  fetch({
    url: JOBS_URL,
    next: response => setJobs(response.value)
  })

export const fetchWorkers = () =>
  fetch({
    url: WORKERS_URL,
    next: response => setWorkers(response.value)
  })
