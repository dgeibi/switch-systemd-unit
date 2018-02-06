import mri from 'mri'
import { resolve } from 'path'
import fs from 'fs'
import { isFile } from './util'

const uniq = x => (Array.isArray(x) ? [...new Set(x)] : [])

export default function getOpts(
  args,
  mriOpts,
  { base, array, single, required, onRequiredFail, configOptKey, onReadConfigError }
) {
  const opts = base || {}
  const mout = mri(args, mriOpts)
  const cliOpts = {}
  const has = Object.prototype.hasOwnProperty

  uniq(array).forEach(key => {
    if (!has.call(mout, key)) return
    if (Array.isArray(mout[key])) {
      cliOpts[key] = mout[key]
    } else {
      cliOpts[key] = [mout[key]]
    }
  })

  uniq(single).forEach(key => {
    if (!has.call(mout, key)) return
    const value = mout[key]
    if (Array.isArray(value)) {
      if (value[0] !== undefined) {
        cliOpts[key] = value[0]
      }
      return
    }
    cliOpts[key] = value
  })

  let fileOpts = null
  if (configOptKey && cliOpts[configOptKey]) {
    fileOpts = readOpts(cliOpts[configOptKey], onReadConfigError)
  }
  Object.assign(opts, fileOpts, cliOpts)

  if (Array.isArray(required)) {
    const keys = required.filter(k => !has.call(opts, k))
    if (keys.length > 0) onRequiredFail(keys)
  }

  return opts
}

function readOpts(configPath, onError) {
  const filepath = resolve(process.cwd(), configPath)
  if (!isFile(filepath)) {
    return null
  }
  try {
    return JSON.parse(fs.readFileSync(filepath, 'utf8'))
  } catch (e) {
    onError(e)
  }
  return null
}
