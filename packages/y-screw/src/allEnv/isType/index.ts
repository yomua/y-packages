import { JSValueType } from '../../index.d'

import getType from '../getType'

export default function <T>(value: any, type: JSValueType): value is T {
  return getType(value) === type
}
