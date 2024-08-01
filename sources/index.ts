import * as Commander from 'commander'
import { PostCode } from './globalping.js'

const Program = new Commander.Command()
Program.option('--token <token>', 'GitHub token')
Program.option('--repo <repo>', 'Github repo path')
Program.option('--config <config>', 'config file name')
Program.parse(process.argv)
// eslint-disable-next-line @typescript-eslint/naming-convention
const ProgramOptions = Program.opts() as { token: string, repo: string, config: string }