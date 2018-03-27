// @flow
const CURRENT_VERSION = 0
const HEADER_ENTRIES = 7
const HEADER_LENGTH = 9 // type + entries
const TIMES_GRID_TYPE = 'ACCESSGR'

type TimesData = {
  version: number,
  zoom: number,
  west: number,
  north: number,
  width: number,
  height: number,
  nSamples: number,
  data: number[]
}

/**
 * Parse the ArrayBuffer from a `*_times.dat` file for a point in a network.
 */
export function parseTimesData (ab: ArrayBuffer): TimesData {
  const headerData = new Int8Array(ab, 0, TIMES_GRID_TYPE.length)
  const headerType = String.fromCharCode(...headerData)
  if (headerType !== TIMES_GRID_TYPE) {
    throw new Error(
      `Retrieved grid header ${headerType} !== ${TIMES_GRID_TYPE}. Please check your data.`
    )
  }

  // First read the header to figure out how big the binary portion is, then
  // read the full binary portion, then read the sidecar metadata at the end.
  const header = new Int32Array(
    ab,
    2 * Int32Array.BYTES_PER_ELEMENT,
    HEADER_ENTRIES
  )
  const version = header[0]
  // validate header and version
  if (version !== CURRENT_VERSION) {
    throw new Error(`Unsupported version ${version} of travel time surface`)
  }
  const zoom = header[1]
  const west = header[2]
  const north = header[3]
  const width = header[4]
  const height = header[5]
  const nSamples = header[6]
  const sampleSize = width * height

  // skip the header
  const data = new Int32Array(
    ab,
    HEADER_LENGTH * Int32Array.BYTES_PER_ELEMENT,
    sampleSize * nSamples
  )
  const times = []

  // de delta-code
  let offset = 0
  for (let i = 0; i < nSamples; i++) {
    let previous = 0
    for (let j = 0; j < sampleSize; j++) {
      const stored = data[offset++]
      const current = stored + previous
      times.push(current)
      previous = current
    }
  }

  return {
    version,
    zoom,
    west,
    north,
    width,
    height,
    nSamples,
    data: times,
    warnings: [],
    get (x: number, y: number) {
      const samples = []
      const basePosition = (y * width + x)
      for (let i = 0; i < nSamples; i++) {
        samples.push(times[(i * sampleSize) + basePosition])
      }
      return samples
    }
  }
}
