const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/Movies',
    createProxyMiddleware({
      target: 'https://www.eventcinemas.com.au',
      changeOrigin: true,
    })
  );
};