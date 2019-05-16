const withCSS = require('@zeit/next-css')
const withImages = require('next-optimized-images')
const path = require('path')

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
      API_URL: isProd ? '/api' : process.env.API_URL,
      AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
      AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
      MAPBOX_ACCESS_TOKEN: process.env.MAPBOX_ACCESS_TOKEN
    },
    webpack(config, options) {
      config.resolve.alias['lib'] = path.join(__dirname, 'lib')
      return config
    }
  })
)
