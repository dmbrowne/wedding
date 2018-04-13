const withSass = require('@zeit/next-sass')
const withCss = require('@zeit/next-css')
const withTypescript = require('@zeit/next-typescript')
const commonsChunkConfig = require('@zeit/next-css/commons-chunk-config')

module.exports = withTypescript(
  withCss(
    withSass({
      webpack: (config, { isServer }) => {
        if (!isServer) {
          config = commonsChunkConfig(config, /\.(sass|scss|css)$/)
        }
        return config
      },
      pageExtensions: ['tsx'],
      cssModules: false,
      sassLoaderOptions: {
        includePaths: ["node_modules"]
      },
      cssLoaderOptions: {
        includePaths: ["node_modules"]
      },
      useFileSystemPublicRoutes: process.env.NODE_ENV === 'development',
    })
  )
)