const path = require('path');
const execSync = require('child_process').execSync;

const wikiFolderName = require('../package.json').name;

const repoFolder = path.join(path.dirname(__filename), '..');

const tiddlyWikiFolder = path.join(repoFolder, wikiFolderName);
// console.log("---------tiddlyWikiFolder", tiddlyWikiFolder)
// cross-env TIDDLYWIKI_PLUGIN_PATH='node_modules/tiddlywiki/plugins/published' TIDDLYWIKI_THEME_PATH='${wikiFolderName}/themes'
process.env['TIDDLYWIKI_PLUGIN_PATH'] = `${tiddlyWikiFolder}/plugins`;
process.env['TIDDLYWIKI_THEME_PATH'] = `${tiddlyWikiFolder}/themes`;

const execAndLog = (command, options) => console.log(String(execSync(command, options)));

module.exports = function build() {
  // npm run build:prepare
  execAndLog(`rm -rf ${repoFolder}/public`);
  console.log("-------------------------1")
  // npm run build:public
  execAndLog(
    `cp -r ${tiddlyWikiFolder}/public/ ./public`,
    { cwd: repoFolder }
  );
  console.log("-------------------------2")
  // npm run build:nodejs2html
  execAndLog(`tiddlywiki ${wikiFolderName} --build externalimages`, { cwd: repoFolder });
  console.log("-------------------------3")
  // npm run build:sitemap
  execAndLog(
    `tiddlywiki ${wikiFolderName} --rendertiddler sitemap sitemap.xml text/plain && mv ${tiddlyWikiFolder}/output/sitemap.xml ./public/sitemap.xml`,
    { cwd: repoFolder }
  );
  console.log("-------------------------4")
  // npm run build:minifyHTML
  execAndLog(
    `html-minifier-terser -c ./html-minifier-terser.config.json -o ./public/index.html ${tiddlyWikiFolder}/output/index.html`,
    { cwd: repoFolder }
  );
  console.log("-------------------------5")
  // npm run build:precache
  execAndLog(`workbox injectManifest workbox-config.js`, { cwd: repoFolder });
  console.log("-------------------------6")
  // npm run build:clean
  execAndLog(`rm -r ${tiddlyWikiFolder}/output`, { cwd: repoFolder });
  console.log("-------------------------7")
  // npm run build:pluginLibrary
  // execAndLog(`tiddlywiki ${wikiFolderName} --output public/library --build library`, { cwd: repoFolder });
};
