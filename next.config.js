/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')

/** @type {import('next').NextConfig} */

// Remove this if you're not using Fullcalendar features
const withTM = require('next-transpile-modules')([
  '@fullcalendar/common',
  '@fullcalendar/react',
  '@fullcalendar/daygrid',
  '@fullcalendar/list',
  '@fullcalendar/timegrid'
])

module.exports = withTM({
  trailingSlash: false,
  reactStrictMode: false,

  productionBrowserSourceMaps: false, // Disable source maps in development
  optimizeFonts: false, // Disable font optimization
  minify: false, // Disable minification

  experimental: {
    esmExternals: false,
    // modularizeImports: {
    //   lodash: {
    //     transform: 'lodash/{{member}}'
    //   },
    //   '@mui/material': {
    //     transform: '@mui/material/{{member}}'
    //   },
    //   '@mui/lab': {
    //     transform: '@mui/lab/{{member}}'
    //   },
    //   '@mui/icons-material/?(((\\w*)?/?)*)': {
    //     transform: '@mui/icons-material/{{ matches.[1] }}/{{member}}'
    //   }
    // }
  },
  webpack: config => {
    config.resolve.alias = {
      ...config.resolve.alias,
      apexcharts: path.resolve(__dirname, './node_modules/apexcharts-clevision')
    }

    return config
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: "*" },
      { protocol: 'http', hostname: "*" }
    ]
  }
  // i18n: {
  //   locales: ["uz", "en", "ru"],
  //   defaultLocale: "uz",
  // },
})
