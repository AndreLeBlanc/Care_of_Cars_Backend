import { buildApp } from './app.js'
import { initDrizzle } from './config/db-connect.js'

async function start() {
  console.log('starting')
  try {
    await new Promise((resolve) => setTimeout(resolve, 10000)) // 3 sec
    await initDrizzle()
    const app = await buildApp()
    await app.listen({ port: 3000, host: '0.0.0.0' })
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

start()
