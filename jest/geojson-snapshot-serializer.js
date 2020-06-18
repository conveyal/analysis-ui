/**
 * Snapshot serializer for geojson data dealing with precision issues. Some
 * snapshot tests of geojson data were failing because floating point ops were
 * not consistent between @mattwigway's Mac and Travis CI. This truncates those
 * floats.
 *
 * Written in ES5 because Jest does not transpile it.
 */

module.exports = {
  /** this makes the snapshot of the JSON */
  print: function (val) {
    return JSON.stringify(
      val,
      function (key, val) {
        if (typeof val === 'number') return val.toFixed(8)
        else return val
      },
      2
    )
  },

  /**
   * This tests whether this snapshot serializer should be used (confirming
   * this is GeoJSON data)
   */
  test: function (val) {
    return (
      val &&
      (val.type === 'FeatureCollection' ||
        val.type === 'Feature' ||
        val.type === 'Geometry')
    )
  }
}
