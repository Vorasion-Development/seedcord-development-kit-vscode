import type { Agent } from 'package-manager-detector'
import { resolveCommand } from 'package-manager-detector/commands'
import { workspace } from 'vscode'

function getConfiguredPackageManager() {
  return workspace.getConfiguration('npm').get<'auto' | 'npm' | 'yarn' | 'pnpm' | 'bun'>('packageManager', 'auto')
}

export async function getDevCommand() {
  const configured = getConfiguredPackageManager()

  const workspaceFolder = workspace.workspaceFolders?.[0]

  if (!workspaceFolder) {
    throw new Error('No workspace folder is open')
  }

  let pm: Agent

  if (configured === 'auto') {
    const { detect } = await import('package-manager-detector/detect')
    const detected = await detect({
      cwd: workspaceFolder.uri.fsPath,
    })

    if (!detected) {
      throw new Error('Could not detect the package manager')
    }

    pm = detected.agent
  } else {
    pm = configured
  }

  const command = resolveCommand(pm, 'execute-local', ['seedcord', 'dev'])

  if (!command) {
    throw new Error(`Cannot resolve a command for package manager: ${pm}`)
  }

  return command
}

export async function getBuildCommand() {
  const configured = getConfiguredPackageManager()

  const workspaceFolder = workspace.workspaceFolders?.[0]

  if (!workspaceFolder) {
    throw new Error('No workspace folder is open')
  }

  let pm: Agent

  if (configured === 'auto') {
    const { detect } = await import('package-manager-detector/detect')
    const detected = await detect({
      cwd: workspaceFolder.uri.fsPath,
    })

    if (!detected) {
      throw new Error('Could not detect the package manager')
    }

    pm = detected.agent
  } else {
    pm = configured
  }

  const command = resolveCommand(pm, 'execute-local', ['seedcord', 'build'])

  if (!command) {
    throw new Error(`Cannot resolve a command for package manager: ${pm}`)
  }

  return command
}

export async function getCodegenCommand() {
  const configured = getConfiguredPackageManager()

  const workspaceFolder = workspace.workspaceFolders?.[0]

  if (!workspaceFolder) {
    throw new Error('No workspace folder is open')
  }

  let pm: Agent

  if (configured === 'auto') {
    const { detect } = await import('package-manager-detector/detect')
    const detected = await detect({
      cwd: workspaceFolder.uri.fsPath,
    })

    if (!detected) {
      throw new Error('Could not detect the package manager')
    }

    pm = detected.agent
  } else {
    pm = configured
  }

  const command = resolveCommand(pm, 'execute-local', ['seedcord', 'codegen'])

  if (!command) {
    throw new Error(`Cannot resolve a command for package manager: ${pm}`)
  }

  return command
}

type CommandsManagerSubcommands = 'deploy' | 'list' | 'clean' | 'purge'

export async function getCommandsManagerCommand(subcommand: CommandsManagerSubcommands) {
  const configured = getConfiguredPackageManager()

  const workspaceFolder = workspace.workspaceFolders?.[0]

  if (!workspaceFolder) {
    throw new Error('No workspace folder is open')
  }

  let pm: Agent

  if (configured === 'auto') {
    const { detect } = await import('package-manager-detector/detect')
    const detected = await detect({
      cwd: workspaceFolder.uri.fsPath,
    })

    if (!detected) {
      throw new Error('Could not detect the package manager')
    }

    pm = detected.agent
  } else {
    pm = configured
  }

  const command = resolveCommand(pm, 'execute-local', ['commands', subcommand])

  if (!command) {
    throw new Error(`Cannot resolve a command for package manager: ${pm}`)
  }

  return command
}
