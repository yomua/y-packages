export default function (initNumber = '') {
    let result = ''
    let intResult = ''
    let decimalsResult = ''

    return {
        add(num: string) {
            let iInt = `${initNumber}`.split('.')[0]
            let nInt = `${num}`.split('.')[0]
            let iDecimals = `${initNumber}`.split('.')[1]
            let nDecimals = `${num}`.split('.')[1]

            // 将整数的长度补到相等
            if (iInt.length < nInt.length) {
                iInt = iInt.padStart(nInt.length, '0')
            } else {
                nInt = nInt.padStart(iInt.length, '0')
            }

            // 如果小数不存在，就认为是空字符串, 空字符串长度为 0
            if (!iDecimals) {
                iDecimals = ''
            }

            if (!nDecimals) {
                nDecimals = ''
            }

            // 将小数的长度补到相等
            if (iDecimals.length < nDecimals.length) {
                iDecimals = iDecimals.padStart(nDecimals.length, '0')
            } else {
                nDecimals = nDecimals.padStart(iDecimals.length, '0')
            }

            // 从它们一个个取字符，然后相加
            // TIP: 因为已经补齐了长度，所以任意选择一个数字的长度遍历即可。
            for (let i = iInt.length - 1; i >= 0; i--) {
                const iValue = iInt[i]
                const nValue = nInt[i]

                intResult = `${+iValue + +nValue}${intResult}`
            }

            for (let i = iDecimals.length - 1; i >= 0; i--) {
                const iDecimalsValue = iDecimals[i]
                const nDecimalsValue = nDecimals[i]

                decimalsResult = `${
                    +iDecimalsValue + +nDecimalsValue
                }${decimalsResult}`
            }

            return this
        },
        get() {
            if (decimalsResult) {
                result = `${intResult}.${decimalsResult}`
            } else {
                result = intResult
            }

            return result || initNumber
        },
    }
}
