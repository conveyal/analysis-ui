import LogRocket from 'logrocket'

import createLogError from 'lib/utils/log-error'

const KEY = process.env.NEXT_PUBLIC_LOGROCKET

// Just log it once
const logError = createLogError(1)

// Is using LogRocket
const isEnabled = process.browser && KEY && KEY !== 'false'

// Init
if (isEnabled) LogRocket.init(KEY)

export default {
  identify(...args) {
    if (isEnabled) LogRocket.identify(...args)
    else logError('LogRocket not enabled', ...args)
  },
  captureException(...args) {
    if (isEnabled) LogRocket.captureException(...args)
    else console.error(...args) // do not rate limit this
  }
}
