/**
 * 扁平化联合类型，且使其只读
 */
type ReadonlyFlat<T> = {
  readonly [P in keyof T]: T[P]
}
