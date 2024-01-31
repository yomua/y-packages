import ExpectClass from './ExpectClass'

const expect = (source: any) => {
  return new ExpectClass(source)
}

export default expect
