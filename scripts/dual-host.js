const { spawn } = require('child_process');
const readline = require('readline');

let children = [];

function runCommand(label, command, directory = process.cwd()) {
  return new Promise((resolve, reject) => {
    const child = spawn('cmd.exe', ['/c', command], {
      cwd: directory,
      stdio: ['ignore', 'pipe', 'pipe']
    });

    // Prefix each line of stdout
    const rlOut = readline.createInterface({ input: child.stdout });
    rlOut.on('line', (line) => {
      console.log(`[${label}] ${line}`);
    });

    // Prefix each line of stderr
    const rlErr = readline.createInterface({ input: child.stderr });
    rlErr.on('line', (line) => {
      console.error(`[${label} ERROR] ${line}`);
    });

    child.on('close', (code) => {
      console.log(`[${label}] exited with code ${code}`);
      if (code === 0) {
        resolve(child);
      } else {
        reject(new Error(`Command "${command}" exited with code ${code}`));
      }
    });
  });
}

// Example: long-running or noisy commands
runCommand(' Jekyll ', 'bundle exec jekyll build --watch', './jekyll').then(child => children.push(child));
runCommand(' HTTP-Server ', 'http-server ./jekyll/_site -p 8080').then(child => children.push(child));

process.on('SIGINT', () => {
  console.log('\nGracefully shutting down...');
  for (const child of children) {
    child.kill('SIGINT');
  }
  runCommand(' Clean Up ', 'npm run clean').then(() => {
    console.log('Cleanup completed. Exiting...');
    process.exit(0);
  }).catch((error) => {
    console.error('Cleanup failed:', error);
    process.exit(1);
  });
});