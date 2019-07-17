import withInitialFetch from 'lib/with-initial-fetch'

function Resources(p) {}

function initialFetch() {
  return {
    resources: []
  }
}

export default withInitialFetch(Resources, initialFetch)
