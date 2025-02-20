const path = require('path')

/** @type {import('next').NextConfig} */

const withTM = require('next-transpile-modules')([
  '@fullcalendar/common',
  '@fullcalendar/react',
  '@fullcalendar/daygrid',
  '@fullcalendar/list',
  '@fullcalendar/timegrid'
])

module.exports = withTM({
  trailingSlash: false,

  productionBrowserSourceMaps: false,
  optimizeFonts: true,
  swcMinify: true,

  experimental: {
    esmExternals: false
  },
  webpack: (config, { dev }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      apexcharts: path.resolve(__dirname, './node_modules/apexcharts-clevision')
    }
    if (config.cache && !dev) {
      config.cache = Object.freeze({
        type: 'memory'
      })
    }
    return config
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*' },
      { protocol: 'http', hostname: '*' }
    ]
  }
})
