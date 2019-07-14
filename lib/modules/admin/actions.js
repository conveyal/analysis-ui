import {API} from 'lib/constants'
import fetch from 'lib/fetch-action'

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
    url: API.Jobs,
    next: response => setJobs(response.value)
  })

export const fetchWorkers = () =>
  fetch({
    url: API.Workers,
    next: response => setWorkers(response.value)
  })
