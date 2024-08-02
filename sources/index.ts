import * as Commander from 'commander'
import * as ESToolkit from 'es-toolkit'
import * as SimpleGit from 'simple-git'
import PLimit from 'p-limit'
import * as Fs from 'node:fs'
import * as Os from 'node:os'
import { PostCode, GetResult, TContinent } from './globalping.js'

const Program = new Commander.Command()
Program.option('--token <token>', 'GitHub token')
Program.option('--repo <repo>', 'Github repo path')
Program.option('--config <config>', 'config file name')
Program.parse(process.argv)
// eslint-disable-next-line @typescript-eslint/naming-convention
const ProgramOptions = Program.opts() as { token: string, repo: string, config: string }
const GitInstance = SimpleGit.simpleGit({ baseDir: ProgramOptions.repo })

const RawConfig = Fs.readFileSync(`${ProgramOptions.repo}/${ProgramOptions.config}`, 'utf8')
const Config = JSON.parse(RawConfig) as { Domains: string[], AdShieldDomains: string[], Contient: TContinent[] }

const PLimitInstance = PLimit(Os.cpus().length)
const PLimitJobs: Promise<string>[] = []