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
  owners: Snowflake | Array<Snowflake>
  userBlacklist: Array<Snowflake>
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
  contributors: Array<string>
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
  keywords?: Array<string>
  bugs?: {
    url: string
  }
  homepage?: string
}

const file = require(join('..', 'config', 'main.json'))
const pkg: PackageJson = require('../package.json')

const config: ConfigFile = { version: pkg.version, ...file }

export default config
