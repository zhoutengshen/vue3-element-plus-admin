import { getType } from './index'
export const isUnref = (target: any) => {
  return target === undefined || target === null
}

export const isFunc = (target: any) => {
  return getType(target) === 'Function'
}
