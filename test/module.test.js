const { Nuxt, Builder, Generator } = require('nuxt')
const path = require('path')
const fs = require('fs-extra')
const oldFs = require('fs')
const timeout = 60 * 1000

const toATOM = d => {
  const pad = n => n < 10 ? `0${n}` : n
  const padMs = n => {
    if (n >= 100) {
      return n
    }
    if (n > 10) {
      return `0${n}`
    }
    return `00${n}`
  }

  return [
    d.getUTCFullYear(),
    '-',
    pad(d.getUTCMonth() + 1),
    '-', pad(d.getUTCDate()),
    'T',
    pad(d.getUTCHours()),
    ':',
    pad(d.getUTCMinutes()),
    ':',
    pad(d.getUTCSeconds()),
    '.',
    padMs(d.getUTCMilliseconds()),
    'Z'].join('')
}
const date = {
  rss: (new Date(2000, 6, 14)).toUTCString(),
  atom: toATOM(new Date(2000, 6, 14))
}

describe('generator', async () => {
  test('simple rss generator', async () => {
    const nuxt = new Nuxt(require('./fixture/configs/simple_rss'))
    const filePath = path.resolve(nuxt.options.srcDir, path.join('static', '/feed.xml'))
    fs.removeSync(filePath)

    const generator = new Generator(nuxt, new Builder(nuxt))
    await generator.initiate()
    await generator.initRoutes()

    expect(fs.readFileSync(filePath, { encoding: 'utf8' })).toBe(`<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
        <title>Feed Title</title>
        <link>http://example.com/</link>
        <description>This is my personal feed!</description>
        <lastBuildDate>${date.rss}</lastBuildDate>
        <docs>http://blogs.law.harvard.edu/tech/rss</docs>
        <generator>awesome</generator>
        <image>
            <title>Feed Title</title>
            <url>http://example.com/image.png</url>
            <link>http://example.com/</link>
        </image>
        <copyright>All rights reserved 2013, John Doe</copyright>
        <atom:link href="https://example.com/atom" rel="self" type="application/rss+xml"/>
    </channel>
</rss>`)
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
    expect(html).toBe(`<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
        <title>Feed Title</title>
        <link>http://example.com/</link>
        <description>This is my personal feed!</description>
        <lastBuildDate>${date.rss}</lastBuildDate>
        <docs>http://blogs.law.harvard.edu/tech/rss</docs>
        <generator>awesome</generator>
        <image>
            <title>Feed Title</title>
            <url>http://example.com/image.png</url>
            <link>http://example.com/</link>
        </image>
        <copyright>All rights reserved 2013, John Doe</copyright>
        <atom:link href="https://example.com/atom" rel="self" type="application/rss+xml"/>
    </channel>
</rss>`)
  }, timeout)
  test('simple atom', async () => {
    nuxt = await setupNuxt(require('./fixture/configs/simple_atom'))
    let html = await get('/feed.xml')
    expect(html).toBe(`<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
    <id>http://example.com/</id>
    <title>Feed Title</title>
    <updated>${date.atom}</updated>
    <generator>awesome</generator>
    <author>
        <name>John Doe</name>
        <email>johndoe@example.com</email>
        <uri>https://example.com/johndoe</uri>
    </author>
    <link rel="alternate" href="http://example.com/"/>
    <link rel="self" href="https://example.com/atom"/>
    <subtitle>This is my personal feed!</subtitle>
    <logo>http://example.com/image.png</logo>
    <icon>http://example.com/favicon.ico</icon>
    <rights>All rights reserved 2013, John Doe</rights>
</feed>`)
  }, timeout)
  test('simple json', async () => {
    nuxt = await setupNuxt(require('./fixture/configs/simple_json'))
    let html = await get('/feed.xml')
    expect(html).toBe(`{
    "version": "https://jsonfeed.org/version/1",
    "title": "Feed Title",
    "home_page_url": "http://example.com/",
    "feed_url": "https://example.com/json",
    "description": "This is my personal feed!",
    "icon": "http://example.com/image.png",
    "author": {
        "name": "John Doe",
        "url": "https://example.com/johndoe"
    },
    "items": []
}`)
  }, timeout)

  test('non-latin rss', async () => {
    nuxt = await setupNuxt(require('./fixture/configs/non_latin_rss'))
    let html = await get('/feed.xml')
    expect(html).toBe(`<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0">
    <channel>
        <title>Популярные новости России и мира</title>
        <link>http://site.ru/feed.xml</link>
        <description>Новости России и мира на сайте site.ru</description>
        <lastBuildDate>${date.rss}</lastBuildDate>
        <docs>http://blogs.law.harvard.edu/tech/rss</docs>
        <generator>https://github.com/nuxt-community/feed-module</generator>
    </channel>
</rss>`)
  }, timeout)

  test('no type set', async () => {
    nuxt = await setupNuxt(require('./fixture/configs/no_type'))
    expect(await get('/feed.xml')).toBe('')
  }, timeout)

  test('object rss', async () => {
    nuxt = await setupNuxt(require('./fixture/configs/object_rss'))
    let html = await get('/feed.xml')
    expect(html).toBe(`<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
        <title>Feed Title</title>
        <link>http://example.com/</link>
        <description>This is my personal feed!</description>
        <lastBuildDate>${date.rss}</lastBuildDate>
        <docs>http://blogs.law.harvard.edu/tech/rss</docs>
        <generator>awesome</generator>
        <image>
            <title>Feed Title</title>
            <url>http://example.com/image.png</url>
            <link>http://example.com/</link>
        </image>
        <copyright>All rights reserved 2013, John Doe</copyright>
        <atom:link href="https://example.com/atom" rel="self" type="application/rss+xml"/>
    </channel>
</rss>`)
  }, timeout)

  test('function rss', async () => {
    nuxt = await setupNuxt(require('./fixture/configs/function_rss'))
    let html = await get('/feed.xml')
    expect(html).toBe(`<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
        <title>Feed Title</title>
        <link>http://example.com/</link>
        <description>This is my personal feed!</description>
        <lastBuildDate>${date.rss}</lastBuildDate>
        <docs>http://blogs.law.harvard.edu/tech/rss</docs>
        <generator>awesome</generator>
        <image>
            <title>Feed Title</title>
            <url>http://example.com/image.png</url>
            <link>http://example.com/</link>
        </image>
        <copyright>All rights reserved 2013, John Doe</copyright>
        <atom:link href="https://example.com/atom" rel="self" type="application/rss+xml"/>
    </channel>
</rss>`)
  }, timeout)

  test('multi rss', async () => {
    nuxt = await setupNuxt(require('./fixture/configs/multi_rss'))

    await ['/feed.xml', '/feed1.xml'].forEach(async (path, i) => {
      const html = await get(path)
      expect(html).toBe(`<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
        <title>Feed ${i}</title>
        <link>http://example.com/</link>
        <description>This is my personal feed!</description>
        <lastBuildDate>${date.rss}</lastBuildDate>
        <docs>http://blogs.law.harvard.edu/tech/rss</docs>
        <generator>awesome</generator>
        <image>
            <title>Feed Title</title>
            <url>http://example.com/image.png</url>
            <link>http://example.com/</link>
        </image>
        <copyright>All rights reserved 2013, John Doe</copyright>
        <atom:link href="https://example.com/atom" rel="self" type="application/rss+xml"/>
    </channel>
</rss>`)
    })
  }, timeout)
})

const setupNuxt = async config => {
  const nuxt = new Nuxt(config)
  await new Builder(nuxt).build()
  await nuxt.listen(3000)

  return nuxt
}
