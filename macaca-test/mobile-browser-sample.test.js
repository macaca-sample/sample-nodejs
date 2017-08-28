'use strict';

require('should');
const opn = require('opn');
const path = require('path');
const _ = require('macaca-utils');

var browserName = process.env.browser || 'safari';
browserName = browserName.toLowerCase();

const pkg = require('../package');

const iOSSafariOpts = {
  deviceName: 'iPhone 6',
  platformName: 'iOS',
  browserName: 'Safari'
};

const AndroidChromeOpts = {
  platformName: 'Android',
  browserName: 'Chrome'
};

const wd = require('macaca-wd');

require('./wd-extend')(wd, false);

describe('macaca-test/mobile-browser-sample.test.js', function() {
  this.timeout(5 * 60 * 1000);

  var driver = wd.promiseChainRemote({
    host: 'localhost',
    port: 3456
  });

  driver.configureHttp({
    timeout: 600 * 1000
  });

  afterEach(function() {
    return driver
      .customSaveScreenshot(this)
      .sleep(1000)
  });

  after(function() {
    opn(path.join(__dirname, '..', 'reports', 'index.html'));
  });

  describe('macaca mobile sample', function() {

    return;

    before(function() {
      return driver
        .init(browserName === 'safari' ? iOSSafariOpts : AndroidChromeOpts)
        .sleep(10 * 1000);
    });

    after(function() {
      return driver
        .sleep(1000)
        .quit();
    });

    it('#0 should works with macaca', function() {
      return driver
        .get('https://www.baidu.com')
        .sleep(10 * 1000)
        .title()
        .then(title => {
          console.log(`title: ${title}`);
        })
        .url()
        .then(url => {
          console.log(`url: ${url}`);
        })
        .refresh()
        .sleep(10 * 1000)
        .elementById('index-kw')
        .getProperty('name')
        .then(info => {
          console.log(`get web attribute name: ${JSON.stringify(info)}`);
        })
        .waitForElementById('index-kw')
        .sendKeys('中文+Macaca')
        .elementById('index-bn')
        .click()
        .sleep(5000)
        .source()
        .then(html => {
          html.should.containEql('Macaca');
        })
        .execute(`document.body.innerHTML = "<h1>${pkg.name}</h1>"`)
        .sleep(3000)
        .takeScreenshot();
    });

  });
});
