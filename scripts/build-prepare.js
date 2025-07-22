const { execSync } = require('child_process');
const fs = require('fs');
const yaml = require('yaml');
const path = require('path');
const os = require('os');

// Read template config
let config = yaml.parse(fs.readFileSync('./jekyll/template_config.yml', 'utf8'));

// Determine which assets directory to use
const mode = process.argv[2] || '--dev';
const commit_hash = execSync('git log origin/assets -1 --format=%H').toString().trim();
const assets_dir = mode === '--prod' ? `https://cdn.jsdelivr.net/gh/MUmarShahbaz/Oscilloscope-Online-V2@${commit_hash}` : 'assets';

if (mode === '--dev') {
    // Use local assets and host appropriate to http-server
    const interface = os.networkInterfaces();
    const ip = Object.values(interface)
        .flat()
        .find(i => i.family === 'IPv4' && !i.internal)?.address;
    config.url = `http://${ip}:8080`;
    config.baseurl = null;
    fs.cpSync(path.resolve('./assets'), path.resolve('./jekyll/assets'), { recursive: true });
}

// Update directories
config.logo = `${assets_dir}/img/icon.svg`;
config.dynamic_assets.source.asset_dir = `${assets_dir}`;

// Save as _config.yml
fs.writeFileSync('./jekyll/_config.yml', yaml.stringify(config), 'utf8');