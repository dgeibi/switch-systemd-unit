import { readdirSync } from 'fs'
import getState from './getState'

export default function getStates(configDir, template, extname) {
  const units = getUnits(configDir, template, extname)
  return units.map(getState)
}

export function getUnits(dir, template, extname) {
  const end = extname[0] === '.' || extname === '' ? extname : `.${extname}`
  let name
  let suffix
  template.replace(/^(.+)@\.(.+)$/, (_, $1, $2) => {
    name = $1
    suffix = $2
  })
  return readdirSync(dir)
    .map(x => {
      if (!endWith(x, end)) return false
      const lastIndex = x.lastIndexOf(end)
      return `${name}@${x.slice(0, lastIndex)}.${suffix}`
    })
    .filter(Boolean)
}

function endWith(x, end) {
  const lastIndex = x.lastIndexOf(end)
  return lastIndex === -1 ? false : lastIndex + end.length === x.length
}
