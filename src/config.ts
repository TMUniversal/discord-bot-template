/* eslint-disable @typescript-eslint/no-var-requires */
import { join } from 'path'
import { Snowflake } from 'discord.js'

interface ConfigFile {
  version: string | number
  clientToken: string
  webhook: {
    id: Snowflake
    secret: string
  }
  prefix: string
  owners: Snowflake | Snowflake[]
  userBlacklist: Snowflake[]
  counter: {
    namespace: string
    someKey: string
  }
}

export interface PackageJson {
  name: string
  version: string
  description: string
  main: string
  scripts: {
    [name: string]: string
  }
  author: string
  contributors: string[]
  license: string
  devDependencies?: {
    [packageName: string]: string
  }
  dependencies?: {
    [packageName: string]: string
  }
  repository?: {
    type: string
    url: string
  }
  keywords?: string[]
  bugs?: {
    url: string
  }
  homepage?: string
}

const file = require(join('..', 'config', 'main.json')) as ConfigFile
const pkg = require('../package.json') as PackageJson

const config: ConfigFile = { version: pkg.version, ...file }

export default config
