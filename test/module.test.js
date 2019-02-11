jest.setTimeout(60000)
process.env.PORT = process.env.PORT || 5060

const path = require('path')
const fs = require('fs-extra')
const { Nuxt, Builder, Generator } = require('nuxt-edge')

describe('generator', () => {
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
  })
})

describe('universal', () => {
  const request = require('request-promise-native')

  const url = path => `http://localhost:${process.env.PORT}${path}`
  const get = path => request(url(path))
  let nuxt

  const closeNuxt = async () => {
    await nuxt.close()
  }
  afterEach(async () => {
    const filePath = path.resolve(nuxt.options.srcDir, path.join('static', '/feed.xml'))
    if (fs.existsSync(filePath)) {
      fs.removeSync(filePath)
    }

    await closeNuxt()
  })

  test('simple rss', async () => {
    nuxt = await setupNuxt(require('./fixture/configs/simple_rss'))
    const html = await get('/feed.xml')
    expect(html).toMatchSnapshot()
  })
  test('simple atom', async () => {
    nuxt = await setupNuxt(require('./fixture/configs/simple_atom'))
    const html = await get('/feed.xml')
    expect(html).toMatchSnapshot()
  })
  test('simple json', async () => {
    nuxt = await setupNuxt(require('./fixture/configs/simple_json'))
    const html = await get('/feed.xml')
    expect(html).toMatchSnapshot()
  })

  test('non-latin rss', async () => {
    nuxt = await setupNuxt(require('./fixture/configs/non_latin_rss'))
    const html = await get('/feed.xml')
    expect(html).toMatchSnapshot()
  })

  test('no type set', async () => {
    nuxt = await setupNuxt(require('./fixture/configs/no_type'))
    expect(await get('/feed.xml')).toMatchSnapshot()
  })

  test('object rss', async () => {
    nuxt = await setupNuxt(require('./fixture/configs/object_rss'))
    const html = await get('/feed.xml')
    expect(html).toMatchSnapshot()
  })

  test('factory rss', async () => {
    nuxt = await setupNuxt(require('./fixture/configs/factory_rss'))
    const html = await get('/feed.xml')
    expect(html).toMatchSnapshot()
  })

  test('function rss', async () => {
    nuxt = await setupNuxt(require('./fixture/configs/function_rss'))
    const html = await get('/feed.xml')
    expect(html).toMatchSnapshot()
  })

  test('multi rss', async () => {
    nuxt = await setupNuxt(require('./fixture/configs/multi_rss'))

    await ['/feed.xml', '/feed1.xml'].forEach(async (path, i) => {
      const html = await get(path)
      expect(html).toMatchSnapshot()
    })
  })
})

const setupNuxt = async (config) => {
  const nuxt = new Nuxt(config)
  await new Builder(nuxt).build()
  await nuxt.listen(process.env.PORT)

  return nuxt
}
