import chalk from 'chalk'

import { CHALK_COLOR_MAP } from './constants.js'

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
}

export default dye
