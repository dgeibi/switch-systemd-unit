import { spawnSync } from 'child_process'

function runSd(cmd, unit) {
  return spawnSync('systemctl', [cmd, unit])
}

export const enable = unit => runSd('enable', unit)
export const disable = unit => runSd('disable', unit)
export const start = unit => runSd('start', unit)
export const stop = unit => runSd('stop', unit)
export const isEnabled = unit => runSd('is-enabled', unit)
export const isActive = unit => runSd('is-active', unit)
