#!/usr/bin/env node

import { h, render, Text } from 'ink'
import path from 'path'

import { isDirectory, isSystemdUnitTemplate } from './util'
import SwitchUnit from './SwitchUnit'
import Provider from './Provider'
import getOpts from './getOpts'

const args = process.argv.slice(2)

const defaults = {
  config: '/etc/switch-systemd-unit.json',
}
const options = getOpts(
  args,
  {
    string: ['template', 'dir', 'extname', 'config'],
    boolean: ['help'],
    default: defaults,
    alias: {
      h: 'help',
      t: 'template',
      c: 'config',
    },
  },
  {
    base: {
      extname: '',
    },
    single: ['template', 'dir', 'help', 'extname', 'config'],
    required: ['template', 'dir'],
    onRequiredFail: keys => {
      perror(`${keys.join('')} required`)
    },
    configOptKey: 'config',
    onReadConfigError: e => {
      console.log(e)
      perror('read config failed')
    },
  }
)

function validate(fn, value, msg) {
  if (!fn(value)) {
    perror(msg)
    return false
  }
  return true
}

function perror(msg) {
  console.error(msg)
  process.exit(1)
}

if (options.help) {
  console.log(`Usage: switch-unit
  -h, --help:     show this
  -c, --config:   config file for options below, default: "${defaults.config}"
  -t, --template: systemd unit template name, format: "name@.suffix"
  --dir:          directory for reading unit instance name
  --extname:      extname of instance files, default: ""
  `)
} else {
  main(options)
}

function main({ template, extname, dir }) {
  const directory = path.resolve(process.cwd(), dir)
  validate(isDirectory, directory, `${directory} is not a directory.`)
  validate(isSystemdUnitTemplate, template, `${template} is not a template name`)
  validate(_ => typeof _ === 'string', extname, 'extname should be a string')

  render(
    <Provider
      template={template}
      extname={extname}
      dir={directory}
      render={({ states, setStates, outputs }) => (
        <div>
          {states.filter(x => x.active || x.enabled).map(x => (
            <div key={x.unit}>
              {x.unit} {x.enabled && 'enabled'} {x.active && 'active'}
            </div>
          ))}
          <SwitchUnit setStates={setStates} states={states} />
          {outputs &&
            outputs.map(({ type, out }, i) => (
              <Text green={type === 'stdout'} red={type === 'stderr'} key={i}>
                {out}
              </Text>
            ))}
        </div>
      )}
    />
  )
}
