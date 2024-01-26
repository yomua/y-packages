import * as http from 'http'
import type HTTP from 'http'

import DEFAULT_CONFIG from '../../defaultConfig.json'

import type { RequestConfig } from '../index.d'

import { IS_BROWSER, IS_NODE } from './constants'

const request = (rUrl: string | null, config?: RequestConfig) => {
  // 通过 request 传过来的 config 将覆盖 request.config
  const {
    url,
    options,
    isRequest,
    data: requestData,
    onError = () => void 0,
    onSuccess = () => void 0,
    onReceiver = () => void 0,
  } = Object.assign({}, request.config, config)

  // 通过 request 传过来的 url 将覆盖 request.config.url
  const activeUrl = rUrl || url

  if (!activeUrl || !isRequest) return

  if (IS_BROWSER) {
    fetch(
      activeUrl,
      Object.assign({}, options, { body: requestData }) as RequestInit,
    )
      .then(onSuccess)
      .catch(onError)

    return
  }

  if (IS_NODE) {
    const req = http.request(
      activeUrl,
      options as HTTP.RequestOptions,
      (res) => {
        let data: any[] = []

        // (流式)接收数据
        // 服务端若支持流式传输, 则每次传输都会触发此事件, 所以使用数组接受数据
        // 若不支持, 则会一次性获取所有数据
        // 轻服务端框架可参见: https://github.com/yomua/y-packages/tree/master/packages/y-server
        res.on('data', (chunk) => {
          data.push(onReceiver(chunk))
        })

        res.on('end', () => {
          onSuccess(data)
        })
      },
    )

    // 发送数据给服务端, Buffer 格式
    req.write(
      typeof requestData === 'string'
        ? requestData
        : JSON.stringify(requestData),
    )

    req.on('error', (e) => {
      onError(e)
    })
  }
}

request.config = DEFAULT_CONFIG.request as RequestConfig

export default request
