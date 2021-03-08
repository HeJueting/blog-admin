const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        createProxyMiddleware({
            target: 'http://localhost',
            router: {
                localhost: 'http://localhost:3000',
            },
        })
    );
};
