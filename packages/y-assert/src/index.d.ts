export type Locales = 'zh-CN' | 'en-US'

const assert: {
  (): void
  expect: (source: any) => ExpectClass
  locales: Locales
}

export default assert
