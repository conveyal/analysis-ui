// @flow

export type UsedVersion = {
  name: string,
  version: string
}

export type Action =
| {payload: string, type: 'r5Version/SET_CURRENT'}
| {payload: UsedVersion[], type: 'r5Version/SET_USED_VERSIONS'}

export type State = {
  +currentVersion: string,
  +usedVersions: UsedVersion[]
}
