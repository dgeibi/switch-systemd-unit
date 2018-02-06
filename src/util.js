import fs from 'fs'

export const isDirectory = filepath => {
  try {
    return fs.statSync(filepath).isDirectory()
  } catch (e) {
    return false
  }
}

export const isFile = filepath => {
  try {
    return fs.statSync(filepath).isFile()
  } catch (e) {
    return false
  }
}

export const isSystemdUnitTemplate = template => /^.+@\..+$/.test(template)
