import { resolve } from 'node:path'

import { Colors } from 'discord.js'
import { useCommand, useEvent, useTerminal } from 'reactive-vscode'
import validate from 'validate-npm-package-name'
import { commands, Uri, window } from 'vscode'

type ProjectRunner = 'server' | 'edge'
type ProjectType = 'HTTP' | 'Gateway'

interface SeedcordIntent {
  name: string
  value: string
  privileged?: boolean
}

const seedcordIntents: SeedcordIntent[] = [
  { name: 'Messages in servers', value: 'guild-messages' },
  { name: "The messages' contents", value: 'message-text', privileged: true },
  { name: 'Direct messages', value: 'direct-messages' },
  { name: 'Reactions', value: 'reactions' },
  { name: 'Member joins and leaves', value: 'members', privileged: true },
  { name: 'Member presence status', value: 'presence', privileged: true },
  { name: 'Voice channel activity', value: 'voice' },
  { name: 'Bans and timeouts', value: 'moderation' },
  { name: 'Scheduled events', value: 'scheduled-events' },
  { name: 'AutoMod', value: 'automod' },
  { name: 'Polls', value: 'polls' },
]

const askYesNo = async (prompt: string) => {
  const result = await window.showQuickPick(['Yes', 'No'], {
    placeHolder: prompt,
  })
  return result === 'Yes'
}

const onDidCloseTerminal = useEvent(window.onDidCloseTerminal)

export default () =>
  useCommand('seedcord.createProject', async () => {
    const name = await window.showInputBox({
      placeHolder: 'my-bot',
      prompt: 'Enter folder name',
      validateInput(value) {
        if (!value || value.trim() === '') return 'Folder name cannot be empty'
        if (value.includes(' ')) return 'Folder name cannot contain spaces'
        if (!validate(value).validForNewPackages)
          return 'Invalid folder name, your folder name must be a valid npm package name'

        return null
      },
    })

    if (!name) return window.showWarningMessage('Folder name is required, not creating the project.')

    const rootFolderSelections = await window.showOpenDialog({
      canSelectFiles: false,
      canSelectFolders: true,
      canSelectMany: false,
      title: 'Select the root folder for your project',
    })

    if (!rootFolderSelections || rootFolderSelections.length === 0)
      return window.showWarningMessage('Root folder is required, not creating the project.')
    const rootFolder = rootFolderSelections[0].fsPath

    const httpOrGateway: ProjectType | undefined = (await window.showQuickPick(['HTTP', 'Gateway'], {
      placeHolder: 'Select the type of project',
      prompt: 'Select the type of project',
    })) as ProjectType | undefined

    if (!httpOrGateway) return window.showWarningMessage('Project type is required, not creating the project.')

    let runnerOrIntents: ProjectRunner | { label: string; value: string }[] | undefined = undefined

    if (httpOrGateway === 'HTTP')
      runnerOrIntents =
        (await window.showQuickPick(['Node', 'Cloudflare Workers'], {
          placeHolder: 'Where does your bot run?',
        })) === 'Node'
          ? 'server'
          : 'edge'
    else if (httpOrGateway === 'Gateway')
      runnerOrIntents = await window.showQuickPick(
        seedcordIntents.map(({ name, value, privileged }) => ({
          label: privileged ? `${name} (privileged)` : name,
          value,
        })),
        {
          canPickMany: true,
          placeHolder: 'Select the intents for your bot',
        },
      )

    if (!runnerOrIntents)
      return window.showWarningMessage('Runner or intents selection is required, not creating the project.')

    const token = (
      await window.showInputBox({
        password: true,
        placeHolder: 'Enter your bot token or just press enter to move forward...',
      })
    )?.trim()

    if (!token || token.length === 0)
      window.showWarningMessage(
        "No bot token was provided, you'll need to provide it later in the .env to run your bot.",
        'OK',
      )

    const testingServerIds =
      (
        await window.showInputBox({
          placeHolder:
            'Enter the guild IDs where the commands should be registered or press enter to register globally...',
        })
      )
        ?.trim()
        ?.split(',')
        .map((id) => id.trim()) ?? []

    if (testingServerIds.length === 0)
      window.showWarningMessage('No testing server IDs were provided, commands will be registered globally.', 'OK')

    const extractedColors: { label: string; value: string }[] = Object.entries(Colors)
      .filter(([key]) => Number.isNaN(Number(key)))
      .map(([name]) => ({
        label: name,
        value: name,
      }))
    extractedColors.push({
      label: 'Custom',
      value: 'custom',
    })
    const botColor = await window.showQuickPick(extractedColors, {
      placeHolder: 'Select a color for the components sent by your bot, or select custom to input a hex code!',
    })

    if (!botColor) return window.showWarningMessage('No bot color was selected. Not continuing.', 'OK')

    if (botColor.value === 'custom')
      botColor.value =
        (
          await window.showInputBox({
            placeHolder: 'Enter a hex code for the bot color (e.g., #ff0000)...',
            validateInput(value) {
              if (!/^#([0-9A-Fa-f]{6})$/.test(value)) {
                return 'Please enter a valid hex code (e.g., #ff0000)'
              }

              return null
            },
          })
        )?.trim() ?? 'undefined'

    if (botColor.value === 'undefined')
      return window.showWarningMessage('No valid bot color was provided. Not continuing.', 'OK')

    const packageManager = await window.showQuickPick(['npm', 'yarn', 'pnpm', 'bun'], {
      placeHolder: 'Select a package manager for your project',
    })

    if (!packageManager) return window.showWarningMessage('No package manager was selected. Not continuing.', 'OK')

    const initializeGit = await askYesNo('Do you want to initialize a git repository?')
    const openWorkspaceImmediately = await askYesNo('Do you want to open the workspace immediately after creation?')

    window.showInformationMessage('Creating project...')

    const args = [
      'create',
      'seedcord@latest',
      name,
      '--transport',
      httpOrGateway.toLowerCase(),
      ...(Array.isArray(runnerOrIntents)
        ? ['--capabilities', runnerOrIntents.map(({ value }) => value).join(',')]
        : [runnerOrIntents.toLowerCase()]),
      ...(token ? ['--token', token] : ['--no-token']),
      `--testing-guilds=${testingServerIds.join(',')}`,
      '--color',
      botColor.value.includes('#') ? `'${botColor.value}'` : botColor.label, // Label because the scaffolder expects a named color, not a numerical value.
      '--install',
      ...(initializeGit ? ['--git'] : ['--no-git']),
    ]

    const terminalName = 'Seedcord Project Creation'
    const terminal = useTerminal({ cwd: rootFolder, name: terminalName })
    terminal.show(true)
    terminal.sendText(`${packageManager} ${args.join(' ')} && exit`)

    onDidCloseTerminal(async (term) => {
      if (term !== terminal.terminal) return

      if (term.exitStatus?.code === 0) {
        window.showInformationMessage('Project created successfully.')
        if (openWorkspaceImmediately)
          await commands.executeCommand('vscode.openFolder', Uri.file(resolve(rootFolder, name)))
      } else window.showErrorMessage(`Project creation failed with code ${term.exitStatus?.code ?? 'unknown'}`)
    })
  })
