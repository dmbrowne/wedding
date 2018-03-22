const withSass = require('@zeit/next-sass')
module.exports = withSass({
  cssModules: true,
	sassLoaderOptions: {
    includePaths: ["node_modules"]
  }
})