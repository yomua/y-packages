const assert: {
  (): void
  expect: (source: any) => {
    (): void
    equal(target: any): boolean
  }
}

export default assert
