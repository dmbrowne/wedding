const withSass = require('@zeit/next-sass')
module.exports = withSass({
	sassLoaderOptions: {
    cssModules: true,
    includePaths: ["node_modules"]
  }
})