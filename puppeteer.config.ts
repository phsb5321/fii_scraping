const { join } = require('path');

/**
 * @type {import("puppeteer").Configuration}
 */
module.exports = {
  // Changes the cache location for Puppeteer.
  // cacheDirectory: join(__dirname, '.cache', 'puppeteer'),

  // Enables the experimental Mac ARM Chromium build.
  experiments: {
    // macArmChromiumEnabled: true,
  },
};