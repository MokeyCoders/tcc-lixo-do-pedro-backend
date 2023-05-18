declare namespace NodeJS {
  interface Global {
    __DEV__: boolean
    __STAGING__: boolean
    __PROD__: boolean
  }
}
