export default function createLogEvent(filename) {
  return function logEvent(functionName, evt) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`${filename}.${functionName}`, evt)
    }
  }
}
