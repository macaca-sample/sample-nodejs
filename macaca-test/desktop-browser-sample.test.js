'use strict';

require('should');
const wd = require('macaca-wd');

var browser = process.env.browser || 'electron';
browser = browser.toLowerCase();

describe('macaca desktop sample', function() {
  this.timeout(5 * 60 * 1000);

  var driver = wd.promiseChainRemote({
    host: 'localhost',
    port: 3456
  });
  const initialURL = 'https://www.baidu.com';

  before(() => {
    return driver
      .init({
        platformName: 'desktop',
        browserName: browser
      })
      .maximize()
      .setWindowSize(1280, 800);
  });

  it('#0 should go into macaca', function() {
    return driver
      .get(initialURL)
      .sleep(3000);
  });

  it('#1 should works with macaca', function() {
    return driver
      .elementById('kw')
      .sendKeys('macaca')
      .sleep(3000)
      .elementById('su')
      .click()
      .sleep(5000)
      .source()
      .then(function(html) {
        html.should.containEql('macaca');
      })
      .hasElementByCss('#head > div.head_wrapper')
      .then(function(hasHeadWrapper) {
        hasHeadWrapper.should.be.true();
      })
      .elementByXPathOrNull('//*[@id="kw"]')
      .sendKeys(' elementByXPath')
      .sleep(3000)
      .elementById('su')
      .click()
      .sleep(5000)
      .saveScreenshot('pic1');
  });

  it('#2 should go into web', function() {
    return driver
      .get(initialURL)
      .sleep(3000);
  });

  it('#3 should works with web', function() {
    return driver
      .elementById('kw')
      .sendKeys('Macaca')
      .sleep(3000)
      .elementById('su')
      .click()
      .sleep(5000)
      .source()
      .then(function(html) {
        html.should.containEql('Macaca');
      })
      .saveScreenshot('pic2');
  });

  after(() => {
    return driver
      .quit();
  });
});
