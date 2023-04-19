declare namespace NodeJS {
  interface ProcessEnv {
    readonly NEXT_APP_PINATA_API_KEY: string
    readonly NEXT_APP_PINATA_API_SECRET: string
    readonly NEXT_APP_PINATA_JWT: string
  }
}