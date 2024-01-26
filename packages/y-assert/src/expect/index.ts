import flag from '../utils/flag'

class Expect {
  private _self: this

  constructor() {
    this._self = this
  }

  _store(source: any) {
    flag(this._self, 'expect', source)

    return this._self
  }

  equal(target: any) {
    if (Object.is(flag(this._self, 'expect'), target)) {
      return true
    }

    throw new Error('失败')
  }
}

const ex = new Expect()

const expect = (source: any) => {
  return ex._store(source)
}

export default expect
