// @flow

export type Action =
  {type: 'r5Version/SET_ALL', payload: string[]}
| {type: 'r5Version/SET_ANALYSIS_VERSIONS', payload: string[]}
| {type: 'r5Version/SET_CURRENT', payload: string}

export type State = {
  +analysisVersions: string[],
  +currentVersion: string,
  +versions: string[]
}
