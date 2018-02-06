import { h } from 'ink'
import SelectInput from 'ink-select-input'
import * as systemctl from './systemctl'

const DISABLE_ALL = Symbol.for('disable-all')

function disableAll(states) {
  const outputs = []
  states.forEach(({ unit, enabled, active }) => {
    if (enabled) {
      collectOutputs(outputs, systemctl.disable(unit))
    }
    if (active) {
      collectOutputs(outputs, systemctl.stop(unit))
    }
  })
  return outputs
}

function collectOutputs(outputs, cp) {
  if (cp.status === 0) {
    outputs.push({ type: 'stdout', out: String(cp.stderr) })
  } else {
    outputs.push({ type: 'stderr', out: String(cp.stderr) })
  }
}

export default function SwitchUnit({ states, setStates }) {
  const items = [
    { label: 'Disable All', value: DISABLE_ALL },
    ...states.filter(x => !x.active).map(({ unit }) => ({ label: unit, value: unit })),
  ]

  const handleSelect = ({ value }) => {
    const outputs = disableAll(states)

    if (value !== DISABLE_ALL) {
      collectOutputs(outputs, systemctl.start(value))
      collectOutputs(outputs, systemctl.enable(value))
    }

    setStates(outputs)
  }

  return <SelectInput items={items} onSelect={handleSelect} />
}
