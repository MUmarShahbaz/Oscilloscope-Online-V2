const { execSync } = require('child_process');
const { create_child, quit_all, check_package } = require('./sub_mgmt');;
const fs = require('fs');
const yaml = require('yaml');
const path = require('path');
const os = require('os');

let children = [];
process.on('SIGINT', () => quit_all(children));

// Read template config
console.log('Reading template config');
let config = yaml.parse(fs.readFileSync('./jekyll/template_config.yml', 'utf8'));

// Determine which assets directory to use
const mode = process.argv[2] || '--dev';
console.log(`${mode === '--prod' ? 'Production' : 'Development'} mode`);

const commit_hash = execSync('git log origin/assets -1 --format=%H').toString().trim();
const assets_dir = mode === '--prod' ? `https://cdn.jsdelivr.net/gh/MUmarShahbaz/Oscilloscope-Online-V2@${commit_hash}` : '/assets';
console.log(`Assets: ${assets_dir}`);

if (mode === '--dev' || mode === '--prep') {
    console.log('Updating URLs to use private IP Address');
    // Use local assets and host appropriate to http-server
    const interface = os.networkInterfaces();
    const ip = Object.values(interface)
        .flat()
        .find(i => i.family === 'IPv4' && !i.internal)?.address;
    config.url = `http://${ip}:8080`;
    config.baseurl = null;

    // Cloning assets internally
    console.log('Copying assets to ./jekyll');
    fs.cpSync(path.resolve('./assets'), path.resolve('./jekyll/assets'), { recursive: true });
}

// Update directories
config.logo = `${assets_dir}/img/icon.svg`;
config.dynamic_assets.source.base = `${assets_dir}`;

// Save as _config.yml
fs.writeFileSync('./jekyll/_config.yml', yaml.stringify(config), 'utf8');
console.log('Finised preparation');
if (mode !== '--prep') {
    console.log('Starting build......');
    const bundler = check_package('bundle -v');
    if (bundler.present) {
        create_child('Jekyll => Build', 'bundle exec jekyll build', './jekyll');
    } else {
        console.log('Bundler was not detected! Could not continue.');
        console.log(bundler.error);
    }
}