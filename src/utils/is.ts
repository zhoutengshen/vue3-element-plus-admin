import { getType } from './index'

export const isUndef = (target: any): target is undefined | null => {
  return target === undefined || target === null
}

export const isFunc = (target: any): target is Function => {
  return getType(target) === 'Function'
}

export const isString = (target: any): target is string => {
  return getType(target) === 'String'
}

export const isArray = <T extends Array<any> = any[]>(target: any): target is T => {
  return Array?.isArray(target) || getType(target) === 'Array'
}

export const isReg = (target: any): target is RegExp => {
  return getType(target) === 'RegExp'
}

export const isObject = (target: any): target is Record<string, any> => {
  return typeof target === 'object'
}

export const isDate = (target: any): target is Date => {
  return getType(target) === 'Date'
}

/**
 * @deprecated(未验证方法，不稳定)
 * @param target
 * @returns
 */
export const isVueComponent = (target: any): target is Function => {
  if (isUndef(target)) {
    return false
  }
  if (!isObject(target)) {
    return false
  }
  if (target.__v_isVNode) {
    return true
  }
  if (isFunc(target.render)) {
    return true
  }
  if (isFunc(target.setup)) {
    return true
  }
  return false
}
