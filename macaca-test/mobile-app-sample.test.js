'use strict';

require('should');
const xml2map = require('xml2map');
const KEY_MAP = require('webdriver-keycode');

var platform = process.env.platform || 'iOS';
platform = platform.toLowerCase();

const pkg = require('../package');

/**
 * download app form npm
 *
 * or use online resource: https://npmcdn.com/ios-app-bootstrap@latest/build/ios-app-bootstrap.zip
 *
 * npm i ios-app-bootstrap --save-dev
 *
 * var opts = {
 *   app: path.join(__dirname, '..', 'node_modules', 'ios-app-bootstrap', 'build', 'ios-app-bootstrap.zip');
 * };
 */

// see: https://macacajs.github.io/desired-caps

var iOSOpts = {
  deviceName: 'iPhone 6',
  platformName: 'iOS',
  autoAcceptAlerts: false,
  //reuse: 3,
  //udid: '',
  //bundleId: 'xudafeng.ios-app-bootstrap',
  app: 'https://npmcdn.com/ios-app-bootstrap@latest/build/ios-app-bootstrap.zip'
};

var androidOpts = {
  platformName: 'Android',
  autoAcceptAlerts: false,
  //reuse: 3,
  //udid: '',
  //package: 'com.github.android_app_bootstrap',
  //activity: 'com.github.android_app_bootstrap.activity.WelcomeActivity',
  app: 'https://npmcdn.com/android-app-bootstrap@latest/android_app_bootstrap/build/outputs/apk/android_app_bootstrap-debug.apk'
};

const isIOS = platform === 'ios';
const infoBoardId = isIOS ? 'info' : 'com.github.android_app_bootstrap:id/info';

const wd = require('macaca-wd');

// override custom wd
require('./wd-extend')(wd, isIOS);

describe('macaca mobile sample', function() {
  this.timeout(10 * 60 * 1000);

  const driver = wd.promiseChainRemote({
    host: 'localhost',
    port: 3456
  });

  driver.configureHttp({
    timeout: 600 * 1000
  });

  before(function() {
    return driver
      .init(isIOS ? iOSOpts : androidOpts);
  });

  after(function() {
    return driver
      .sleep(1000)
      .quit();
  });

  it('#1 should login success', function() {
    return driver
      .getWindowSize()
      .then(size => {
        console.log(`current window size ${JSON.stringify(size)}`);
      })
      .sleep(20 * 1000)
      .appLogin('中文+Test+12345678', '111111')
      .sleep(1000);
  });

  it('#2 should display home', function() {
    return driver
      .source()
      .then(res => {
        var xml = xml2map.tojson(res);
        console.log(xml);
      })
      .takeScreenshot();
  });

  it('#3 should scroll tableview', function() {
    return driver
      .testGetProperty()
      .elementByName('HOME')
      .click()
      .elementByName('list')
      .click()
      .sleep(2000);
  });

  it('#4 should cover gestrure', function() {
    return driver
      .elementByName('Alert')
      .click()
      .sleep(3000)
      .acceptAlert()
      .sleep(1000)
      .customback()
      .elementByName('Gesture')
      .click()
      .sleep(1000)
      .then(() => {
        return driver
          .touch('tap', {
            x: 100,
            y: 100
          })
          .sleep(1000);
      })
      .then(() => {
        return driver
          .touch('tap', {
            x: 100,
            y: 100
          })
          .sleep(1000)
          .elementById(infoBoardId)
          .text()
          .then(text => {
            JSON.stringify(text).should.containEql('singleTap');
          });
      })
      .then(() => {
        return driver
          .touch('press', {
            x: 100,
            y: 100,
            duration: 2
          })
          .sleep(1000);
      })
      .then(() => {
        return driver
          .elementById(infoBoardId)
          .touch('pinch', {
            scale: 2,      // only for iOS
            velocity: 1,   // only for iOS
            direction: 'in',// only for Android
            percent: 0.2,  // only for Android
            steps: 200     // only for Android
          })
          .sleep(1000);
      })
      /*
      // TODO Android rotate
      .then(() => {
        return driver
          .touch('rotate', {
          })
          .sleep(1000);
      })*/
      .customback()
      .then(() => {
        return driver
          .touch('drag', {
            fromX: 100,
            fromY: 600,
            toX: 100,
            toY: 100,
            duration: 3
          })
          .sleep(1000);
      })
      .sleep(1000);
  });

  it('#5 should go into webview', function() {
    return driver
      .customback()
      .elementByName('Webview')
      .click()
      .sleep(3000)
      .takeScreenshot()
      .changeToWebviewContext()
      .elementById('pushView')
      .click()
      .changeToNativeContext()
      .then(() => {
        return driver
          .touch('tap', {
            x: 100,
            y: 100
          })
          .sleep(1000);
      })
      .sleep(5000)
      .changeToWebviewContext()
      .elementById('popView')
      .click()
      .sleep(5000)
      .takeScreenshot();
  });

  it('#6 should go into test', function() {
    return driver
      .changeToNativeContext()
      .elementByName('Baidu')
      .click()
      .sleep(5000)
      .takeScreenshot();
  });

  it('#7 should works with web', function() {
    return driver
      .changeToWebviewContext()
      .title()
      .then(title => {
        console.log(`title: ${title}`);
      })
      .url()
      .then(url => {
        console.log(`url: ${url}`);
      })
      .refresh()
      .sleep(2000)
      .elementById('index-kw')
      .getProperty('name')
      .then(info => {
        console.log(`get web attribute name: ${JSON.stringify(info)}`);
      })
      .elementById('index-kw')
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

  it('#8 should logout success', function() {
    return driver
      .changeToNativeContext()
      .elementByName('PERSONAL')
      .click()
      .sleep(1000)
      .takeScreenshot()
      .elementByName('Logout')
      .click()
      .sleep(1000)
      .takeScreenshot();
  });
});
