const proxy = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(proxy('/api', {target: 'http://localhost:11071'}));
    // app.use(proxy('/socket', {target: 'ws://localhost:11071', ws: true}));
};