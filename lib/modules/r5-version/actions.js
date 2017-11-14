// @flow
import fetch from '@conveyal/woonerf/fetch'

import {
  R5_BUCKET
} from './constants'

import type {Action} from './types'

export const setAnalysisVersions =
  (versions: string[]): Action => ({
    type: 'r5Version/SET_ANALYSIS_VERSIONS',
    payload: versions
  })

export const setCurrentR5Version =
  (version: string): Action => ({
    type: 'r5Version/SET_CURRENT',
    payload: version
  })

export const setR5Versions =
  (versions: string[]): Action => ({
    type: 'r5Version/SET_ALL',
    payload: versions
  })

export const loadR5Versions = () =>
  fetch({
    url: R5_BUCKET,
    options: {
      headers: {
        Authorization: null
      }
    },
    next: (error, response) => {
      if (!error) {
        const parser = new window.DOMParser()
        const r5doc = parser.parseFromString(response.value, 'application/xml')

        const all = Array.from(r5doc.querySelectorAll('Contents'))
          .map(item => item.querySelector('Key').childNodes[0].nodeValue) // get just key
          .filter(item => item !== 'index.html') // don't include the main page
          .map(item => item.replace(/.jar$/, '')) // and remove .jar

        return setR5Versions(all)
      }
    }
  })
