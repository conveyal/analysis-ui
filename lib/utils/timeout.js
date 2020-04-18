/**
 * Simple promise based timeout
 */
export default (time) => new Promise((resolve) => setTimeout(resolve, time))
