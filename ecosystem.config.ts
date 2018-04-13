module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps : [
    {
      name: 'Wedding',
      script: './index.js',
      env: {
        PORT: 4000,
        NODE_ENV: 'development',
      },
      env_production : {
        PORT: 4000,
        NODE_ENV: 'production',
      },
    },
  ],
};
