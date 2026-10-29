import { readFile } from 'node:fs/promises'

import { Result } from '@sapphire/result'
import { window, workspace } from 'vscode'

interface PackageJson {
  name: string
  version: string
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
}

interface WorkspacePackageJson {
  path: string
  json: PackageJson
}

interface SeedcordLookingResultSuccess {
  found: true
  path: string
}

interface SeedcordLookingResultFailure {
  found: false
}

type SeedcordLookingResult = SeedcordLookingResultSuccess | SeedcordLookingResultFailure

export const packageJsonCache = new Map<string, PackageJson>()

async function loadJson<T extends object = object>(filePath: string): Promise<T | null> {
  const loadingResult = await Result.fromAsync(() => readFile(filePath, 'utf-8'))

  if (loadingResult.isErr()) {
    window.showErrorMessage(`Failed to load JSON from ${filePath}`)
    return null
  }

  const json = await Result.fromAsync<T>((): T => JSON.parse(loadingResult.unwrap()))

  if (json.isErr()) {
    window.showErrorMessage(`Failed to parse JSON from ${filePath}`)
    return null
  }

  return json.unwrap()
}

async function loadPackageJsonsInWorkspace() {
  const files = await workspace.findFiles('**/package.json', '**/node_modules/**')
  const contents: WorkspacePackageJson[] = []

  for (const file of files) {
    let content: PackageJson | undefined | null = packageJsonCache.get(file.fsPath)

    if (!content) content = await loadJson<PackageJson>(file.fsPath)

    if (content) {
      if (!packageJsonCache.has(file.fsPath)) packageJsonCache.set(file.fsPath, content)
      contents.push({ path: file.fsPath, json: content })
    }
  }

  return contents
}

export async function hasSeedcord(): Promise<SeedcordLookingResult> {
  const jsons = await loadPackageJsonsInWorkspace()
  const found = jsons.find((pkg) => hasSeedcordKey(pkg.json))

  if (found) return { found: true, path: found.path }

  return { found: false }
}

const hasSeedcordKey = (json: PackageJson) =>
  'seedcord' in (json.dependencies ?? {}) || 'seedcord' in (json.devDependencies ?? {})
