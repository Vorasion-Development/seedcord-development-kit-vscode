import createProjectLogic from './create'
import openLoggerLogic from './openLogger'
import runDevLogic from './runDev'

export type ExtensionCommand<TArgs extends unknown[] = []> = (...args: TArgs) => void
export type ExtensionCommandWithSeedcord = ExtensionCommand<[seedcordAvailable: boolean, ...args: unknown[]]>

const openLogger: ExtensionCommand = () => openLoggerLogic()
const createProject: ExtensionCommand = () => createProjectLogic()

const runDev: ExtensionCommandWithSeedcord = (seedcordAvailable: boolean) => runDevLogic(seedcordAvailable)

const dontNeedSeedcordCommands: ExtensionCommand[] = [createProject, openLogger]
const needsSeedcordCommands: ExtensionCommandWithSeedcord[] = [runDev]

export default {
  dontNeedSeedcordCommands,
  needsSeedcordCommands,
}
