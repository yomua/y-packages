import { CHALK_COLOR_MAP } from './constants'

const dye = {
  info: function (...messages: string[]) {
    const message = messages.join('')
    return CHALK_COLOR_MAP['info'](message)
  },
  error: function (...messages: string[]) {
    const message = messages.join('')
    return CHALK_COLOR_MAP['error'](message)
  },
  success: function (...messages: string[]) {
    const message = messages.join('')
    return CHALK_COLOR_MAP['success'](message)
  },
  warning: function (...messages: string[]) {
    const message = messages.join('')
    return CHALK_COLOR_MAP['warning'](message)
  },
  hex: CHALK_COLOR_MAP['hex'],
  rgb: CHALK_COLOR_MAP['rgb'],
  bgHex: CHALK_COLOR_MAP['bgHex'],
  bgRgb: CHALK_COLOR_MAP['bgRgb'],
}

export default dye
