# Macaca Samples 

[![build status][travis-image]][travis-url] [![Gitter Chat][gitter-image]][gitter-url]

[gitter-image]: https://img.shields.io/badge/GITTER-join%20chat-green.svg?style=flat-square
[gitter-url]: https://gitter.im/alibaba/macaca
[travis-image]: https://img.shields.io/travis/macaca-sample/sample-nodejs.svg?style=flat-square
[travis-url]: https://travis-ci.org/macaca-sample/sample-nodejs

[circle-image-0]: https://circleci.com/gh/macaca-sample/macaca-test-sample.svg?style=svg
[circle-url-0]: https://circleci.com/gh/macaca-sample/macaca-test-sample

This reposistory contains various samples that demonstrate how to use Macaca to test:

1. native iOS app
2. native android app
3. mobile Safari web app
4. mobile Chrome web app
5. desktop Electron app
6. desktop Chrome web app
7. generate custom report for desktop web app

## Start

then select one from the following

```bash
$ npm i                          Install all the depedences
$ npm run test:ios               Test sample for iOS
$ npm run test:android           Test sample for Android
$ npm run test:ios-safari        Test sample for iOS Safari
$ npm run test:android-chrome    Test sample for Android Chrome
$ npm run test:desktop-puppeteer Test sample for Desktop PC
$ npm run test:desktop-electron  Test sample for Desktop PC
$ npm run test:desktop-chrome    Test sample for Desktop PC
$ npm run test:simple-reporter   Test sample for PC with simple reporter
```

**Note**

You have to open an android emulator if you want to run it against an emulator, before you run `npm run test:android`

## Source Code of Mobile Apps

The source code of mobile apps used in this example can be found

- [ios-app-bootstrap](//github.com/xudafeng/ios-app-bootstrap)
- [android-app-bootstrap](//github.com/xudafeng/android-app-bootstrap)

## License

The MIT License (MIT)
