// This file contains code that we reuse between our tests.
const helper = require('fastify-cli/helper.js')
import * as path from 'path'
import * as test from 'node:test'
import { promises as fs } from 'fs'

export type TestContext = {
  after: typeof test.after
}

const AppPath = path.join(__dirname, '..', 'src', 'app.ts')

// Fill in this config with all the configurations
// needed for testing the application
async function config() {
  return {}
}

// Automatically build and tear down our instance
async function build(t: TestContext) {
  // you can set all the options supported by the fastify CLI command
  const argv = [AppPath]

  // fastify-plugin ensures that all decorators
  // are exposed for testing purposes, this is
  // different from the production setup
  const app = await helper.build(argv, await config())

  // Tear down our app after we are done
  t.after(() => void app.close())

  return app
}
async function writeToFile(content: string, path: string) {
  try {
    await fs.writeFile(path, content)
  } catch (err) {
    console.log(err)
  }
}
async function readFile(path: string) {
  try {
    const data = await fs.readFile(path, { encoding: 'utf8' })
    console.log(data)
    return data
  } catch (err) {
    console.log(err)
    throw err
  }
}

export { config, build, writeToFile, readFile }
