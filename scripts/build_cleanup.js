const fs = require('fs');
const path = require('path');

// Delete delete _config.yml
const config_file = path.resolve('./jekyll/_config.yml');
if (fs.existsSync(config_file)) {
  console.log('Deleting session config file');
  fs.unlinkSync(config_file);
}

// Delete jekyll assets folder
const assets_folder = path.resolve('./jekyll/assets');
if (fs.existsSync(assets_folder)) {
  console.log('Removing copies of assets');
  fs.rmSync(assets_folder, { recursive: true, force: true });
}