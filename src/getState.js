import * as systemctl from './systemctl'

export const isEnabled = unit =>
  systemctl
    .isEnabled(unit)
    .stdout.toString()
    .trim() === 'enabled'

export const isActive = unit =>
  systemctl
    .isActive(unit)
    .stdout.toString()
    .trim() === 'active'

export default function getState(unit) {
  return {
    unit,
    enabled: isEnabled(unit),
    active: isActive(unit),
  }
}
