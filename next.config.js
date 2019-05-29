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
    webpack: config => {
      // Allow `import 'lib/message'`
      config.resolve.alias['lib'] = path.join(__dirname, 'lib')

      // ESLint on build
      config.module.rules.push({
        test: /\.js$/,
        loader: 'eslint-loader',
        exclude: /node_modules/
      })

      return config
    }
  })
)
