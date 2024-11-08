const SitemapData = require("./sitemapData");
const path = require("path");
const fs = require("fs");
const { isValidUrl, urlWithoutIndexExtension } = require("./util");

class SiteMapGenerator {
  constructor({
    baseUrl = "",
    outDir = "build",
    limit = 50000,
    removeIndexExtension = true,
  }) {
    if (!isValidUrl(baseUrl)) {
      throw new Error("baseUrl is not valid");
    }
    this.baseUrl = baseUrl;
    this.outDir = path.join(process.cwd(), outDir);
    this.removeIndexExtension = removeIndexExtension;
    this.numberOfUrlPerFileLimit = parseInt(limit);
    this._data = new Set(); // Store unique SitemapData instances
    this.#ensureOutDirExists();
  }

  // Public method to add pages to the sitemap
  addPages(pages) {
    if (!Array.isArray(pages)) {
      throw new Error("Expected an array of pages");
    }

    pages.forEach((item) => {
      try {
        const sitemapData = new SitemapData({
          url: this.removeIndexExtension
            ? urlWithoutIndexExtension(item.url)
            : item.url,
          updatedAt: new Date(item.updatedAt),
          changefreq: item.changefreq,
          priority: item.priority,
        });

        if (!this.#hasUrl(sitemapData.url)) {
          this._data.add(sitemapData);
        } else {
          console.warn(`Duplicate URL found: ${sitemapData.url}`);
        }
      } catch (error) {
        console.error("Error adding page:", error.message);
      }
    });
  }

  generate() {
    this.#deleteExistingSitemaps();
    const pages = this.#getPages();
    const totalPages = pages.length;
    const sitemapFiles = []; // Prepare to save sitemaps

    if (totalPages > this.numberOfUrlPerFileLimit) {
      // Generate multiple sitemap files based on the limit
      for (let i = 0; i < totalPages; i += this.numberOfUrlPerFileLimit) {
        const chunk = pages.slice(i, i + this.numberOfUrlPerFileLimit);
        const sitemapContent = this.#generateSitemapXML(chunk);
        const filename = `sitemap-${
          Math.floor(i / this.numberOfUrlPerFileLimit) + 1
        }.xml`;
        const filePath = path.join(this.outDir, filename);

        fs.writeFileSync(filePath, sitemapContent, { encoding: "utf8" });
        console.log(`Sitemap saved to ${filePath}`);
        sitemapFiles.push(filename); // Store the sitemap filename for the index
      }

      // Generate the sitemap index file
      this.#generateSitemapIndex(sitemapFiles);
    } else {
      // Generate a single sitemap file
      const sitemapContent = this.#generateSitemapXML(pages);
      const singleFilePath = path.join(this.outDir, "sitemap.xml");
      fs.writeFileSync(singleFilePath, sitemapContent, { encoding: "utf8" });
      console.log(`Single sitemap saved to ${singleFilePath}`);
    }

    return `${new URL("sitemap.xml", this.baseUrl).href}`;
  }

  #ensureOutDirExists() {
    if (!fs.existsSync(this.outDir)) {
      fs.mkdirSync(this.outDir, { recursive: true });
      console.log(`Output directory created at: ${this.outDir}`);
    }
  }

  #hasUrl(url) {
    return Array.from(this._data).some((item) => item.url === url);
  }

  #getPages() {
    return Array.from(this._data);
  }

  #deleteExistingSitemaps() {
    const existingFiles = this.#getExistingSitemapFiles();
    existingFiles.forEach((file) => {
      const filePath = path.join(this.outDir, file);
      fs.unlinkSync(filePath);
      console.log(`Deleted existing sitemap file: ${filePath}`);
    });
  }

  #getExistingSitemapFiles() {
    return fs
      .readdirSync(this.outDir)
      .filter((file) => /^sitemap(-\d+)?\.xml$/.test(file));
  }

  #generateSitemapIndex(sitemapFiles) {
    const indexEntries = sitemapFiles
      .map(
        (filename) => `
      <sitemap>
        <loc>${this.baseUrl}/${filename}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
      </sitemap>`
      )
      .join("\n");

    const sitemapIndexContent = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${indexEntries}
    </sitemapindex>`;

    const indexFilePath = path.join(this.outDir, "sitemap.xml");
    fs.writeFileSync(indexFilePath, sitemapIndexContent, { encoding: "utf8" });
  }

  #generateSitemapXML(pages) {
    const xmlPages = pages
      .map(
        (page) => `
      <url>
        <loc>${page.url}</loc>
        <lastmod>${page.updatedAt.toISOString()}</lastmod>
        <changefreq>${page.changefreq}</changefreq>
        <priority>${page.priority}</priority>
      </url>`
      )
      .join("\n");

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${xmlPages}
    </urlset>`;
  }
}

module.exports = SiteMapGenerator;
