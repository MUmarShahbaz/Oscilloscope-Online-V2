const fs = require('fs');
const path = require('path');

// Delete delete _config.yml
const config_file = path.resolve('./jekyll/_config.yml');
if (fs.existsSync(config_file)) {
  fs.unlinkSync(config_file);
}

// Delete jekyll assets folder
const assets_folder = path.resolve('./jekyll/assets');
if (fs.existsSync(assets_folder)) {
  fs.rmSync(assets_folder, { recursive: true, force: true });
}