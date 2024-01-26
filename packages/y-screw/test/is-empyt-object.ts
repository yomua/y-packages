import isEmptyObject from '../src/isEmptyObject'

const s1 = Symbol('key')

const obj1 = {}

const obj2 = {
    a: 1,
}

const obj3 = {
    [s1]: 1,
}

console.log(isEmptyObject(obj1) === true)
console.log(isEmptyObject(obj2) === false)
console.log(isEmptyObject(obj3) === false)
