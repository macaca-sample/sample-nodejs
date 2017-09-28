'use strict';

require('should');
const opn = require('opn');
const path = require('path');
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
  deviceName: 'iPhone 6s',
  platformName: 'iOS',
  //autoAcceptAlerts: true,
  //reuse: 3,
  //udid: '',
  //bundleId: 'xudafeng.ios-app-bootstrap',
  app: 'https://npmcdn.com/ios-app-bootstrap@latest/build/ios-app-bootstrap.zip'
};

var androidOpts = {
  platformName: 'Android',
  autoAcceptAlerts: false,
  isWaitActivity: true,
  //reuse: 3,
  //udid: '',
  //package: 'com.github.android_app_bootstrap',
  //activity: 'com.github.android_app_bootstrap.activity.WelcomeActivity',
  app: 'https://npmcdn.com/android-app-bootstrap@latest/android_app_bootstrap/build/outputs/apk/android_app_bootstrap-debug.apk'
};

const isIOS = platform === 'ios';
const infoBoardXPath = isIOS ? '//*[@name="info"]' : '//*[@resource-id="com.github.android_app_bootstrap:id/info"]';
const webviewButtonXPath = isIOS ? '//*[@name="Webview"]' : '//*[@resource-id="android:id/tabs"]/android.widget.LinearLayout[2]';

const wd = require('macaca-wd');

// override custom wd
require('./wd-extend')(wd, isIOS);

describe('macaca-test/mobile-app-sample.test.js', function() {
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
      .init(isIOS ? iOSOpts : androidOpts)
      .sleep(10 * 1000);
  });

  after(function() {
    opn(path.join(__dirname, '..', 'reports', 'index.html'));

    return driver
      .sleep(1000)
      .quit();
  });

  afterEach(function() {
    return driver
      .customSaveScreenshot(this)
      .sleep(1000)
  });

  describe('login page test', function() {

    it('#0 should login success', function() {
      return driver
        /*
        .title()
        .then(data => {
          console.log(`current focus ${isIOS ? 'viewController' : 'activity'}: ${data}`);
        })
        */
        .getWindowSize()
        .then(size => {
          console.log(`current window size ${JSON.stringify(size)}`);
        })
        .appLogin('中文+Test+12345678', '111111');
    });

  });

  describe('home page test', function() {

    it('#0 should display home', function() {
      return driver
        .source()
        .then(res => {
          console.log(res);
        });
    });

  });

  describe('list page test', function() {

    it('#0 should scroll tableview', function() {
      return driver
        .testGetProperty()
        .waitForElementByName('HOME')
        .click()
        .waitForElementByName('list')
        .click()
        .sleep(2000);
    });

  });

  describe('gestrure page test', function() {

    it('#0 should cover gestrure', function() {
      return driver
        .waitForElementByName('Alert')
        .click()
        .sleep(5000)
        .acceptAlert()
        .sleep(1000)
        .customback()
        .waitForElementByName('Gesture')
        .click()
        .sleep(5000)
        .then(() => {
          return driver
            .touch('tap', {
              x: 100,
              y: 100
            })
            .sleep(1000)
            .elementByXPath(infoBoardXPath)
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
            .waitForElementByXPath(infoBoardXPath)
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

  });

  describe('webview page test', function() {

    it('#0 should go into webview', function() {
      return driver
        .customback()
        .sleep(3000)
        .elementByXPath(webviewButtonXPath)
        .click()
        .sleep(3000)
        .changeToWebviewContext()
        .elementById('pushView')
        .click()
        .changeToWebviewContext()
        .waitForElementById('popView')
        .click()
        .sleep(5000);
    });

    it('#1 should go into test', function() {
      return driver
        .changeToNativeContext()
        .waitForElementByName('Baidu')
        .click()
        .sleep(5000);
    });

    it('#2 should works with web', function() {
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
        .waitForElementById('index-kw')
        .sendKeys('中文+Macaca')
        .elementById('index-bn')
        .click()
        .sleep(5000)
        .source()
        .then(html => {
          html.should.containEql('Macaca');
        })
        .sleep(3000);
    });

  });

  describe('logout page test', function() {

    it('#0 should logout success', function() {
      return driver
        .changeToNativeContext()
        .waitForElementByName('PERSONAL')
        .click()
        .sleep(1000)
        .waitForElementByName('Logout')
        .click()
        .sleep(1000);
    });
  });
});
