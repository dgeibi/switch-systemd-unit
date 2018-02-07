import * as systemctl from './systemctl'

export const isEnabledSync = unit =>
  systemctl
    .isEnabledSync(unit)
    .stdout.toString()
    .trim() === 'enabled'

export const isActiveSync = unit =>
  systemctl
    .isActiveSync(unit)
    .stdout.toString()
    .trim() === 'active'

export default function getState(unit) {
  return {
    unit,
    enabled: isEnabledSync(unit),
    active: isActiveSync(unit),
  }
}
