const { spawn, execSync } = require('child_process');
const path = require('path');

function create_child(label, command, dir = process.cwd(), pad = null) {
    if (pad) label = label.padEnd(pad, ' ');
    return new Promise((resolve, reject) => {
        const child = spawn('cmd.exe', ['/c', command], { cwd: path.resolve(dir) });

        // STD
        child.on('error', (err) => {
            const texts = `${err}`.split('\n');
            console.log(`[${label}]\tFailed to start:`);
            texts.forEach(element => {
                if (element.trim() !== '') {
                    console.log(`[${label}]\t${element}`);
                }
            });
        });

        child.stdout.on('data', (data) => {
            const texts = `${data}`.split('\n');
            texts.forEach(element => {
                if (element.trim() !== '') {
                    console.log(`[${label}]\t${element}`);
                }
            });
        });

        child.stderr.on('data', (err) => {
            const texts = `${err}`.split('\n');
            console.log(`[${label}]\tAn Error Occured:`);
            texts.forEach(element => {
                if (element.trim() !== '') {
                    console.log(`[${label}]\t${element}`);
                }
            });
        });

        // Ending
        child.on('close', (code) => {
            console.log(`[${label}]\tExited with code ${code}`);

            if (code === 0) {
                console.log(`[${label}]\tTask finished successfully!`);
                resolve(child);
            } else {
                reject(new Error(`Command "${command}" exited with code ${code}`));
            }
        });
    });
}

function check_package(check_command) {
    try {
        execSync(check_command, { stdio: 'ignore' });
        return {present: true};
    } catch (e) {
        return {present: false, error: e.message || e.toString()};
    }
}

const quit_all = (children) => {
  console.log('\nGracefully shutting down...');
  for (const child of children) {
    child.kill('SIGINT');
  }
  process.exit(0);
};

module.exports = {
    check_package,
    create_child,
    quit_all
};