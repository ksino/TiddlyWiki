const startNodeJSWiki = require('./startNodeJSWiki');
const watchWiki = require('./watchWiki').watchWiki;

module.exports = function build() {
    startNodeJSWiki();
    watchWiki();
}
