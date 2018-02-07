import { h } from 'ink'
import SelectInput from 'ink-select-input'
import * as systemctl from './systemctl'

const DISABLE_ALL = Symbol.for('disable-all')

async function disableAll(states) {
  const outputs = []
  for (const { unit, enabled, active } of states) {
    if (enabled) {
      await collectOutputs(outputs, systemctl.disable(unit))
    }
    if (active) {
      await collectOutputs(outputs, systemctl.stop(unit))
    }
  }
  return outputs
}

async function collectOutputs(outputs, promise) {
  const { status, stderr, stdout } = await promise
  if (status === 0) {
    const out = String(stdout || stderr)
    if (out) {
      outputs.push({ type: 'stdout', out })
    }
  } else {
    const out = String(stderr || stdout)
    if (out) {
      outputs.push({ type: 'stderr', out })
    }
  }
}

export default function SwitchUnit({ states, setStates }) {
  const items = [
    { label: 'Disable All', value: DISABLE_ALL },
    ...states.filter(x => !x.active).map(({ unit }) => ({ label: unit, value: unit })),
  ]

  const handleSelect = async ({ value }) => {
    const outputs = await disableAll(states)

    if (value !== DISABLE_ALL) {
      await collectOutputs(outputs, systemctl.start(value))
      await collectOutputs(outputs, systemctl.enable(value))
    }

    setStates(outputs)
  }

  return <SelectInput items={items} onSelect={handleSelect} />
}
