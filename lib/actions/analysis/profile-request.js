import {createAction} from 'redux-actions'

import {PROFILE_REQUEST_DEFAULTS} from '../../constants'
import R5Version from '../../modules/r5-version'
import selectCurrentRegionId from '../../selectors/current-region-id'
import localStorage from '../../utils/local-storage'

/**
 * Save the profile request parameters to local storage
 */
export const setEntireProfileRequest = createAction('set profile request')
export const setProfileRequest = createAction('update profile request')
export const setDisplayedProfileRequest = createAction(
  'set displayed profile request'
)

const requestSettingsKey = 'profileRequestSettings'
const getStoredSettings = () =>
  JSON.parse(localStorage.getItem(requestSettingsKey) || '{}')

export const storeProfileRequestSettings = profileRequest => (
  dispatch,
  getState
) => {
  const state = getState()
  const regionId = selectCurrentRegionId(state, {})
  const storedSettings = getStoredSettings()
  storedSettings[regionId] = profileRequest
  localStorage.setItem(requestSettingsKey, JSON.stringify(storedSettings))

  dispatch(setEntireProfileRequest(profileRequest))
}

/**
 * Ovverides with default settings in case of missing parameters.
 */
export const loadProfileRequestSettings = regionId => {
  const storedProfileRequestSettings = getStoredSettings()
  const profileRequestSettings = storedProfileRequestSettings[regionId]
  if (profileRequestSettings) {
    return [
      setEntireProfileRequest({
        ...PROFILE_REQUEST_DEFAULTS,
        ...profileRequestSettings
      }),
      R5Version.actions.setCurrentR5Version(
        profileRequestSettings.workerVersion
      )
    ]
  } else {
    return [
      setEntireProfileRequest(PROFILE_REQUEST_DEFAULTS),
      R5Version.actions.setCurrentR5Version(R5Version.RECOMMENDED_R5_VERSION)
    ]
  }
}
