// 声明一些没有types 的module,这些模块一般没有@types ,在这里声明，避开ts的类型检查
declare module 'path' {
  export declare function join(path1: string, path2: string): string
}
