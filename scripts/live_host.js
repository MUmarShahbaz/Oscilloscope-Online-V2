const { execSync } = require('child_process');
const { create_child, quit_all, check_package } = require('./sub_mgmt');

let children = [];

process.on('SIGINT', () => {
    console.log('Cleaning up');
    execSync('npm run clean')
    quit_all(children);
});

const http = check_package('npx http-server --version');
const bundle = check_package('bundle -v');

if (http.present) {
    console.log('✅ http-server is available.');
} else {
    console.log('❌ http-server is not available in this directory.');
    console.log('try `npm run dependencies`');
    console.error(http.error);
    process.exit(1);
}

if (bundle.present) {
    console.log('✅ bundle is available.');
} else {
    console.log('❌ bundle is not available in this directory.');
    console.log('try `npm run dependencies`');
    console.error(bundle.error);
    process.exit(1);
}

create_child('ts_parser', 'node ./scripts/typescript_parser --live', undefined, 18);
create_child('http-server', 'http-server ./jekyll/_site -p 8080 -S -C ./temp/cert.pem -K ./temp/key.pem', undefined, 18);
create_child('bundler => jekyll', 'bundle exec jekyll build --watch', './jekyll' , 18);