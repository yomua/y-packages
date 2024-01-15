export function isPrimitive(value: any): boolean {
  return typeof value !== 'object' || value === null
}

export function polyfillConsole() {
  if (!console.dir) {
    console.dir = function <T>(data: T) {
      console.log(data)
    }
  }

  if (!console.group || !console.groupEnd) {
    console.group = function (title: string) {
      console.log(title)
    }

    console.groupEnd = function () {
      console.log('')
    }
  }

  if (!console.table) {
    console.table = function <T>(data: T) {
      console.log(data)
    }
  }

  if (!console.error) {
    console.error = function (...messages: string[]) {
      console.log(messages.join(''))
    }
  }
}
