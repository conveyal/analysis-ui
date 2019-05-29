const isServer = typeof window === 'undefined'

// For testing and old browsers
const localStorage =
  process.env.NODE_ENV !== 'test' && !isServer && window.localStorage
    ? window.localStorage
    : {
        getItem() {
          return ''
        },
        setItem() {},
        removeItem() {}
      }
export default localStorage
