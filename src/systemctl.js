import { spawnSync, spawn } from 'child_process'

function normalizeOutput(array) {
  if (typeof array[0] === 'string') {
    return array.join('')
  }
  if (Buffer.isBuffer(array[0])) {
    return Buffer.concat(array)
  }
  return ''
}
const pspawn = (...args) => {
  const cp = spawn(...args)
  const stdout = []
  const stderr = []

  cp.stdout.on('data', data => {
    stdout.push(data)
  })
  cp.stderr.on('data', data => {
    stderr.push(data)
  })

  return new Promise((resolve, reject) => {
    let done = false
    cp.on('close', (code, signal) => {
      if (done) return
      resolve({
        pid: cp.pid,
        stdout: normalizeOutput(stdout),
        stderr: normalizeOutput(stderr),
        status: code,
        signal,
      })
      done = true
    })
    cp.on('error', error => {
      if (done) return
      reject(error)
      done = true
    })
  })
}

const makeSync = op => unit => spawnSync('systemctl', [op, unit])
const makeAsync = op => unit => pspawn('systemctl', [op, unit])

export const enableSync = makeSync('enable')
export const disableSync = makeSync('disable')
export const startSync = makeSync('start')
export const stopSync = makeSync('stop')
export const isEnabledSync = makeSync('is-enabled')
export const isActiveSync = makeSync('is-active')

export const enable = makeAsync('enable')
export const disable = makeAsync('disable')
export const start = makeAsync('start')
export const stop = makeAsync('stop')
export const isEnabled = makeAsync('is-enabled')
export const isActive = makeAsync('is-active')
