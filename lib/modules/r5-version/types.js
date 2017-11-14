// @flow

export type Action =
  {type: 'r5Version/SET_ALL', payload: string[]}
| {type: 'r5Version/SET_CURRENT', payload: string}
| {type: 'r5Version/SET_LAST_ANALYSIS_VERSION', payload: void | string}

export type State = {
  +analysisVersion: void | string,
  +currentVersion: string,
  +versions: string[]
}
