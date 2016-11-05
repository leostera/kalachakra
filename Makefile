.PHONY: all
.PHONY: flow-stop check check-coverage test lint
.PHONY: assets styles source build package
.PHONY: server clean
.PHONY: tags

DIST_DIR  =./dist
BUILD_DIR =./lib
BIN_DIR   =./node_modules/.bin
SCRIPT_DIR=./scripts
TEST_DIR  =./tests
BENCH_DIR =./tests/perf

DIR=.

BRANCH ?=$(shell git rev-parse --abbrev-ref HEAD)
VERSION =$(shell git describe --tags HEAD)
REVISION=$(shell git rev-parse HEAD)
STAMP   =$(REVISION).$(shell date +%s)

all: setup check lint test package

ci: all

setup:
	$(SCRIPT_DIR)/symlink.sh

flow-stop:
	$(BIN_DIR)/flow stop

check:
	$(BIN_DIR)/flow

check-coverage:
	$(SCRIPT_DIR)/check-coverage.sh

bench:
	$(BENCH_DIR)/run.js

test:
	$(BIN_DIR)/jest

lint:
	$(BIN_DIR)/eslint ./src

build: dirs source

dirs:
	mkdir -p $(BUILD_DIR) $(DIST_DIR)

constants:
	VERSION="$(VERSION)" \
	REVISION="$(REVISION)" \
	STAMP="$(STAMP)" \
	NODE_ENV="$(NODE_ENV)" \
		envsubst < src/_metadata.js > src/metadata.js

source: 
	$(BIN_DIR)/browserify \
		src/index.js \
		--debug \
		-t babelify \
		| $(BIN_DIR)/exorcist $(BUILD_DIR)/bundle.js.map \
		> $(BUILD_DIR)/_bundle.js
	mv $(BUILD_DIR)/_bundle.js $(BUILD_DIR)/bundle.js

package: clean build
	cp -r index.html $(BUILD_DIR) $(DIST_DIR)
	sed -i 's build/bundle build/$(STAMP) g' $(DIST_DIR)/index.html
	sed -i 's build/index build/$(STAMP) g'  $(DIST_DIR)/index.html
	mv $(DIST_DIR)/$(BUILD_DIR)/index.css $(DIST_DIR)/$(BUILD_DIR)/$(STAMP).css
	$(BIN_DIR)/uglifyjs $(DIST_DIR)/$(BUILD_DIR)/bundle.js > $(DIST_DIR)/$(BUILD_DIR)/$(STAMP).js
	rm $(DIST_DIR)/$(BUILD_DIR)/bundle.js
	gzip -c -9 $(DIST_DIR)/$(BUILD_DIR)/$(STAMP).css > $(DIST_DIR)/$(BUILD_DIR)/$(STAMP).css.gz
	gzip -c -9 $(DIST_DIR)/$(BUILD_DIR)/$(STAMP).js  > $(DIST_DIR)/$(BUILD_DIR)/$(STAMP).js.gz

server:
	$(BIN_DIR)/static-server -n $(DIR)/index.html -f $(DIR)

tags:
	rm -f tags
	ctags .

clean:
	rm -rf $(BUILD_DIR) $(DIST_DIR) tags

cleanall: clean
	rm -rf node_modules
