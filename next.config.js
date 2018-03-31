const withSass = require('@zeit/next-sass')
const withCss = require('@zeit/next-css')
const withTypescript = require('@zeit/next-typescript')
module.exports = withTypescript(
  withCss(
    withSass({
      pageExtensions: ['js'],
      cssModules: false,
      sassLoaderOptions: {
        includePaths: ["node_modules"]
      },
      cssLoaderOptions: {
        includePaths: ["node_modules"]
      }
    })
  )
)