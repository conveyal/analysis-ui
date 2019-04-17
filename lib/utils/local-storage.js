const isServer = typeof window === 'undefined'

// For testing and old browsers
const localStorage =
  !isServer && window.localStorage
    ? window.localStorage
    : {
        getItem() {
          return ''
        },
        setItem() {},
        removeItem() {}
      }
export default localStorage
