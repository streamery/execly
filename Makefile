
NPM ?= npm
NODE ?= node

all: clean build

build:
	$(NPM) install .

test:
	$(NODE) test/test.js

.PHONY: test
