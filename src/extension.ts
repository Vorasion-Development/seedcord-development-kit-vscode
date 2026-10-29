import { stripIndents } from 'common-tags'
import { computed, defineExtension, useFileSystemWatcher } from 'reactive-vscode'
import { window } from 'vscode'

import commands from './commands'
import { config } from './config'
import { hasSeedcord, packageJsonCache } from './helpers'
import { seedcordAvailable } from './state'
import { logger } from './utils'

let alreadyFoundSeedcord = false
let hasShownInitialPrompt = false

const checkForSeedcord = async (showWarningMessage: boolean = true) => {
  if (alreadyFoundSeedcord) return

  const seedcordResult = await hasSeedcord()
  seedcordAvailable.value = seedcordResult.found

  if (seedcordResult.found) {
    alreadyFoundSeedcord = true
    logger.info(`Found seedcord at: ${seedcordResult.path}`)

    if (hasShownInitialPrompt) return

    hasShownInitialPrompt = true
    const response = await window.showInformationMessage(
      `Found seedcord at: ${seedcordResult.path}, would you like to start the bot now?`,
      'Yes',
      'No',
    )

    if (!response || response === 'No') {
      window.showInformationMessage(stripIndents`Okay! You can always start the
        bot later from the command palette.`)
      return
    }

    window.showInformationMessage('Starting the bot now...')
  } else {
    if (showWarningMessage && !config.stopBeingAnnoying)
      window.showWarningMessage('Could not find seedcord in the current workspace - did you forget to install it?')

    logger.warn('Could not find seedcord in the current workspace')
  }
}

export = defineExtension(async () => {
  commands.dontNeedSeedcordCommands.forEach((command) => command())
  commands.needsSeedcordCommands.forEach((command) => command())

  await checkForSeedcord()
  const filesToWatch = computed(() => ['**/package.json'])
  const watcher = useFileSystemWatcher(filesToWatch)
  watcher.onDidChange((uri) => {
    logger.debug(`Detected change in file: ${uri.fsPath}`)
    packageJsonCache.delete(uri.fsPath)
    alreadyFoundSeedcord = false
    void checkForSeedcord(false).catch((error: unknown) => {
      logger.error('Failed to check for seedcord after a package.json change', error)
    })
  })
})
