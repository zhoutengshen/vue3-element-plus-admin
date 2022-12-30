/** 获取数据类型 */
export const getType = (target: any): string => {
  const value = Object.prototype.toString.call(target)
  return value.match(/\[.+ (.+)\]/)?.[1] || ''
}
