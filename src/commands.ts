import { useCommand, useTerminal } from 'reactive-vscode'

import { getBuildCommand, getCodegenCommand, getDevCommand } from './pm'
import { logger } from './utils'

type ExtensionCommand = () => void

const openLogger: ExtensionCommand = () =>
  useCommand('seedcord.openLogger', () => {
    logger.show()
  })

const buildBot: ExtensionCommand = () =>
  useCommand('seedcord.buildBot', async () => {
    const commandToRun = await getBuildCommand()
    const term = useTerminal('seedcord pkg')
    term.show()
    term.sendText(`${commandToRun.command} ${commandToRun.args.join(' ')}`)
  })

const startDevSession: ExtensionCommand = () =>
  useCommand('seedcord.startDevSession', async () => {
    const commandToRun = await getDevCommand()
    const term = useTerminal('seedcord pkg')
    term.show()
    term.sendText(`${commandToRun.command} ${commandToRun.args.join(' ')}`)
  })

const generateTypes: ExtensionCommand = () =>
  useCommand('seedcord.generateTypes', async () => {
    const commandToRun = await getCodegenCommand()
    const term = useTerminal('seedcord pkg')
    term.show()
    term.sendText(`${commandToRun.command} ${commandToRun.args.join(' ')}`)
  })

const dontNeedSeedcordCommands: ExtensionCommand[] = [openLogger]
const needsSeedcordCommands: ExtensionCommand[] = [buildBot, startDevSession, generateTypes]

export default {
  dontNeedSeedcordCommands,
  needsSeedcordCommands,
}
