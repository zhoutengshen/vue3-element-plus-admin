/**
 * 扁平化联合类型，且使其只读
 */
type ReadonlyFlat<T> = {
  readonly [P in keyof T]: T[P]
}

/** 获取数组类型 */
type GetArrValue<T> = T extends (infer V)[] ? V : never
