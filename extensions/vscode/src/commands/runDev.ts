import { useCommand } from 'reactive-vscode'
import { window } from 'vscode'

import { seedcordAvailable } from '../state'
import { logger } from '../utils'

export default () =>
  useCommand('seedcord.runDev', () => {
    if (!seedcordAvailable.value) {
      logger.error('Cannot run dev because seedcord is not available')
      window.showErrorMessage('Cannot run dev because seedcord is not available')
      return
    }

    // Implementation for running the dev server goes here
  })
