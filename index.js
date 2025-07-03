const { spawnSync, spawn } = require('child_process')
const { existsSync, writeFileSync } = require('fs')
const path = require('path')

const SESSION_ID = 'updateThis' // Edit this line only, don't remove ' <- this symbol

let nodeRestartCount = 0
const maxNodeRestarts = 5
const restartWindow = 30000 // 30 seconds
let lastRestartTime = Date.now()

function startNode() {
  const child = spawn('node', ['index.js'], { cwd: 'levanter', stdio: 'inherit' })

  child.on('exit', (code) => {
    if (code !== 0) {
      const currentTime = Date.now()
      if (currentTime - lastRestartTime > restartWindow) {
        nodeRestartCount = 0
      }
      lastRestartTime = currentTime
      nodeRestartCount++

      if (nodeRestartCount > maxNodeRestarts) {
        console.error('Node.js process is restarting continuously. Stopping retries...')
        return
      }
      console.log(
        `Node.js process exited with code ${code}. Restarting... (Attempt ${nodeRestartCount})`
      )
      startNode()
    }
  })
}

function startPm2() {
  const pm2 = spawn('yarn', ['pm2', 'start', 'index.js', '--name', 'levanter', '--attach'], {
    cwd: 'levanter',
    stdio: ['pipe', 'pipe', 'pipe'],
  })

  let restartCount = 0
  const maxRestarts = 5 // Adjust this value as needed

  pm2.on('exit', (code) => {
    if (code !== 0) {
      // console.log('yarn pm2 failed to start, falling back to node...')
      startNode()
    }
  })

  pm2.on('error', (error) => {
    console.error(`yarn pm2 error: ${error.message}`)
    startNode()
  })

  // Check for infinite restarts
  if (pm2.stderr) {
    pm2.stderr.on('data', (data) => {
      const output = data.toString()
      if (output.includes('restart')) {
        restartCount++
        if (restartCount > maxRestarts) {
          // console.log('yarn pm2 is restarting indefinitely, stopping yarn pm2 and starting node...')
          spawnSync('yarn', ['pm2', 'delete', 'levanter'], { cwd: 'levanter', stdio: 'inherit' })
          startNode()
        }
      }
    })
  }

  if (pm2.stdout) {
    pm2.stdout.on('data', (data) => {
      const output = data.toString()
      console.log(output)
      if (output.includes('Connecting')) {
        // console.log('Application is online.')
        restartCount = 0
      }
    })
  }
}

function installDependencies() {
  // console.log('Installing dependencies...')
  const installResult = spawnSync(
    'yarn',
    ['install', '--force', '--non-interactive', '--network-concurrency', '3'],
    {
      cwd: 'levanter',
      stdio: 'inherit',
      env: { ...process.env, CI: 'true' }, // Ensure non-interactive environment
    }
  )

  if (installResult.error || installResult.status !== 0) {
    console.error(
      `Failed to install dependencies: ${
        installResult.error ? installResult.error.message : 'Unknown error'
      }`
    )
    process.exit(1) // Exit the process if installation fails
  }
}

function checkDependencies() {
  if (!existsSync(path.resolve('levanter/package.json'))) {
    console.error('package.json not found!')
    process.exit(1)
  }

  const result = spawnSync('yarn', ['check', '--verify-tree'], {
    cwd: 'levanter',
    stdio: 'inherit',
  })

  // Check the exit code to determine if there was an error
  if (result.status !== 0) {
    console.log('Some dependencies are missing or incorrectly installed.')
    installDependencies()
  } else {
    // console.log('All dependencies are installed properly.')
  }
}

function cloneRepository() {
  // console.log('Cloning the repository...')
  const cloneResult = spawnSync(
    'git',
    ['clone', 'https://github.com/lyfe00011/levanter.git', 'levanter'],
    {
      stdio: 'inherit',const { spawnsync, spawn } = require('child_process')
const { existssync, writefilesync } = require('fs')
const path = require('path')

const session_id = 'updatethis' // edit this line only, don't remove ' <- this symbol

let noderestartcount = 0
const maxnoderestarts = 5
const restartwindow = 30000 // 30 seconds
let lastrestarttime = date.now()

function startnode() {
  const child = spawn('node', ['index.js'], { cwd: 'levanter', stdio: 'inherit' })

  child.on('exit', (code) => {
    if (code !== 0) {
      const currenttime = date.now()
      if (currenttime - lastrestarttime > restartwindow) {
        noderestartcount = 0
      }
      lastrestarttime = currenttime
      noderestartcount++

      if (noderestartcount > maxnoderestarts) {
        console.error('node.js process is restarting continuously. stopping retries...')
        return
      }
      console.log(
        `node.js process exited with code ${code}. restarting... (attempt ${noderestartcount})`
      )
      startnode()
    }
  })
}

function startpm2() {
  const pm2 = spawn('yarn', ['pm2', 'start', 'index.js', '--name', 'levanter', '--attach'], {
    cwd: 'levanter',
    stdio: ['pipe', 'pipe', 'pipe'],
  })

  let restartcount = 0
  const maxrestarts = 5 // adjust this value as needed

  pm2.on('exit', (code) => {
    if (code !== 0) {
      // console.log('yarn pm2 failed to start, falling back to node...')
      startnode()
    }
  })

  pm2.on('error', (error) => {
    console.error(`yarn pm2 error: ${error.message}`)
    startnode()
  })

  // check for infinite restarts
  if (pm2.stderr) {
    pm2.stderr.on('data', (data) => {
      const output = data.tostring()
      if (output.includes('restart')) {
        restartcount++
        if (restartcount > maxrestarts) {
          // console.log('yarn pm2 is restarting indefinitely, stopping yarn pm2 and starting node...')
          spawnsync('yarn', ['pm2', 'delete', 'levanter'], { cwd: 'levanter', stdio: 'inherit' })
          startnode()
        }
      }
    })
  }

  if (pm2.stdout) {
    pm2.stdout.on('data', (data) => {
      const output = data.tostring()
      console.log(output)
      if (output.includes('connecting')) {
        // console.log('application is online.')
        restartcount = 0
      }
    })
  }
}

function installdependencies() {
  // console.log('installing dependencies...')
  const installresult = spawnsync(
    'yarn',
    ['install', '--force', '--non-interactive', '--network-concurrency', '3'],
    {
      cwd: 'levanter',
      stdio: 'inherit',
      env: { ...process.env, ci: 'true' }, // ensure non-interactive environment
    }
  )

  if (installresult.error || installresult.status !== 0) {
    console.error(
      `failed to install dependencies: ${
        installresult.error ? installresult.error.message : 'unknown error'
      }`
    )
    process.exit(1) // exit the process if installation fails
  }
}

function checkdependencies() {
  if (!existssync(path.resolve('levanter/package.json'))) {
    console.error('package.json not found!')
    process.exit(1)
  }

  const result = spawnsync('yarn', ['check', '--verify-tree'], {
    cwd: 'levanter',
    stdio: 'inherit',
  })

  // check the exit code to determine if there was an error
  if (result.status !== 0) {
    console.log('some dependencies are missing or incorrectly installed.')
    installdependencies()
  } else {
    // console.log('all dependencies are installed properly.')
  }
}

function clonerepository() {
  // console.log('cloning the repository...')
  const cloneresult = spawnsync(
    'git',
    ['clone', 'https://github.com/lyfe00011/levanter.git', 'levanter'],
    {
      stdio: 'inherit',
    }
  )

  if (cloneresult.error) {
    throw new error(`failed to clone the repository: ${cloneresult.error.message}`)
  }

  const configpath = 'levanter/config.env'
  try {
    // console.log('writing to config.env...')
    writefilesync(configpath, `vps=true\nsession_id=${session_id}`)
  } catch (err) {
    throw new error(`failed to write to config.env: ${err.message}`)
  }

  installdependencies()
}

if (!existssync('levanter')) {
  clonerepository()
  checkdependencies()
} else {
  checkdependencies()
}

startpm2()￼enter
