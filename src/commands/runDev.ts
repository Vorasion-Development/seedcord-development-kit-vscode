import { useCommand } from 'reactive-vscode'
import { window } from 'vscode'

import { logger } from '../utils'

export default (seedcordAvailable: boolean) =>
  useCommand('seedcord.runDev', () => {
    if (!seedcordAvailable) {
      logger.error('Cannot run dev because seedcord is not available')
      window.showErrorMessage('Cannot run dev because seedcord is not available')
      return
    }

    // Implementation for running the dev server goes here
  })
