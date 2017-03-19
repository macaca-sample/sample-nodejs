git_version = $$(git branch 2>/dev/null | sed -e '/^[^*]/d'-e's/* \(.*\)/\1/')
npm_bin= $$(npm bin)

all: test
install:
	@npm install
test:
	@echo ""
	@echo "make test-ios               Test sample for iOS"
	@echo "make test-android           Test sample for Android"
	@echo "make test-ios-safari        Test sample for iOS Safari"
	@echo "make test-android-chrome    Test sample for Android Chrome"
	@echo "make test-desktop-electron  Test sample for Desktop PC"
	@echo "make test-desktop-chrome    Test sample for Desktop PC"
	@echo "make custom-reporter        Test sample for PC with custom reporter"
test-ios:
	macaca doctor
	platform=ios macaca run --verbose -d ./macaca-test/mobile-app-sample.test.js
travis-ios: install
	npm install macaca-ios --save-dev
	${npm_bin}/macaca doctor
	platform=ios ${npm_bin}/macaca run --verbose -d ./macaca-test/mobile-app-sample.test.js
test-android:
	macaca doctor
	platform=android macaca run --verbose -d ./macaca-test/mobile-app-sample.test.js
travis-android: install
	npm install macaca-android --save-dev
	${npm_bin}/macaca doctor
	platform=android ${npm_bin}/macaca run --verbose -d ./macaca-test/mobile-app-sample.test.js
test-ios-safari:
	macaca doctor
	browser=safari macaca run --verbose -d ./macaca-test/mobile-browser-sample.test.js
travis-ios-safari: install
	npm install macaca-ios --save-dev
	${npm_bin}/macaca doctor
	browser=safari ${npm_bin}/macaca run --verbose -d ./macaca-test/mobile-browser-sample.test.js
test-android-chrome:
	macaca doctor
	browser=chrome macaca run --verbose -d ./macaca-test/mobile-browser-sample.test.js
travis-android-chrome: install
	npm install macaca-android --save-dev
	${npm_bin}/macaca doctor
	browser=chrome ${npm_bin}/macaca run --verbose -d ./macaca-test/mobile-browser-sample.test.js
test-desktop-electron:
	macaca doctor
	browser=electron macaca run --verbose -d ./macaca-test/desktop-browser-sample.test.js
travis-desktop-electron: install
	npm install macaca-electron --save-dev
	${npm_bin}/macaca doctor
	browser=electron ${npm_bin}/macaca run --no-window --verbose -d ./macaca-test/desktop-browser-sample.test.js
test-desktop-chrome:
	macaca doctor
	browser=chrome macaca run --verbose -d ./macaca-test/desktop-browser-sample.test.js
custom-reporter:
	npm install macaca-simple-reportor --save-dev
	macaca doctor
	CUSTOM_DIR=macaca-logs/desktop-browser-sample macaca run --verbose --reporter macaca-simple-reportor -d ./macaca-test/desktop-browser-sample.test.js

.PHONY: test-pc
