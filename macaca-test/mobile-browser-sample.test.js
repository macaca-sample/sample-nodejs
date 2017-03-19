'use strict';

require('should');
const _ = require('macaca-utils');

var browserName = process.env.browser || 'safari';
browserName = browserName.toLowerCase();

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

describe('macaca mobile sample', function() {
  this.timeout(5 * 60 * 1000);

  var driver = wd.promiseChainRemote({
    host: 'localhost',
    port: 3456
  });

  driver.configureHttp({
    timeout: 600 * 1000
  });

  before(function() {
    return driver
      .init(browserName === 'safari' ? iOSSafariOpts : AndroidChromeOpts);
  });

  after(function() {
    return driver
      .sleep(1000)
      .quit();
  });

  it('#0 should works with macaca', function() {
    return driver
      .get('http://www.baidu.com')
      .elementById('index-kw')
      .sendKeys('macaca')
      .elementById('index-bn')
      .click()
      .sleep(5000)
      .source()
      .then(html => {
        html.should.containEql('macaca');
      })
      .takeScreenshot();
  });

  it('#1 should works with web', function() {
    return driver
      .get('https://www.baidu.com')
      .elementById('index-kw')
      .sendKeys('Macaca')
      .elementById('index-bn')
      .click()
      .sleep(5000)
      .source()
      .then(html => {
        html.should.containEql('Macaca');
      })
      .takeScreenshot();
  });

});
