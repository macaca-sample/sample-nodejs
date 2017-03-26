'use strict';

require('should');
const path = require('path');
const wd = require('macaca-wd');

const diffImage = require('./utils.js').diffImage;

var browser = process.env.browser || 'electron';
browser = browser.toLowerCase();

describe('macaca desktop sample', function() {
  this.timeout(5 * 60 * 1000);

  var driver = wd.promiseChainRemote({
    host: 'localhost',
    port: 3456
  });

  before(() => {
    return driver
      .init({
        platformName: 'desktop',
        browserName: browser
      })
      .maximize()
      .setWindowSize(1280, 800);
  });

  it('#0 should be ok', function() {
    const url = path.join(__dirname, './pages/desktop-sample.html');
    return driver
      .get(`file://${url}`)
      .sleep(3000)
      .execute(`document.querySelector('#select').selectedIndex = 1`)
      .sleep(1000)
      .elementById('select')
      .getProperty('value')
      .then(value => {
        value.should.be.equal('2');
      })
      .execute(`
        var element = document.querySelector('#hover_text');
        var event = document.createEvent('MouseEvent');
        event.initMouseEvent('mouseover', true, true);
        element.dispatchEvent(event);
      `)
      .elementById('hover_text')
      .getComputedCss('color')
      .then(value => {
        value.should.containEql('255');
      })
      // https://github.com/macacajs/macaca-electron#windowalert
      .execute(`
        var e = document.createElement('div');
        e.id = 'alert_msg';
        window.alert = function() {
          e.innerHTML = JSON.stringify(arguments[0]);
          document.body.appendChild(e);
	      };
      `)
      .elementById('alert_button')
      .click()
      .elementById('alert_msg')
      .text()
      .then(value => {
        value.should.containEql('this message is from alert');
      })
      .sleep(3000);
  });

  it('#1 should works with online pages', function() {
    const initialURL = 'https://www.baidu.com';

    return driver
      .get(initialURL)
      .sleep(3000)
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

  it('#2 should works with web', function() {
    const initialURL = 'https://www.baidu.com';
    return driver
      .get(initialURL)
      .sleep(3000)
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

  it('#3 should works with iframe', function() {
    const iframeURL = 'https://rawgit.com/xudafeng/use-tinyMce-textEditor/master/index.html';

    return driver
      .get(iframeURL)
      .sleep(3000)
      .frame('mce_0_ifr')
      .elementById('tinymce')
      .sendKeys('这是一段测试')
      .sleep(3000)
      .takeScreenshot()
      .then(imgData => {
        const newImg = new Buffer(imgData, 'base64');
        const screenshotFolder = path.resolve(__dirname, '../screenshot');
        fs.writeFileSync(path.join(screenshotFolder, 'diff.png'), newImg.toString('binary'), 'binary')

        const oldImgPath = path.join(screenshotFolder, 'origin.png');
        const diffImgPath = path.join(screenshotFolder, 'diff.png');
        return diffImage(oldImgPath, newImg, 0.1, diffImgPath);
      })
      .then(result => {
        result.should.be.true();
      })
      .catch(e => {
        console.log(e);
      });
  });

  after(() => {
    return driver
      .quit();
  });
});
