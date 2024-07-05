import ExpectClass from './ExpectClass'

let valueList: any[] = []
let result: any

const expect = (source) => {}

const proxyExpect = new Proxy(expect, {
  get(target, prop, receiver) {
    console.log('🚀 ~ get ~ prop:', prop)
    return proxyExpect
  },

  apply(target, thisArg, argumentsList: any[]) {
    valueList.push(argumentsList[0])

    if (valueList.length === 2) {
      return valueList[0] === valueList[1]
    }

    return proxyExpect
  },
})

export default proxyExpect
