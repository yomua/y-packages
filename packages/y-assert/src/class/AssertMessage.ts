class AssertMessage {
  private _error: string | null

  constructor() {
    this._error = null
  }

  set error(message: string | null) {
    this._error = message
  }

  get error() {
    return this._error
  }
}

export default AssertMessage
