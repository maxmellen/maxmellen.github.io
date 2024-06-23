import * as fs from 'node:fs'
import * as path from 'node:path'
import * as https from 'node:https'

let args = process.argv.slice(2)
if (args.length < 1) {
  log('使用方法: ripfonts <name> < 入力ファイル')
  process.exit(1)
}

let [destDir] = args
let cssFileName = destDir + '.css'

let styleSheet = await readAll(process.stdin)
let fontFaceRegex = /@font-face\s*{[^}]*url\(([^)]*\.woff2)\)[^}]*}/gm
let matches = styleSheet.matchAll(fontFaceRegex)

fs.mkdirSync(destDir, { recursive: true })

/** @type {Promise<void>[]} */
let downloadPromises = []

for (let [, fontUrl] of matches) {
  let fileName = path.basename(fontUrl)
  let destPath = path.join(destDir, fileName)
  downloadPromises.push(
    downloadToFile(fontUrl, destPath).then(() => {
      styleSheet = styleSheet.replace(
        fontUrl,
        path.join(path.basename(destDir), fileName),
      )
    }),
  )
}

await Promise.all(downloadPromises)
fs.writeFileSync(cssFileName, styleSheet)
log('CSSファイルを書き込みました:', cssFileName)

/**
 * @param  {...any} args
 * @returns {void}
 */
function log(...args) {
  return console.error(...args)
}

/**
 * @param {NodeJS.ReadStream} stream
 * @returns {Promise<string>}
 */
function readAll(stream) {
  return new Promise((resolve) => {
    let data = ''
    stream.on('data', (chunk) => {
      data += chunk
    })
    stream.on('end', () => {
      resolve(data)
    })
  })
}

/**
 * @param {string} url
 * @param {string} dest
 * @returns {Promise<void>}
 */
function downloadToFile(url, dest) {
  return new Promise((resolve) => {
    let file = fs.createWriteStream(dest)
    log('ダウンロード中:', path.basename(url))
    https.get(url, (res) => {
      res.pipe(file)
      file.on('finish', () => {
        log('ダウンロード完了:', path.basename(url))
        file.close(() => resolve())
      })
    })
  })
}
