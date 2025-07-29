const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { create_child, quit_all, check_package } = require('./sub_mgmt');

let children = [];
const input = path.resolve('./ts-output');
const output = path.resolve('./assets/scripts');

process.on('SIGINT', () => quit_all(children));

const tsc = check_package('npx tsc --version');
const terser = check_package('npx terser --version');

if (tsc.present) {
    console.log('✅ tsc is available.');
} else {
    console.log('❌ tsc is not available in this directory.');
    console.log('try `npm run dependencies`');
    console.error(tsc.error);
    process.exit(1);
}

if (terser.present) {
    console.log('✅ terser is available.');
} else {
    console.log('❌ terser is not available in this directory.');
    console.log('try `npm run dependencies`');
    console.error(terser.error);
    process.exit(1);
}

console.log('Starting....\n\n');


exec('tsc', (error, stdout, stdin) => {
    if (error) {
        console.log('tsc did not finish successfully');
        process.exit(1);
    } else {

        if (fs.existsSync(output)) {
            fs.rmSync(output, { recursive: true, force: true });
        }

        try {
            fs.mkdirSync(output, { recursive: true });
            console.log('Recreated output directory successfully!');
        } catch (err) {
            console.error('Error in recreated output directory:', err);
        }

        fs.readdir(input, async (err, files) => {
            if (err) {
                console.error('Failed to read input directory:', err);
                return;
            }

            for (const file of files) {
                if (path.extname(file) === '.js' && !file.endsWith('.min.js')) {
                    const file_name = path.parse(file).name;
                    minify(file_name, files.length);
                }
            }
        });
    }
});

function minify(file_name, files_length) {
    create_child(`Terser => ${file_name}`, `terser ./ts-output/${file_name}.js -c -m -o ./assets/scripts/${file_name}.min.js`, undefined, 18)
        .then((child) => {
            children.push(child);
            if (children.length === files_length) del_tso();
        })
        .catch(e => console.log(e));
}

const del_tso = () => {
    const ts_output = './ts-output';

    if (fs.existsSync(path.resolve(ts_output))) {
        fs.rmSync(path.resolve(ts_output), { recursive: true, force: true });
    }
};