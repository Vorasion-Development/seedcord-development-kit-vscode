import { defineConfig } from 'reactive-vscode'

interface ExtensionConfig {
  stopBeingAnnoying: boolean
}

export const config = defineConfig<ExtensionConfig>('seedcord')
