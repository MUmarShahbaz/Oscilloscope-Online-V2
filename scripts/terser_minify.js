// minify-folders.js
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const inputDir = path.resolve('ts-output');
const outputDir = path.resolve('assets/scripts');

console.log(`🔍 Looking for folders in: ${inputDir}`);
console.log(`📦 Output will be written to: ${outputDir}`);

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
  console.log(`📁 Created output directory: ${outputDir}`);
}

const folders = fs.readdirSync(inputDir, { withFileTypes: true }).filter(dirent => dirent.isDirectory());

if (folders.length === 0) {
  console.log(`⚠️  No subfolders found in "${inputDir}".`);
  process.exit(0);
}

let processedCount = 0;

folders.forEach((entry) => {
  const folderName = entry.name;
  const folderPath = path.join(inputDir, folderName);
  console.log(`\n📂 Processing folder: ${folderName}`);

  const jsFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));

  if (jsFiles.length === 0) {
    console.warn(`⚠️  No JS files found in "${folderPath}". Skipping.`);
    return;
  }

  if (jsFiles.length > 1) {
    console.warn(`⚠️  Multiple JS files in "${folderPath}". Only the first will be used.`);
  }

  const inputFile = path.join(folderPath, jsFiles[0]);
  const outputFile = path.join(outputDir, `${folderName}.js`);

  console.log(`📄 Found file: ${inputFile}`);
  console.log(`➡️  Will output to: ${outputFile}`);

  try {
    execSync(`npx terser "${inputFile}" -o "${outputFile}" --compress --mangle`, { stdio: 'inherit' });
    console.log(`✅ Minified: ${outputFile}`);
    processedCount++;
  } catch (err) {
    console.error(`❌ Error processing ${inputFile}:`, err.message);
  }
});

fs.rmSync(path.resolve('ts-output'), { recursive: true, force: true });

console.log(`\n🎉 Done. Processed ${processedCount} folder(s).\n`);
