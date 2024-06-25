import { readAll, writeAll } from '@std/io'
import { ensureDir } from '@std/fs'
import { basename, join } from '@std/path'

if (Deno.args.length < 1) {
  log('使用方法: ripfonts <name> < 入力ファイル')
  Deno.exit(1)
}

let decoder = new TextDecoder()
let [destDir] = Deno.args
let cssFileName = destDir + '.css'

let styleSheet = decoder.decode(await readAll(Deno.stdin))
let fontFaceRegex =
  /@font-face\s*{[^}]*font-family:\s*["']([^"']+)["'][^}]*src:\s*url\(["']?([^)]+?)["']?\)/gm
let matches = styleSheet.matchAll(fontFaceRegex)

await ensureDir(destDir)

let downloadPromises: Promise<void>[] = []

for (let [, fontFamily, fontUrl] of matches) {
  let fileName = basename(fontUrl)
  let destPath = join(destDir, fileName)

  downloadPromises.push(
    downloadToFile(fontUrl, destPath).then(() => {
      styleSheet = styleSheet.replace(
        `url(${fontUrl})`,
        `local('${fontFamily}'), url('${join(basename(destDir), fileName)}')`,
      )
    }),
  )
}

await Promise.all(downloadPromises)
await Deno.writeTextFile(cssFileName, styleSheet)
log('CSSファイルを書き込みました:', cssFileName)

function log(...args: unknown[]): void {
  console.error(...args)
}

async function downloadToFile(
  remoteUrl: string,
  localPath: string,
): Promise<void> {
  using file = await Deno.open(localPath, { create: true, write: true })
  log('ダウンロード中:', basename(remoteUrl))
  let response = await retryFetch(5, remoteUrl)
  for await (let chunk of response.body!) {
    await writeAll(file, chunk)
  }
  log('ダウンロード完了:', basename(remoteUrl))
}

// HACK: Deno's underlying Rust lib freaks out over 100 concurrent requests
async function retryFetch(
  numberOfTries: number,
  ...fetchArgs: Parameters<typeof fetch>
) {
  while (true) {
    try {
      return await fetch(...fetchArgs)
    } catch (e) {
      if (--numberOfTries < 0) throw e
    }
  }
}
