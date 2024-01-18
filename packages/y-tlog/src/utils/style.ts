import chalk from 'chalk'

// https://www.npmjs.com/package/chalk#styles
const style = {
  reset: function (...messages: string[]) {
    return chalk.reset(messages.join(''))
  },
  bold: function (...messages: string[]) {
    return chalk.bold(messages.join(''))
  },
  dim: function (...messages: string[]) {
    return chalk.dim(messages.join(''))
  },
  italic: function (...messages: string[]) {
    return chalk.italic(messages.join(''))
  },
  underline: function (...messages: string[]) {
    return chalk.underline(messages.join(''))
  },
  overline: function (...messages: string[]) {
    return chalk.overline(messages.join(''))
  },
  inverse: function (...messages: string[]) {
    return chalk.inverse(messages.join(''))
  },
  hidden: function (...messages: string[]) {
    return chalk.hidden(messages.join(''))
  },
  strikethrough: function (...messages: string[]) {
    return chalk.strikethrough(messages.join(''))
  },
  visible: function (...messages: string[]) {
    return chalk.visible(messages.join(''))
  },
}

export default style
