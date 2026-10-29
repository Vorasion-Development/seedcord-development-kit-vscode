import createProjectLogic from './create'
import openLoggerLogic from './openLogger'
import runDevLogic from './runDev'

export type ExtensionCommand<TArgs extends unknown[] = []> = (...args: TArgs) => void

const openLogger: ExtensionCommand = () => openLoggerLogic()
const createProject: ExtensionCommand = () => createProjectLogic()
const runDev: ExtensionCommand = () => runDevLogic()

const dontNeedSeedcordCommands: ExtensionCommand[] = [createProject, openLogger]
const needsSeedcordCommands: ExtensionCommand[] = [runDev]

export default {
  dontNeedSeedcordCommands,
  needsSeedcordCommands,
}
