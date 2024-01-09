import { ClassNamesType } from './index.d'

const classnames = (...args: ClassNamesType[]) => {
  const classes: (string | number)[] = []

  for (let i = 0; i < args.length; i++) {
    const value = args[i]

    const isString = typeof value === 'string'

    const isNumber = typeof value === 'number'

    const isArray =
      Array.isArray(value) &&
      Object.prototype.toString.call(value) === '[object Array]'

    const isObject =
      typeof value === 'object' &&
      Object.prototype.toString.call(value) === '[object Object]'

    if (isString || isNumber) {
      classes.push(value)
    } else if (isArray) {
      const v = classnames(...value)
      classes.push(v)
    } else if (isObject) {
      for (const key in value) {
        if (
          Reflect.has(value, key) &&
          (value as Record<string, unknown>)[key]
        ) {
          classes.push(key)
        }
      }
    }
  }

  return classes.join(' ')
}

export default classnames
