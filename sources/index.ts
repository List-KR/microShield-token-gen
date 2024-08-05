import * as Commander from 'commander'
import * as GitHub from '@octokit/rest'
import * as Fs from 'node:fs'
import { webcrack } from 'webcrack'
import { ExtractCode } from './analyze.js'
import { StringToSHA1HEX } from './sha.js'

const Program = new Commander.Command()
Program.option('--token <token>', 'GitHub token')
Program.option('--repo <repo>', 'Github repo path')
Program.option('--target <config>', 'Targeted file')
Program.parse(process.argv)
// eslint-disable-next-line @typescript-eslint/naming-convention
const ProgramOptions = Program.opts() as { token: string, repo: string, target: string }

const Current = new Date()
const GitHubInstance = new GitHub.Octokit({ auth: ProgramOptions.token })
const RawCode = Fs.readFileSync(ProgramOptions.target, 'utf8')
const SHA = await StringToSHA1HEX(RawCode)
Fs.writeFileSync(`/tmp/${SHA}`, RawCode)
const ExtractedToken = ExtractCode((await webcrack(Fs.readFileSync(`/tmp/${SHA}`, 'utf8'))).code)
await GitHubInstance.repos.createOrUpdateFileContents({
  owner: ProgramOptions.repo.split('/')[0],
  repo: ProgramOptions.repo.split('/')[1],
  path: `${Current.getUTCFullYear()}/${Current.getUTCMonth()}/${Current.getUTCDate()}/${SHA}.token`,
  message: `Update for ${SHA}`,
  content: btoa(ExtractedToken)
})