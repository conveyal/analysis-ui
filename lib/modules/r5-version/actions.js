export const setCurrentR5Version = (version) => ({
  type: 'r5Version/SET_CURRENT',
  payload: version
})

export const setUsedVersions = (versions) => ({
  type: 'r5Version/SET_USED_VERSIONS',
  payload: versions
})
