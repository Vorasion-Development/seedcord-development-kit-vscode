import { resolveCommand } from 'package-manager-detector/commands'
import { workspace } from 'vscode'

export async function getConfiguredPackageManager(cwd: string) {
  const configuredPM = workspace
    .getConfiguration('npm')
    .get<'auto' | 'npm' | 'yarn' | 'pnpm' | 'bun'>('packageManager', 'auto')
  if (configuredPM === 'auto') {
    const { detect } = await import('package-manager-detector/detect')
    const detected = await detect({
      cwd,
    })

    if (!detected) {
      throw new Error('Could not detect the package manager')
    }

    return detected.agent
  } else {
    return configuredPM
  }
}

export async function getDevCommand() {
  const path = workspace.workspaceFolders?.[0].uri.fsPath
  if (!path) {
    throw new Error("Couldn't resolve workspace folder path")
  }
  const pm = await getConfiguredPackageManager(path)

  const command = resolveCommand(pm, 'execute-local', ['seedcord', 'dev'])

  if (!command) {
    throw new Error(`Cannot resolve a command for package manager: ${pm}`)
  }

  return command
}

export async function getBuildCommand() {
  const path = workspace.workspaceFolders?.[0].uri.fsPath
  if (!path) {
    throw new Error("Couldn't resolve workspace folder path")
  }
  const pm = await getConfiguredPackageManager(path)

  const command = resolveCommand(pm, 'execute-local', ['seedcord', 'build'])

  if (!command) {
    throw new Error(`Cannot resolve a command for package manager: ${pm}`)
  }

  return command
}

export async function getCodegenCommand() {
  const path = workspace.workspaceFolders?.[0].uri.fsPath
  if (!path) {
    throw new Error("Couldn't resolve workspace folder path")
  }
  const pm = await getConfiguredPackageManager(path)

  const command = resolveCommand(pm, 'execute-local', ['seedcord', 'codegen'])

  if (!command) {
    throw new Error(`Cannot resolve a command for package manager: ${pm}`)
  }

  return command
}
