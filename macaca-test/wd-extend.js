'use strict';

const path = require('path');
const _ = require('macaca-utils');
const KEY_MAP = require('webdriver-keycode');
const appendToContext = require('macaca-reporter').appendToContext;

// npm package wrapper sample: https://github.com/macaca-sample/webdriver-client

module.exports = (wd, isIOS) => {
  wd.addPromiseChainMethod('customback', function() {
    if (isIOS) {
      return this
        .waitForElementByName('list')
        .click()
        .sleep(1000);
    }

    return this
      .back()
      .sleep(3000);
  });

  wd.addPromiseChainMethod('appLogin', function(username, password) {
    if (isIOS) {
      return this
        .waitForElementByXPath('//XCUIElementTypeTextField[1]')
        .clear()
        .sendKeys(username)
        .waitForElementByXPath('//XCUIElementTypeSecureTextField[1]')
        .clear()
        .sendKeys(password)
        .sleep(1000)
        .sendKeys('\n')
        .waitForElementByName('Login')
        .click()
        .sleep(5000);
    }

    return this
      .waitForElementsByClassName('android.widget.EditText', {}, 120000)
      .then(function(els) {
        return els[0];
      })
      .clear()
      .sendKeys(username)
      .elementByXPath('//android.widget.EditText[1]')
      .getProperty('value')
      .then(info => {
        console.log(`element value: ${JSON.stringify(info)}`);
      })
      .sleep(1000)
      .waitForElementsByClassName('android.widget.EditText')
      .then(function(els) {
        return els[1];
      })
      .clear()
      .sendKeys(password)
      .keys(`${KEY_MAP.ENTER}${KEY_MAP.ESCAPE}`)
      .sleep(1000)
      .source()
      .waitForElementByName('Login')
      .click()
      .sleep(5000);
  });

  wd.addPromiseChainMethod('changeToNativeContext', function() {
    return this
      .contexts()
      .then(arr => {
        return this
          .context(arr[0]);
      });
  });

  wd.addPromiseChainMethod('changeToWebviewContext', function() {
    if (isIOS) {
      return this
        .contexts()
        .then(arr => {
          return this
            .context(arr[arr.length - 1]);
        });
    }

    return this
      .contexts()
      .then(arr => {
        return this
          .context(arr[arr.length - 1]);
      })
      .windowHandles()
      .then(handles => {
        if (handles.length > 1) {
          return this
            .window(handles[handles.length - 1]);
        }
      })
      .catch(e => {
        console.log(e);
      })
      .sleep(1000);
  });

  wd.addPromiseChainMethod('testGetProperty', function() {
    if (isIOS) {
      return this
        .waitForElementByName('list')
        .getProperty('isVisible')
        .then(info => {
          console.log(`isVisible: ${JSON.stringify(info)}`);
        })
        .waitForElementByName('list')
        .getProperty('isAccessible')
        .then(info => {
          console.log(`element isAccessible: ${JSON.stringify(info)}`);
        })
        .waitForElementByName('list')
        .getProperty('isEnabled')
        .then(info => {
          console.log(`element isEnabled: ${JSON.stringify(info)}`);
        })
        .waitForElementByName('list')
        .getProperty('type')
        .then(info => {
          console.log(`element type: ${JSON.stringify(info)}`);
        })
        .waitForElementByName('list')
        .getProperty('label')
        .then(info => {
          console.log(`element label: ${JSON.stringify(info)}`);
        })
        .waitForElementByName('list')
        .getProperty('name')
        .then(info => {
          console.log(`element name: ${JSON.stringify(info)}`);
        })
        .waitForElementByName('list')
        .getProperty('value')
        .then(info => {
          console.log(`element value: ${JSON.stringify(info)}`);
        });
    }

    // for Android

    return this
      .waitForElementByName('list')
      .getProperty('description') // content-desc
      .then(d => {
        console.log(d);
      });
  });

  wd.addPromiseChainMethod('customSaveScreenshot', function(context) {
    const filepath = path.join(__dirname, '..', 'screenshots', `${_.uuid()}.png`);
    const reportspath = path.join(__dirname, '..', 'reports');
    _.mkdir(path.dirname(filepath));

    return this
      .saveScreenshot(filepath)
      .then(() => {
        appendToContext(context, `${path.relative(reportspath, filepath)}`);
      });
  });

};
