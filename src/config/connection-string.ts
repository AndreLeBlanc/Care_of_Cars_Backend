var env = process.env.NODE_ENV || 'dev'
let DB_NAME = process.env.DB_NAME
if (env == 'test') {
  DB_NAME = process.env.TEST_DB_NAME
}
console.log('Env is: ', process.env.NODE_ENV, ', Connected to:', DB_NAME)
export const connectionString = `postgres://${process.env.DB_USERNAME}:${process.env.DB_USERNAME}@localhost:5432/${DB_NAME}`
