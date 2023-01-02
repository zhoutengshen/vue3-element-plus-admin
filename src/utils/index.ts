import { isArray, isString, isUndef, isFunc, isObject, isReg, isDate } from './is'

/** 获取数据类型 */
export const getType = (target: any): string => {
  const value = Object.prototype.toString.call(target)
  return value.match(/\[.+ (.+)\]/)?.[1] || ''
}

export const getLocalStoreValue = <T>(key: string): T | null => {
  const valueStr = localStorage.getItem(key)
  if (!valueStr) {
    return null
  }
  try {
    return JSON.parse(valueStr) as T
  } catch (e) {
    // @ts-ignore
    return valueStr as T
  }
}

export const setLocalStoreValue = <T>(key: string, value: T): void => {
  if (isUndef(value)) {
    return localStorage.removeItem(key)
  }
  if (isString(value)) {
    return localStorage.setItem(key, value)
  }
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    /* empty */
  }
}

export const pick = <T extends Object, K extends keyof T = keyof T>(
  target: T,
  keys: K[] = Object.keys(target) as K[],
): Pick<T, GetArrValue<typeof keys>> => {
  const result = keys.reduce((pre, key) => {
    pre[key] = target[key]
    return pre
  }, {} as Pick<T, GetArrValue<typeof keys>>)
  return result
}

export const deepCopy = <T>(target: T): T => {
  if (isUndef(target)) {
    return target
  }
  if (isFunc(target)) {
    return target
  }
  if (isArray(target)) {
    const result = Array()
    target.forEach((item) => {
      result.push(deepCopy<T>(item))
    })
    // @ts-ignore
    return result
  }
  if (isReg(target)) {
    // @ts-ignore
    return new RegExp(target)
  }
  if (isDate(target)) {
    // @ts-ignore
    return new Date(target.valueOf())
  }
  if (isObject(target)) {
    const obj = Object.create({})
    Object.keys(target).forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        // @ts-ignore
        const value = target[key]
        obj[key] = deepCopy(value)
      }
    })
    return obj
  } else {
    return target
  }
}
