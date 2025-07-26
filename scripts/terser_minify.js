const fs = require('fs');
const path = require('path');
const { minify } = require('terser');

const input = './ts-output';
const output = './assets/scripts';

if (fs.existsSync(path.resolve(output))) {
  fs.rmSync(path.resolve(output), { recursive: true, force: true });
}

try {
  fs.mkdirSync(path.resolve(output), { recursive: true });
  console.log('Directory created successfully!');
} catch (err) {
  console.error('Error creating directory:', err);
}

fs.readdir(input, async (err, files) => {
  if (err) {
    console.error('Failed to read directory:', err);
    return;
  }

  for (const file of files) {
    const filePath = path.join(input, file);

    if (path.extname(file) === '.js' && !file.endsWith('.min.js')) {
      try {
        const code = fs.readFileSync(filePath, 'utf8');
        const result = await minify(code, {
          compress: true,
          mangle: true
        });

        const minFilePath = path.join(output, path.basename(file, '.js') + '.min.js');
        fs.writeFileSync(minFilePath, result.code, 'utf8');
        console.log(`Minified: ${file} -> ${path.basename(minFilePath)}`);
      } catch (e) {
        console.error(`Error minifying ${file}:`, e);
      }
    }
  }
  del_tsc();
});


const del_tsc = () => {
  const ts_output = './ts-output';

  if (fs.existsSync(path.resolve(ts_output))) {
    fs.rmSync(path.resolve(ts_output), { recursive: true, force: true });
  }
};