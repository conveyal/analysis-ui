const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})
const path = require('path')

const env = {
  API_URL: process.env.API_URL,
  AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
  AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
  MAPBOX_ACCESS_TOKEN: process.env.MAPBOX_ACCESS_TOKEN
}

// Log env for sanity
console.log('next.config.js -- process.env', env)

module.exports = withBundleAnalyzer({
  target: 'serverless',
  env,
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
