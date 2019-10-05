'use strict';

const wd = require('macaca-wd');

require('./wd-extend')(wd, false);

var browser = process.env.browser || 'electron' || 'puppeteer';
browser = browser.toLowerCase();

describe('macaca-test/desktop-browser-sample.test.js', function() {
  this.timeout(5 * 60 * 1000);

  var driver = wd.promiseChainRemote({
    host: 'localhost',
    port: process.env.MACACA_SERVER_PORT || 3456
  });

  beforeEach(() => {
    return driver
      .init({
        platformName: 'desktop',
        browserName: browser,
        userAgent: `Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0 Safari/537.36 Macaca Custom UserAgent`,
        deviceScaleFactor: 2
      })
      .setWindowSize(1280, 800);
  });

  afterEach(function() {
    return driver
      .customSaveScreenshot(this)
      .quit();
  });

  describe('macaca desktop sample', function() {
    it('#0 should be ok', function() {
      return driver
        .nlpSection(`
          访问 https://www.baidu.com
          等待 3秒
          在第一个输入框输入 Macaca
          点击百度一下按钮
        `);
    });
  });
});
