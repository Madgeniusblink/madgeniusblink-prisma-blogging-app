require('@babel/register');
require('@babel/polyfill/noConflict');
require("@babel/core")

const server = require("../../src/server").default;

module.exports = async () => {
    global.httpServer = await server.start({ port: 4000 });
}
