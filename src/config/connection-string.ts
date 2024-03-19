import * as dotenv from 'dotenv'
dotenv.config()

export type connectionString = string | undefined

export function newConnectionString(): connectionString {
  if (
    (process.env.DB_NAME as 'string') ||
    (process.env.DB_USERNAME as 'string') ||
    (process.env.DB_PASSWORD as 'string')
  ) {
    console.log('Env is: ', process.env.NODE_ENV, ', Connected to:', process.env.DB_NAME)
    return `postgres://${process.env.DB_USERNAME}:${process.env.DB_USERNAME}@:5432/${process.env.DB_NAME}`
  } else {
    console.log('incorrect connction string')
    return undefined
  }
}
