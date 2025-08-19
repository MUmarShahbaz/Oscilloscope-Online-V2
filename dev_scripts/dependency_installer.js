const { exec } = require('child_process');
const readline = require('readline');
const { create_child, quit_all, check_package } = require('./sub_mgmt');

let children = [];

process.on('SIGINT', () => quit_all(children));
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('Checking for Ruby');
exec('ruby -v', (error, stdout, stderr) => {
  if (error) {
    console.error('Ruby not found, please install Ruby 3.2+\n\nerror: ', error.message);
    rl.close();
    process.exit(1);
  }

  const versionMatch = stdout.match(/ruby (\d+)\.(\d+)\.(\d+)/);

  if (!versionMatch) {
    console.error('Could not parse Ruby version');
    rl.question('Do you wish to force try? [Y/N] : ', (answer) => {
        if (answer.toLowerCase() === 'n') {
            rl.close();
            process.exit(1);
        }
        rl.close();
        checkBundler();
    });
  } else {
    const [major, minor] = [parseInt(versionMatch[1]), parseInt(versionMatch[2])];

    if (major > 3 || (major === 3 && minor >= 2)) {
        console.log(`✅ Ruby version is ${major}.${minor} — OK (>= 3.2)`);
        rl.close();
        const bundler = check_package('bundle -v');
        if (bundler.present) {
          console.log(`✅ Bundler was found\n`);
          console.log('Starting Bundler Install and NPM Install\n');
          create_child('NodeJS => NPM', 'npm install', undefined, 16).then(child => children.push(child));
          create_child('Ruby => Bundler', 'bundle install', undefined, 16).then(child => children.push(child));
        } else {
          console.log(`❌ Bundler was not found\n`);
          console.log(bundler.error);
        }
    } else {
        console.error(`❌ Ruby version is ${major}.${minor} — too old (requires >= 3.2)`);
        rl.close();
        process.exit(1);
    }
  }
});