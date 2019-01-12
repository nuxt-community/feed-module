const { Nuxt, Builder, Generator } = require('nuxt')
const path = require('path')
const fs = require('fs-extra')
const oldFs = require('fs')
const timeout = 60 * 1000

describe('generator', async () => {
  test('simple rss generator', async () => {
    const nuxt = new Nuxt(require('./fixture/configs/simple_rss'))
    const filePath = path.resolve(nuxt.options.srcDir, path.join('static', '/feed.xml'))
    fs.removeSync(filePath)

    const generator = new Generator(nuxt, new Builder(nuxt))
    await generator.initiate()
    await generator.initRoutes()

    expect(fs.readFileSync(filePath, { encoding: 'utf8' })).toMatchSnapshot()
    const { errors } = await generator.generate()
    fs.removeSync(filePath)
    expect(Array.isArray(errors)).toBe(true)
    expect(errors.length).toBe(0)
  }, timeout)
})

describe('universal', () => {
  const request = require('request-promise-native')

  const url = path => `http://localhost:3000${path}`
  const get = path => request(url(path))
  let nuxt

  const closeNuxt = async () => {
    await nuxt.close()
  }
  afterEach(async () => {
    const filePath = path.resolve(nuxt.options.srcDir, path.join('static', '/feed.xml'))
    if (oldFs.existsSync(filePath)) {
      fs.removeSync(filePath)
    }

    await closeNuxt()
  })

  test('simple rss', async () => {
    nuxt = await setupNuxt(require('./fixture/configs/simple_rss'))
    let html = await get('/feed.xml')
    expect(html).toMatchSnapshot()
  }, timeout)
  test('simple atom', async () => {
    nuxt = await setupNuxt(require('./fixture/configs/simple_atom'))
    let html = await get('/feed.xml')
    expect(html).toMatchSnapshot()
  }, timeout)
  test('simple json', async () => {
    nuxt = await setupNuxt(require('./fixture/configs/simple_json'))
    let html = await get('/feed.xml')
    expect(html).toMatchSnapshot()
  }, timeout)

  test('non-latin rss', async () => {
    nuxt = await setupNuxt(require('./fixture/configs/non_latin_rss'))
    let html = await get('/feed.xml')
    expect(html).toMatchSnapshot()
  }, timeout)

  test('no type set', async () => {
    nuxt = await setupNuxt(require('./fixture/configs/no_type'))
    expect(await get('/feed.xml')).toMatchSnapshot()
  }, timeout)

  test('object rss', async () => {
    nuxt = await setupNuxt(require('./fixture/configs/object_rss'))
    let html = await get('/feed.xml')
    expect(html).toMatchSnapshot()
  }, timeout)

  test('factory rss', async () => {
    nuxt = await setupNuxt(require('./fixture/configs/factory_rss'))
    let html = await get('/feed.xml')
    expect(html).toMatchSnapshot()
  }, timeout)

  test('function rss', async () => {
    nuxt = await setupNuxt(require('./fixture/configs/function_rss'))
    let html = await get('/feed.xml')
    expect(html).toMatchSnapshot()
  }, timeout)

  test('multi rss', async () => {
    nuxt = await setupNuxt(require('./fixture/configs/multi_rss'))

    await ['/feed.xml', '/feed1.xml'].forEach(async (path, i) => {
      const html = await get(path)
      expect(html).toMatchSnapshot()
    })
  }, timeout)
})

const setupNuxt = async config => {
  const nuxt = new Nuxt(config)
  await new Builder(nuxt).build()
  await nuxt.listen(3000)

  return nuxt
}
