# Copyright 2016 Google Inc. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

SHA     := $(shell git rev-parse --short HEAD)
DATE    := $(shell TZ=UTC date +%FT%T)Z
VERSION := $(shell cat VERSION)

APP = claat
OUTDIR := bin

PLATFORMS = linux/amd64 linux/arm64 linux/386 windows/amd64 windows/arm64 windows/386 darwin/amd64 darwin/arm64

release:
	rm -rf $(OUTDIR)
	mkdir -p $(OUTDIR)
	for p in $(PLATFORMS); do \
		OS=$${p%/*}; \
		ARCH=$${p#*/}; \
		OUT=$(APP); \
		if [ "$$OS" = "windows" ]; then OUT=$(APP).exe; fi; \
		FOLDER=$(APP)-v$(VERSION)-$${OS}-$${ARCH}; \
		mkdir -p $(OUTDIR)/$$FOLDER; \
		CGO_ENABLED=0 GOOS=$$OS GOARCH=$$ARCH go build -ldflags "-X main.version=$(VERSION)-$(DATE)-$(SHA) -s -w" -o $(OUTDIR)/$$FOLDER/$$OUT; \
		cp ../LICENSE $(OUTDIR)/$$FOLDER/; \
		cp README.md $(OUTDIR)/$$FOLDER/; \
		if [ "$$OS" = "windows" ]; then \
			(cd $(OUTDIR) && zip -r $$FOLDER.zip $$FOLDER); \
		else \
			(cd $(OUTDIR) && tar -czf $$FOLDER.tar.gz $$FOLDER); \
		fi; \
	done
	echo $(VERSION)-$(DATE)-$(SHA) > $(OUTDIR)/VERSION
	cd $(OUTDIR) && sha256sum $(APP)-*.tar.gz $(APP)-*.zip > checksums.txt