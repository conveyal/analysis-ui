const I = jest.requireActual('@fortawesome/free-solid-svg-icons')

/**
 * Return just the name and not the entire SVG object. Throw an error if the
 * icon does not exist.
 */
module.exports = new Proxy(
  {},
  {
    get(target, name) {
      if (!I[name]) throw new Error(`Icon type ${name} does not exist`)
      return {
        ...I[name],
        icon: [] // blank out the exact SVG info for Snapshots
      }
    }
  }
)
