// import fs from 'fs'

import zhError from '../assets/locales/error/zh-CN.json'
import enError from '../assets/locales/error/en-US.json'
import getConfig from './getConfig'

const files = {
  error: {
    zh: zhError,
    en: enError,
  },
}

const PROJECT_ROOT = process.cwd() // 如: D:/code/y-packages/packages/y-screw

// 尝试将 import screwConfig from '../../screw.config.js' 这行导入代码注入到此文件的最前面以及里面的文件内容
// function before() {
//   const reg = new RegExp(`${PROJECT_ROOT.replace(/\\/g, '/')}`)

//   // e.g. D:/code/y-packages/packages/y-screw/src/utils/getMsg.ts
//   const currentFileAbsPath = import.meta.url
//     .replace(/(file:\/\/\/)|(file:\/\/)/g, '')
//     .replace(/\\/g, '/')

//   // e.g. src/utils/getMsg.ts
//   const currentFileRelativePath = currentFileAbsPath
//     .replace(reg, '')
//     .replace('/', '')

//   // e.g. [ 'src', 'utils', 'getMsg.ts' ]
//   const splitArr = currentFileRelativePath.split('/')

//   // 得到 '../../screw.config.js.js
//   const injectRelativePath = splitArr
//     .map((_, index) => {
//       if (index === splitArr.length - 1) {
//         return `screw.config.js`
//       }
//       return '../'
//     })
//     .join('')

//   const content = fs.readFileSync(currentFileAbsPath, 'utf-8')

//   fs.writeFileSync(
//     currentFileAbsPath,
//     `import screwConfig from '${injectRelativePath}'\n` + content,
//     'utf-8',
//   )
// }

export default function getMsg(
  key: string,
  appendMsg?: string,
  options?: {
    type: 'error'
  },
) {
  // 可以通过读取当前项目根目录下的 locale 配置, 来切换语言
  const { type = 'error' } = options ?? {}

  const { locale } = getConfig()

  const isEn = locale === 'en'
  const isZh = locale === 'zh'

  if (!key) {
    if (isEn) {
      throw new Error(`[getMsg]: key is not exist.`)
    }

    if (isZh) {
      throw new Error(`[getMsg]: key 不存在。`)
    }

    throw new Error(
      `[getMsg]: Unknown error [key], please contact your administrator.`,
    )
  }

  const file = files?.[type]?.[locale]

  if (!file) {
    if (isEn) {
      throw new Error(
        `[getMsg]: ${
          isEn ? 'The type or locale is not exist.' : 'type 或 locale 不存在'
        }`,
      )
    }

    if (isZh) {
      throw new Error(
        `[getMsg]: ${
          isEn ? 'The type or locale is not exist.' : 'type 或 locale 不存在'
        }`,
      )
    }

    throw new Error(
      `[getMsg]: Unknown error [file], please contact your administrator.`,
    )
  }

  return file[key] + appendMsg
}
