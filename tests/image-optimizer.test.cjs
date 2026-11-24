const assert = require('node:assert/strict')
const { test } = require('node:test')
const { createServer } = require('node:http')
const { spawn } = require('node:child_process')
const { mkdtemp, mkdir, writeFile, symlink, rm } = require('node:fs/promises')
const { tmpdir } = require('node:os')
const path = require('node:path')
const config = require('../next.config')

const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jB1kAAAAASUVORK5CYII=', 'base64')

test('disabled optimizer rejects remote fetches while direct images still work', { timeout: 90000 }, async (t) => {
  const dir = await mkdtemp(path.join(tmpdir(), 'devils-image-test-'))
  let upstreamRequests = 0
  const upstream = createServer((req, res) => {
    upstreamRequests++
    res.writeHead(200, { 'Content-Type': 'image/png' })
    res.end(png)
  })
  await new Promise(resolve => upstream.listen(0, '127.0.0.1', resolve))
  const upstreamUrl = `http://127.0.0.1:${upstream.address().port}/image.png`
  t.after(async () => {
    await new Promise(resolve => upstream.close(resolve))
    await rm(dir, { recursive: true, force: true })
  })

  // Exercise the real installed Next.js HTTP handler using the application's
  // exact image config, without requiring the unrelated commerce database.
  await mkdir(path.join(dir, 'pages'))
  await mkdir(path.join(dir, 'public'))
  await writeFile(path.join(dir, 'public', 'product.png'), png)
  await writeFile(path.join(dir, 'pages', 'index.js'), `export default function Page() { return <img src="/product.png" alt="Product" /> }`)
  await writeFile(path.join(dir, 'next.config.js'), `module.exports = ${JSON.stringify({ images: config.images })}`)
  await symlink(path.resolve(__dirname, '..', 'node_modules'), path.join(dir, 'node_modules'), 'dir')

  const server = spawn(process.execPath, [require.resolve('next/dist/bin/next'), 'dev', dir, '--hostname', '127.0.0.1', '--port', '0'], {
    cwd: dir, env: { ...process.env, NODE_ENV: 'development', NEXT_TELEMETRY_DISABLED: '1' },
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  t.after(async () => {
    if (server.exitCode === null) {
      const exited = new Promise(resolve => server.once('exit', resolve))
      server.kill('SIGTERM')
      await exited
    }
  })
  let output = ''
  const origin = await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`Next.js startup timed out: ${output}`)), 30000)
    server.once('exit', code => { clearTimeout(timer); reject(new Error(`Next.js exited ${code}: ${output}`)) })
    const collect = chunk => {
      output += chunk.toString()
      const match = output.match(/http:\/\/127\.0\.0\.1:(\d+)/)
      if (match && /Ready in/.test(output)) { clearTimeout(timer); resolve(match[0]) }
    }
    server.stdout.on('data', collect)
    server.stderr.on('data', collect)
  })

  for (const url of [upstreamUrl, 'https://untrusted.example/image.png', '/product.png']) {
    const response = await fetch(`${origin}/_next/image?${new URLSearchParams({ url, w: '64', q: '75' })}`)
    assert.equal(response.status, 404, `optimizer must reject ${url}`)
  }
  assert.equal(upstreamRequests, 0, 'rejected requests must not fetch the remote image')
  const image = await fetch(`${origin}/product.png`)
  assert.equal(image.status, 200)
  assert.deepEqual(Buffer.from(await image.arrayBuffer()), png)
  const page = await fetch(origin)
  assert.equal(page.status, 200)
  assert.match(await page.text(), /src="\/product.png"/)
})
