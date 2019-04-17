const withCSS = require('@zeit/next-css')
const withImages = require('next-optimized-images')

// Pull in .env
require('dotenv').config()

const isProd = process.env.NODE_ENV === 'production'
module.exports = withImages(
  withCSS({
    optimizeImages: false,
    target: 'serverless',
    cssLoaderOptions: {
      url: false // enable importing CSS from node_modules
    },
    env: {
      API_URL: isProd ? '/api' : 'http://localhost:7070/api',
      MAPBOX_ACCESS_TOKEN: process.env.MAPBOX_ACCESS_TOKEN
    }
  })
)
