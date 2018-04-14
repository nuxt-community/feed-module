const { Nuxt, Builder, Generator } = require('nuxt')
const path = require('path')
const fs = require('fs-extra')

const timeout = 60 * 1000

describe('generator', async () => {
  test('simple rss generator', async () => {
    const nuxt = new Nuxt(require('./fixture/configs/simple_rss'))
    const generator = new Generator(nuxt, new Builder(nuxt))
    await generator.initiate()
    const routes = await generator.initRoutes()
    expect(routes.includes('/feed.xml')).toBe(true)
    const filePath = path.resolve(nuxt.options.srcDir, path.join('static', '/feed.xml'))
    expect(fs.readFileSync(filePath, { encoding: 'utf8' }))
      .toBe('<?xml version="1.0" encoding="utf-8"?>\n' +
        '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n' +
        '    <channel>\n' +
        '        <title>Feed Title</title>\n' +
        '        <link>http://example.com/</link>\n' +
        '        <description>This is my personal feed!</description>\n' +
        '        <lastBuildDate>Thu, 13 Jul 2000 22:00:00 GMT</lastBuildDate>\n' +
        '        <docs>http://blogs.law.harvard.edu/tech/rss</docs>\n' +
        '        <generator>awesome</generator>\n' +
        '        <image>\n' +
        '            <title>Feed Title</title>\n' +
        '            <url>http://example.com/image.png</url>\n' +
        '            <link>http://example.com/</link>\n' +
        '        </image>\n' +
        '        <copyright>All rights reserved 2013, John Doe</copyright>\n' +
        '        <atom:link href="https://example.com/atom" rel="self" type="application/rss+xml"/>\n' +
        '    </channel>\n' +
        '</rss>')
    fs.removeSync(filePath)
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
  afterEach(closeNuxt)

  test('simple rss', async () => {
    nuxt = await setupNuxt(require('./fixture/configs/simple_rss'))
    let html = await get('/feed.xml')
    expect(html).toBe('<?xml version="1.0" encoding="utf-8"?>\n' +
      '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n' +
      '    <channel>\n' +
      '        <title>Feed Title</title>\n' +
      '        <link>http://example.com/</link>\n' +
      '        <description>This is my personal feed!</description>\n' +
      '        <lastBuildDate>Thu, 13 Jul 2000 22:00:00 GMT</lastBuildDate>\n' +
      '        <docs>http://blogs.law.harvard.edu/tech/rss</docs>\n' +
      '        <generator>awesome</generator>\n' +
      '        <image>\n' +
      '            <title>Feed Title</title>\n' +
      '            <url>http://example.com/image.png</url>\n' +
      '            <link>http://example.com/</link>\n' +
      '        </image>\n' +
      '        <copyright>All rights reserved 2013, John Doe</copyright>\n' +
      '        <atom:link href="https://example.com/atom" rel="self" type="application/rss+xml"/>\n' +
      '    </channel>\n' +
      '</rss>')
  }, timeout)
  test('simple atom', async () => {
    nuxt = await setupNuxt(require('./fixture/configs/simple_atom'))
    let html = await get('/feed.xml')
    expect(html).toBe('<?xml version="1.0" encoding="utf-8"?>\n' +
      '<feed xmlns="http://www.w3.org/2005/Atom">\n' +
      '    <id>http://example.com/</id>\n' +
      '    <title>Feed Title</title>\n' +
      '    <updated>2000-07-13T22:00:00Z</updated>\n' +
      '    <generator>awesome</generator>\n' +
      '    <author>\n' +
      '        <name>John Doe</name>\n' +
      '        <email>johndoe@example.com</email>\n' +
      '        <uri>https://example.com/johndoe</uri>\n' +
      '    </author>\n' +
      '    <link rel="alternate" href="http://example.com/"/>\n' +
      '    <link rel="self" href="https://example.com/atom"/>\n' +
      '    <subtitle>This is my personal feed!</subtitle>\n' +
      '    <logo>http://example.com/image.png</logo>\n' +
      '    <icon>http://example.com/favicon.ico</icon>\n' +
      '    <rights>All rights reserved 2013, John Doe</rights>\n' +
      '</feed>')
  }, timeout)
  test('simple json', async () => {
    nuxt = await setupNuxt(require('./fixture/configs/simple_json'))
    let html = await get('/feed.xml')
    expect(html).toBe('{\n' +
      '    "version": "https://jsonfeed.org/version/1",\n' +
      '    "title": "Feed Title",\n' +
      '    "home_page_url": "http://example.com/",\n' +
      '    "feed_url": "https://example.com/json",\n' +
      '    "description": "This is my personal feed!",\n' +
      '    "icon": "http://example.com/image.png",\n' +
      '    "author": {\n' +
      '        "name": "John Doe",\n' +
      '        "url": "https://example.com/johndoe"\n' +
      '    },\n' +
      '    "items": []\n' +
      '}')
  }, timeout)

  test('no type set', async () => {
    nuxt = await setupNuxt(require('./fixture/configs/no_type'))
    expect(await get('/feed.xml')).toBe('')
  }, timeout)

  test('multi rss', async () => {
    nuxt = await setupNuxt(require('./fixture/configs/multi_rss'))

    await ['/feed.xml', '/feed1.xml'].forEach(async (path, i) => {
      let html = await get(path)
      expect(html).toBe('<?xml version="1.0" encoding="utf-8"?>\n' +
        '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n' +
        '    <channel>\n' +
        '        <title>Feed ' + i + '</title>\n' +
        '        <link>http://example.com/</link>\n' +
        '        <description>This is my personal feed!</description>\n' +
        '        <lastBuildDate>Thu, 13 Jul 2000 22:00:00 GMT</lastBuildDate>\n' +
        '        <docs>http://blogs.law.harvard.edu/tech/rss</docs>\n' +
        '        <generator>awesome</generator>\n' +
        '        <image>\n' +
        '            <title>Feed Title</title>\n' +
        '            <url>http://example.com/image.png</url>\n' +
        '            <link>http://example.com/</link>\n' +
        '        </image>\n' +
        '        <copyright>All rights reserved 2013, John Doe</copyright>\n' +
        '        <atom:link href="https://example.com/atom" rel="self" type="application/rss+xml"/>\n' +
        '    </channel>\n' +
        '</rss>')
    })
  }, timeout)
})

const setupNuxt = async config => {
  const nuxt = new Nuxt(config)
  await new Builder(nuxt).build()
  await nuxt.listen(3000)

  return nuxt
}
