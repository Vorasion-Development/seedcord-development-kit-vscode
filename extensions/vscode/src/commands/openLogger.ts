import { useCommand } from 'reactive-vscode'

import { logger } from '../utils'

export default () =>
  useCommand('seedcord.openLogger', () => {
    logger.show()
  })
