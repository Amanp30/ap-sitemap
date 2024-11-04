const { isValidUrl } = require("./util");

class SitemapData {
  static VALID_CHANGEFREQS = [
    "always",
    "hourly",
    "daily",
    "weekly",
    "monthly",
    "yearly",
    "never",
  ];

  constructor({
    url = "",
    updatedAt = new Date(),
    changefreq = "daily",
    priority = "0.5",
  }) {
    this.url = this.validateUrl(url);
    this.updatedAt = this.validateDate(updatedAt);
    this.changefreq = this.validateChangefreq(changefreq);
    this.priority = this.validatePriority(priority);
  }

  validateUrl(url) {
    const urlPattern = /^(https?:\/\/)/; // Start with http:// or https://
    if (!urlPattern.test(url)) {
      throw new Error("URL must start with http:// or https://");
    }

    if (isValidUrl(url)) {
      return url;
    } else {
      throw new Error(`invalid url  `);
    }
  }

  validateDate(date) {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      throw new Error(
        `Invalid date provided for updatedAt for url ${this.url}`
      );
    }
    return parsedDate;
  }

  validateChangefreq(changefreq) {
    if (!SitemapData.VALID_CHANGEFREQS.includes(changefreq)) {
      throw new Error(
        `Invalid changefreq value for  url ${
          this.url
        }. Must be one of: ${SitemapData.VALID_CHANGEFREQS.join(", ")}`
      );
    }
    return changefreq;
  }

  validatePriority(priority) {
    const numPriority = Number(priority);
    if (isNaN(numPriority) || numPriority < 0 || numPriority > 1) {
      throw new Error(
        `Priority must be a number between 0 and 1 for url ${this.url}`
      );
    }
    return numPriority.toFixed(1);
  }
}

module.exports = SitemapData;
