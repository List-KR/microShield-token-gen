import * as Commander from 'commander'
import * as SimpleGit from 'simple-git'
import PLimit from 'p-limit'
import * as Fs from 'node:fs'
import * as Os from 'node:os'
import { PostCode, GetResult, TContinent } from './globalping.js'
import { webcrack } from 'webcrack'
import { ExtractCode } from './analyze.js'
import { StringToSHA1HEX } from './sha.js'

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
const PLimitJobs: Promise<void>[] = []

async function Job(Domain: string, Contient: TContinent, AdShieldDomain: string) {
  const Current = new Date()
  const PostCodeResult = await PostCode(`https://${AdShieldDomain}/loader.min.js`, { referer: `https://${Domain}` }, Contient)
  while ((await GetResult(PostCodeResult.id)).status !== 'finished') {
    await new Promise((Resolve) => setTimeout(Resolve, 1000))
  }
  const RawCode = (await GetResult(PostCodeResult.id)).results[0].result.FinishedHttpTestResult.rawBody
  Fs.writeFileSync(`/tmp/${PostCodeResult.id}`, RawCode)
  const ExtractedCode = ExtractCode((await webcrack(Fs.readFileSync(`/tmp/${PostCodeResult.id}`, 'utf8'))).code)
  Fs.writeFileSync(`${ProgramOptions.repo}/${Current.getFullYear()}/${Current.getMonth()}/${Current.getDate()}/${await StringToSHA1HEX(RawCode)}.token`, ExtractedCode)
}

for (let I = 0; I < Config.Domains.length; I++) {
  for (let J = 0; J < Config.Contient.length; J++) {
    for (let K = 0; K < Config.AdShieldDomains.length; K++) {
      PLimitJobs.push(PLimitInstance(() => Job(Config.Domains[I], Config.Contient[J], Config.AdShieldDomains[K])))
    }
  }
}

await Promise.all(PLimitJobs)
GitInstance.add('.')
GitInstance.commit('Update at ' + new Date().toISOString())
GitInstance.push()