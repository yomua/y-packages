import getType from '../getType'
import { JSValueType } from '../index.d'

export default function <T>(value: any, type: JSValueType): value is T {
  return getType(value) === type
}
