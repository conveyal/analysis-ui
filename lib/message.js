import get from 'lodash/get'

import messages from '../i18n/en.json'

/**
 * Expose a Set of all the keys used
 */
export const KeysUsed = new Set()

/**
 * Requires a key, defaultMessage and parameters are optional
 */
export default function getMessage(key, defaultMessage, parameters) {
  if (defaultMessage == null) {
    defaultMessage = ''
    parameters = {}
  } else if (typeof defaultMessage === 'object') {
    parameters = defaultMessage
    defaultMessage = ''
  }

  // Store the used key
  KeysUsed.add(key)

  // Get the message with "lodash/get" to allow nested keys ('noun.action' => {noun: {action: 'value'}})
  const msg = get(messages, key, defaultMessage)
  const result = parameters ? replaceMessage(msg, parameters) : msg
  return result
}

function replaceMessage(msg, data) {
  return msg.replace(
    new RegExp('%\\((' + Object.keys(data).join('|') + ')\\)', 'g'),
    (m, key) => (data.hasOwnProperty(key) ? data[key] : m)
  )
}
