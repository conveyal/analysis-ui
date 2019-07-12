//
import debug from 'debug'

const debugEvent = debug('analysis-ui:dom-event')

export default function createLogEvent(filename) {
  return function logEvent(functionName, evt) {
    debugEvent(`${filename}.${functionName}`, evt)
  }
}
