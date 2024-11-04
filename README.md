# ap-sitemap

SiteMapGenerator is a Node.js module for generating sitemaps in XML format. It allows you to easily manage URLs and create sitemap files that comply with the sitemap protocol.

## Installation

To use SiteMapGenerator, first install it via npm:

```
npm install ap-sitemap
```

## Usage

### create instance

```
const SiteMapGenerator = require('ap-sitemap');

const sitemap = new SiteMapGenerator({
  baseUrl: 'https://example.com',  // change with your website domain extension
  outDir: 'sitemaps', // default is build
  limit: 50000, // default is 50000
  removeIndexExtension: true, // remove /index.html or any extension from url
});
```

### Add Pages

Use the addPages method to add pages to the sitemap. You need to pass an array of page objects, where each object contains url, updatedAt, changefreq, and priority.

```
sitemap.addPages([
  {
    url: 'https://example.com/page1',
    updatedAt: '2024-11-04T10:00:00Z',
    changefreq: 'daily',
    priority: 1.0,
  },
  {
    url: 'https://example.com/page2',
    updatedAt: '2024-11-03T10:00:00Z',
    changefreq: 'weekly',
    priority: 0.8,
  },
]);
```

### Generate Sitemap

Once you've added all your pages, you can generate the sitemap(s) by calling the generate method:

```
const sitemapUrl = generator.generate(); // https://example.com/sitemap.xml
```
