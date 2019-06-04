module.exports = require('leaflet')

const MAPTILER_KEY = process.env.MAPTILER_KEY
module.exports.getTileUrl = (map = 'positron') =>
  `https://api.maptiler.com/maps/${map}/256/{z}/{x}/{y}@2x.png?key=${MAPTILER_KEY}`
